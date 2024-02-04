<script lang="ts">
	import AvailableTokens from '$lib/components/ui/dashboard/portfolio-summary/AvailableTokens.svelte';

	import LockedTokens from '$lib/components/ui/dashboard/portfolio-summary/LockedTokens.svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { fetchAccountBalance } from '$lib/helper';
	import { allAddresses } from '$lib/stores';
	import type { AccountType } from '$lib/utils';
	import '@fontsource/permanent-marker';

	import Icon from '@iconify/svelte';
	let totalPendingEthers = 0.0;
	let totalAvailableEthers = 0.0;
	async function getValue(allAddresses: AccountType[]) {
		totalPendingEthers = 0.0;
		totalAvailableEthers = 0.0;
		let totalTokens = 0.0;
		for (let index = 0; index < allAddresses.length; index++) {
			const address = allAddresses[index];
			const pendingbalance = await fetchAccountBalance(address.savingsAddress);
			const availablebalance = await fetchAccountBalance(address.address);

			for (let index = 0; index < address.tokens.length; index++) {
				const token = address.tokens[index];
				totalTokens += parseFloat(
					(parseFloat(token.balance) * parseFloat(token.token.exchange_rate)).toFixed(3)
				);
			}
			totalPendingEthers += parseFloat(pendingbalance);
			totalAvailableEthers += parseFloat(availablebalance);
		}
		// totalAvailableEthers += totalTokens;

		return [
			{
				icon: 'twemoji:locked',
				text: 'Locked Assets',
				description: 'All locked tokens across all accounts',
				index: 0,
				color: 'bg-[#f7a399]',
				value: totalPendingEthers.toString()
			},
			{
				icon: 'twemoji:unlocked',
				text: 'Accessible Assets',
				color: 'bg-[#aaf683]',
				description: 'All available tokens across all accounts',
				index: 1,
				value: totalAvailableEthers.toString()
			}
		];
	}

	$: balances = getValue($allAddresses);
</script>

<Label for="pp" class="text-white">Portfolio Summary</Label>
<div class=" flex flex-col rounded-xl border" id="pp">
	<div class="flex flex-row items-center justify-evenly">
		{#await balances}
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
		{:then portfolioButtons}
			<div
				class="flex flex-col items-center justify-center space-y-2 rounded border bg-[#5fb49c] p-2"
			>
				<Icon style="color:#857d0a" icon="icon-park-outline:funds" width="24px" height="24px" />
				<Label id="mm" class="font- mm text-lg font-bold text-black"
					>ETH {(totalAvailableEthers + totalPendingEthers).toFixed(5)}</Label
				>
				<Label id="mm" class="mm text-green-700"
					>($ {((totalAvailableEthers + totalPendingEthers) * 2300).toFixed(2)})</Label
				>
				<Label class="text-black">Total Assets</Label>
			</div>
			{#each portfolioButtons as pbutton}
				<Sheet.Root>
					<Sheet.Trigger>
						<div
							class="m-1 flex flex-col {pbutton.color} items-center justify-center space-y-2 rounded border p-2"
						>
							<Icon icon={pbutton.icon} width="24px" height="24px" />
							<Label class="text-lg font-bold text-black"
								>ETH {parseFloat(pbutton.value).toFixed(5)}</Label
							>
							<Label class="text-green-700"
								>($ {(parseFloat(pbutton.value) * 2300).toFixed(2)})</Label
							>
							<Label class="text-black">{pbutton.text}</Label>
						</div>
					</Sheet.Trigger>
					<Sheet.Content side="right" class="m-4 max-h-[750px] overflow-y-auto rounded-xl">
						<Sheet.Header>
							<Sheet.Title>
								{pbutton.text}
							</Sheet.Title>
							<Sheet.Description>
								{pbutton.description}
							</Sheet.Description>
						</Sheet.Header>
						{#if pbutton.index == 0}
							<LockedTokens />
						{:else}
							<AvailableTokens />
						{/if}
					</Sheet.Content>
				</Sheet.Root>
			{/each}
		{/await}
	</div>
</div>

<style>
	.mm {
		font-family: 'Permanent Marker';
	}
</style>
