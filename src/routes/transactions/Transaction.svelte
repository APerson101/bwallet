<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { AccountType } from '$lib/utils';
	import type { Selected } from 'bits-ui';

	import { allAddresses } from '$lib/stores';

	import AccountTable from '$lib/components/ui/dashboard/account-summary/AccountTable.svelte';
	let selectedAccount: Selected<AccountType> | undefined = undefined;

	$: accounts = allAddresses;
	$: accountTransaction = getAccountTransaction(selectedAccount);
	async function getAccountTransaction(selected: any) {
		if (!selected) {
			return [];
		}
		const response = await fetch(
			`https://pegasus.lightlink.io/api/v2/addresses/${
				selectedAccount!.value.address
			}/transactions?filter=to%20%7C%20from`
		);
		const data = await response.json();
		console.log(data.items);

		const mapped = data.items.map((dt: any, index: number) => [
			index + 1,
			dt.from.hash,
			dt.to?.hash ?? '-',
			dt.value,
			dt.timestamp
		]);
		return mapped;
	}
</script>

<div class="m-1 flex flex-col p-2">
	<!-- account -->
	<Select.Root bind:selected={selectedAccount} portal={null}>
		<Select.Trigger class="w-[250px]">
			<Select.Value placeholder="Select Account" />
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
						<div>
							<Card.Title
								>"{account.address.substring(0, 5)}...{account.address.substring(
									account.address.length - 5,
									account.address.length
								)}"</Card.Title
							>
							<Card.Description>{account.value}</Card.Description>
						</div>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="selectedAccount" />
	</Select.Root>

	<Label for="table">Activity Information</Label>
	{#await accountTransaction}
		<div class="flex items-center space-x-4">
			<div class="space-y-2 rounded border p-2">
				<Skeleton class="h-12 w-12 rounded-full" />
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[150px]" />
			</div>
			<div class="space-y-2 rounded border p-2">
				<Skeleton class="h-12 w-12 rounded-full" />
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[150px]" />
			</div>
			<div class="space-y-2 rounded border p-2">
				<Skeleton class="h-12 w-12 rounded-full" />
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[150px]" />
			</div>
		</div>
	{:then data}
		<AccountTable
			table={{
				headers: ['s/n', 'sender', 'receiver', 'amount', 'date'],
				caption: 'Transaction information for the selected Account',
				data: data
			}}
		/>
	{/await}
</div>
