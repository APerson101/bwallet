<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Textarea } from '$lib/components/ui/textarea';

	import { deploySavingsContract, loadWalletFromPK, loadWalletFromPhrase } from '$lib/helper';
	import { allAddresses } from '$lib/stores';
	import type { AccountType } from '$lib/utils';
	import { HDNodeWallet, Wallet } from 'ethers';
	import toast, { Toaster } from 'svelte-french-toast';
	let selectedLockPeriod: string = '1';
	let seedPhase: string | undefined = undefined;
	let private_key: string | undefined = undefined;
	let savingsAddress: string = '';
	async function importWallet() {
		if (seedPhase || private_key != undefined) {
			let loadedWallet: HDNodeWallet | Wallet;
			if (seedPhase != undefined) {
				loadedWallet = loadWalletFromPhrase(seedPhase);
			} else if (private_key != undefined) {
				loadedWallet = loadWalletFromPK(private_key);
			}
			savingsAddress = await deploySavingsContract(loadedWallet!.address, loadedWallet!.privateKey);

			// save new wallet
			const request = window.indexedDB.open('Wallets', 1);
			request.onsuccess = () => {
				if (loadedWallet != undefined) {
					const db = request.result;
					const txn = db.transaction(['wallets-store'], 'readwrite');
					const walletStore = txn.objectStore('wallets-store');
					const newWallet: AccountType = {
						address: loadedWallet.address,
						privateKey: loadedWallet.privateKey,
						savingsAddress: savingsAddress,
						value: '0',
						balance: '0',
						tokens: [],
						nfts: [],
						lockPeriod: selectedLockPeriod,
						staking: null,
						receipts: []
					};
					const wrequests = walletStore.add(newWallet);
					txn.oncomplete = (e) => {
						allAddresses.set([...$allAddresses, newWallet]);
						toast.success('Succesfully imported wallet');
					};
				}
			};
		}
	}

	let selectedImportType = 0;
</script>

<div class="flex w-fit flex-row gap-2 rounded-lg border-2 p-2">
	<Button
		variant={selectedImportType == 0 ? undefined : 'ghost'}
		class={selectedImportType == 0 ? 'bg-slate-800 p-2 text-white' : 'p-2 text-slate-800'}
		on:click={() => (selectedImportType = 0)}>Private Key</Button
	>
	<Button
		variant={selectedImportType == 1 ? undefined : 'ghost'}
		class={selectedImportType == 1 ? 'bg-slate-800 p-2 text-white' : 'p-2 text-slate-800'}
		on:click={() => (selectedImportType = 1)}>Seed phrase</Button
	>
</div>
{#if selectedImportType == 1}
	<div>
		<Label for="seed">Enter seed words</Label>
		<Textarea id="seed" placeholder="Enter seed words" bind:value={seedPhase} />
	</div>
{:else}
	<div>
		<Label for="private_key">Enter private Key</Label>
		<Input id="private_key" placeholder="Enter private key " bind:value={private_key} />
	</div>
	<p>Select lock period</p>
	<RadioGroup.Root value={selectedLockPeriod} class="flex flex-row">
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="1" id="1month" />
			<Label for="1month">1 Month</Label>
		</div>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="3" id="3month" />
			<Label for="3month">3 Month</Label>
		</div>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="6" id="6month" />
			<Label for="6month">6 Month</Label>
		</div>
	</RadioGroup.Root>
{/if}
<div class="h-[140px]"></div>
<Button class="mt-24" on:click={importWallet}>Import</Button>
<Toaster />
