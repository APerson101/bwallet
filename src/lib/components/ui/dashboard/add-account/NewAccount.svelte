<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { addAllTokens, createNewAccount, deploySavingsContract } from '$lib/helper';

	import { allAddresses } from '$lib/stores';
	import type { AccountType } from '$lib/utils';
	import { HDNodeWallet } from 'ethers';
	import { copyText } from 'svelte-copy';

	import toast, { Toaster } from 'svelte-french-toast';

	let currentPhase = 0;
	let coppiedToClipboard = false;
	let selectedLockPeriod: string = '1';
	let phrases: string[] | undefined = undefined;
	let checked = false;
	let newlyCreatedAccount: HDNodeWallet | undefined = undefined;
	let selectedPlatforms: string[] = [];
	let contractAddress = '';
	async function generateAccount() {
		const account = createNewAccount();
		contractAddress = await deploySavingsContract(account.address, account.privateKey);
		phrases = account.mnemonic?.phrase.split(' ');
		newlyCreatedAccount = account;
		currentPhase = 1;
	}

	function platFormClicked(platform: any) {
		selectedPlatforms.push(platform.name);
	}
	async function closeOpenedView() {
		const request = window.indexedDB.open('Wallets', 1);
		request.onsuccess = () => {
			if (newlyCreatedAccount != undefined) {
				const db = request.result;
				const txn = db.transaction(['wallets-store'], 'readwrite');
				const walletStore = txn.objectStore('wallets-store');
				const newWallet: AccountType = {
					address: newlyCreatedAccount.address,
					privateKey: newlyCreatedAccount.privateKey,
					value: '0',
					balance: '0',
					savingsAddress: contractAddress,
					nfts: [],
					lockPeriod: selectedLockPeriod,
					staking: null,
					receipts: [],
					tokens: addAllTokens()
				};
				const wrequests = walletStore.add(newWallet);
				txn.oncomplete = (e) => {
					allAddresses.set([...$allAddresses, newWallet]);
					toast.success('Succesfully Created new wallet');
				};
			}
		};
	}
	const stakingPlatforms = [...Array(20)].map((_, __) => ({
		name: 'aave',
		details: 'ETH',
		reward: '0.05 APY',
		link: 'https:www.example.com'
	}));
	function copyToClipboard() {
		copyText(phrases?.join(' ') ?? '');
		toast.success('Copied to clipboard');
		coppiedToClipboard = true;
	}
</script>

{#if currentPhase == 0}
	<div class="flex flex-col justify-around space-y-2">
		<p>
			A new savings account would be created for you, a seed phrase would be generated, store it in
			a secure place or whatever
		</p>
		<div class="h-[200px]"></div>
		<Button on:click={generateAccount}>Create</Button>
	</div>
{:else if currentPhase == 1}
	<div class="flex flex-col space-y-2">
		<div class="m-1 grid grid-cols-3 gap-2 border p-1">
			{#if phrases != undefined}
				{#each phrases as word}
					<div class="flex flex-row space-x-1 p-1">
						{phrases.indexOf(word) + 1}. {word}
					</div>
				{/each}
			{/if}
		</div>
		<Button on:click={copyToClipboard}>Copy phrases</Button>

		{#if coppiedToClipboard}
			<div class="h-[80px]"></div>

			<Button on:click={() => (currentPhase = 2)}>Next</Button>
		{/if}
	</div>
{:else if currentPhase == 2}
	<div class="flex h-4/5 flex-col justify-around space-y-2">
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
		<p>Select Stake platform to link to your account</p>
		{#if checked == false}
			<div class="h-[250px] space-y-2 overflow-y-auto">
				{#each stakingPlatforms as platform}
					<div class="flex space-x-2">
						<Checkbox on:click={() => platFormClicked(platform)} />
						<div class="flex flex-col">
							<Label>{platform.name}</Label>
							<Label>{platform.details}</Label>
							<Label>{platform.link}</Label>
							<Label>{platform.reward}</Label>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<div class="flex space-x-2">
			<Checkbox bind:checked id="skip_staking" on:click={() => (selectedPlatforms = [])} />
			<Label for="skip_staking">Skip for now</Label>
		</div>
		<Button on:click={async () => await closeOpenedView()}>Import</Button>
	</div>
{/if}

<Toaster />
