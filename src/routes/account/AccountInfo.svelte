<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { allAddresses } from '$lib/stores';
	import type { AccountType } from '$lib/utils';
	import type { Selected } from 'bits-ui';

	let selectedAccount: Selected<AccountType> | undefined = undefined;

	$: accounts = allAddresses;

	let selectedPlatforms: string[] = [];

	const stakingPlatforms = [...Array(20)].map((_, __) => ({
		name: 'aave',
		details: 'ETH',
		reward: '0.05 APY',
		link: 'https:www.example.com'
	}));

	function platFormClicked(platform: any) {
		selectedPlatforms.push(platform.name);
	}

	function saveChanges() {}
</script>

<div class="m-1 flex flex-col space-y-2">
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

	{#if selectedAccount != undefined}
		<div class="flex flex-row space-x-2 rounded-xl border">
			<Label for="contract_address">Savings Address</Label>
			{selectedAccount.value.savingsAddress}
		</div>

		{#if selectedAccount.value.staking == null || selectedAccount.value.staking == undefined}
			<div>
				Your savings account is currently not linked to any paltform, select below and save it to
				link
			</div>
		{:else}
			<div>
				Your savings account is currently linked to the paltform below, select a different one and
				save it to change
			</div>
			<Label>Your account is currently linked to:</Label>
			// show the stuff if is linked to
			{selectedAccount.value.staking.name}
			{selectedAccount.value.staking.link}
		{/if}
		// show all staking platforms
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
	{/if}

	<Button on:click={saveChanges}>Save Changes</Button>
</div>
