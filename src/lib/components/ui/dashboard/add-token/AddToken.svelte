<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { allAddresses } from '$lib/stores';
	let tokenAddress: string = '';
	let tokenid: string;
	let selectedAccount: any;
	$: accounts = allAddresses;

	function addToken() {}
</script>

<div class="flex flex-col">
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
	<div class="flex flex-row space-x-1 space-y-1 rounded border">
		<Label for="token_address">Token address</Label>
		<Input bind:value={tokenAddress} id="token_address" placeholder="Enter Token address" />
	</div>
	<div class="flex flex-row space-x-1 space-y-1 rounded border">
		<Label for="token_address">Token id</Label>
		<Input bind:value={tokenid} id="token_address" placeholder="Enter Token id" />
	</div>

	<Button on:click={addToken}>Import</Button>
</div>
