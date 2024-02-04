<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { allAddresses } from '$lib/stores';
	import { copyText } from 'svelte-copy';
	import toast, { Toaster } from 'svelte-french-toast';

	import QrCode from '@castlenine/svelte-qrcode';
	import Icon from '@iconify/svelte';

	let selectedAccount: any;
	function copyToClipboard() {
		copyText(selectedAccount!.label);
		toast.success('Copied to clipboard');
	}
</script>

<div class="m-1 flex flex-col items-center justify-center space-y-4 p-2">
	<!-- account -->
	<Select.Root bind:selected={selectedAccount} portal={null}>
		<Select.Trigger class="w-[250px]">
			<Select.Value placeholder="Select Account" />
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Accounts</Select.Label>
				{#each $allAddresses as account}
					<Select.Item
						class="m-2"
						value={account.value}
						label="{account.address.substring(0, 5)}...{account.address.substring(
							account.address.length - 5,
							account.address.length
						)}"
					>
						<div>
							<Card.Title
								>"{account.address.substring(0, 5)}...{account.address.substring(
									account.address.length - 5,
									account.address.length
								)}"</Card.Title
							>
							<Card.Description>{account.balance}</Card.Description>
						</div>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="selectedAccount" />
	</Select.Root>
	{#if selectedAccount != undefined}
		<!-- qrcode of account -->
		<QrCode content={selectedAccount.label} />

		<!-- text literal of the acount  -->
		<Card.Root>
			<Card.Content class="flex flex-row items-stretch justify-between space-x-4 p-4">
				<Label for="btn" class="pt-3">{selectedAccount.label}</Label>
				<Button on:click={copyToClipboard} class="btn" variant="outline" size="icon">
					<Icon icon="iconamoon:copy-thin" />
				</Button>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<Toaster />
