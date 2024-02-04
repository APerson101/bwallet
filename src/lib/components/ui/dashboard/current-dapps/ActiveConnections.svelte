<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { allAddresses, refereshActiveConnections, walletConnection } from '$lib/stores';
	import type { AccountType, DappConnection } from '$lib/utils';
	import type { Selected } from 'bits-ui';
	$: accounts = allAddresses;
	let selectedAccount: Selected<AccountType> | undefined;
	$: connections = getConnections(selectedAccount?.value?.address ?? '');
	async function disconnect(connection: DappConnection) {
		await $walletConnection.disconnectDapp(connection);
		connections = $walletConnection.getConnectedDapps(selectedAccount?.value.address);
	}
	$: if ($refereshActiveConnections) {
		connections = getConnections(selectedAccount?.value?.address);
	}
	async function getConnections(address: string | undefined) {
		if ($walletConnection != undefined) return $walletConnection.getConnectedDapps(address);
		return [];
	}
</script>

<div class="w-1/2">
	<Label class="text-white" for="apps">Connected Apps</Label>
	<div id="apps">
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
							class="w-max"
							value={account}
							label="{account.address.substring(0, 5)}...{account.address.substring(
								account.address.length - 5,
								account.address.length
							)}"
						>
							<div class="flex justify-stretch space-x-5">
								<Avatar.Root>
									<Avatar.Fallback>{$accounts.indexOf(account) + 1}</Avatar.Fallback>
								</Avatar.Root>
								<div class="flex flex-col space-y-1">
									<Label>
										{account.address.substring(0, 5)}...{account.address.substring(
											account.address.length - 5,
											account.address.length
										)}</Label
									>
									<Card.Description>Eth {parseFloat(account.balance).toFixed(5)}</Card.Description>
								</div>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="selectedAccount" />
		</Select.Root>
		{#if selectedAccount != undefined}
			{#await connections}
				<div class="flex items-center space-x-4">
					<Skeleton class="h-12 w-12 rounded-full" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-[250px]" />
						<Skeleton class="h-4 w-[200px]" />
					</div>
				</div>
			{:then activeConnections}
				{#if activeConnections.length > 0}
					<div class="mt-5 flex flex-row space-x-2 overflow-x-auto">
						{#each activeConnections as connection}
							<div class="flex flex-col space-y-2 rounded-xl border p-2">
								<div class="flex flex-row space-x-2">
									<Avatar.Root class="h-7 w-7">
										<Avatar.Image src={connection.icon} />
										<Avatar.Fallback>DP</Avatar.Fallback>
									</Avatar.Root>
									<Label>{connection.name}</Label>
								</div>
								<hr />
								<Button on:click={() => disconnect(connection)} variant="destructive"
									>Disconnect</Button
								>
							</div>
						{/each}
					</div>
				{:else}
					<Label class="mt-3 flex items-center justify-center">No connected apps</Label>
				{/if}
			{/await}
		{:else}
			<div class="mt-3 flex items-center justify-center">
				<Label class="text-white">Select account to view connected apps</Label>
			</div>
		{/if}
	</div>
</div>
