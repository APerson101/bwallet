<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { allAddresses, dappAddress, walletConnection } from '$lib/stores';
	import type { AccountType } from '$lib/utils';
	import type { Selected } from 'bits-ui';
	$: accounts = allAddresses;

	let selectedAccount: Selected<AccountType> | undefined = undefined;

	let enteredUrl: string = '';

	async function test() {
		dappAddress.set(selectedAccount?.value.address ?? ' ');
		await $walletConnection.pair(enteredUrl, selectedAccount?.value.address ?? ' ');
	}
</script>

<div class="m-1 flex flex-col space-y-2 p-2">
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
	<Input bind:value={enteredUrl} placeholder="enter url" />

	<Button on:click={test}>Test Dapp connection</Button>
</div>
