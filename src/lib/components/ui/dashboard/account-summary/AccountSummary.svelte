<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { allAddresses } from '$lib/stores';
	import type { AccountType } from '$lib/utils';
	import type { Selected } from 'bits-ui';
	import AccountTable from './AccountTable.svelte';
	$: accounts = allAddresses;
	let selectedAccount: Selected<AccountType> | undefined;
	let selectedView = 0;
</script>

<div class="flex flex-col space-y-2 rounded-xl border p-3">
	<Label class="text-white">Account Details</Label>
	<div class="flex flex-row space-x-3">
		<!-- account -->
		<Select.Root bind:selected={selectedAccount} portal={null}>
			<Select.Trigger class="w-[250px]">
				<Select.Value placeholder="Select Account" class="text-white" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Accounts</Select.Label>
					{#each $accounts as account}
						<Select.Item
							class="m-2"
							value={account}
							label="{account.address.substring(0, 5)}...{account.address.substring(
								account.address.length - 5,
								account.address.length
							)}"
						>
							<div class="flex flex-col space-y-2">
								<Label
									>{account.address.substring(0, 5)}...{account.address.substring(
										account.address.length - 5,
										account.address.length
									)}</Label
								>
								<Label>ETH {parseFloat(account.balance).toFixed(5)}</Label>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="selectedAccount" />
		</Select.Root>
		{#if selectedAccount != undefined}
			<div class="flex flex-row rounded-xl border text-white">
				<Button
					on:click={() => {
						if (selectedView != 0) selectedView = 0;
					}}
					variant="ghost"
					class={selectedView == 0 ? 'bg-slate-400' : 'bg-transparent'}>Tokens</Button
				>
				<Button
					on:click={() => {
						if (selectedView != 1) selectedView = 1;
					}}
					variant="ghost"
					class={selectedView == 1 ? 'bg-slate-400' : 'bg-transparent'}>NFTS</Button
				>
				<Button
					on:click={() => {
						if (selectedView != 2) selectedView = 2;
					}}
					variant="ghost"
					class={selectedView == 2 ? 'bg-slate-400' : 'bg-transparent'}>Receipts</Button
				>
			</div>
		{/if}
	</div>

	{#if selectedAccount != undefined}
		{#if selectedView == 0}
			<AccountTable
				table={{
					caption: 'Tokens your account holds',
					headers: ['index', 'name', 'quantity', 'value'],
					data: [
						...selectedAccount.value.tokens.map((token, index) => [
							(index + 1).toString(),
							token.token.name,
							parseFloat(token.balance).toFixed(5).toString(),
							(parseFloat(token.token.exchange_rate) * parseInt(token.balance)).toFixed(5)
						])
					]
				}}
			/>
		{:else if selectedView == 1}
			<AccountTable
				table={{
					caption: 'NFTs your account holds',
					headers: ['index', 'name', 'quantity', 'address'],
					data: [
						...selectedAccount.value.nfts.map((token, index) => [
							(index + 1).toString(),
							token.token.name,
							parseFloat(token.balance).toFixed(5).toString(),
							token.token.address.substring(0, 5)
						])
					]
				}}
			/>
		{:else}
			<AccountTable
				table={{
					caption: 'Your weekly savings statement',
					headers: ['index', 'date', 'balance', 'address'],
					data: [
						...selectedAccount.value.receipts.map((receipt, index) => [
							(index + 1).toString(),
							receipt.date,
							receipt.value,
							receipt.address.substring(0, 5)
						])
					]
				}}
			/>
		{/if}
	{:else}
		<div class="text-white">Select an accout to view the details</div>
	{/if}
</div>
