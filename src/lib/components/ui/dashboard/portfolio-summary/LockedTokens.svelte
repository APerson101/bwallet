<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getSavingstokens } from '$lib/firebasehelper';
	import { fetchAccountBalance } from '$lib/helper';
	import { allAddresses } from '$lib/stores';
	import type { LockedFunds } from '$lib/utils';

	async function getLockedFunds() {
		let lockedFunds: LockedFunds[] = [];
		for (let index = 0; index < $allAddresses.length; index++) {
			const address = $allAddresses[index];
			const tokens = await getSavingstokens(address.address, address.savingsAddress);
			const balance = await fetchAccountBalance(address.savingsAddress);
			lockedFunds.push({
				address: address.address,
				tokens: tokens.filter((item) => parseInt(item.releaseDate) > Date.now()),
				value: balance
			});
		}
		return lockedFunds;
	}

	$: lockedFunds = getLockedFunds();
</script>

<div>Locked tokens</div>
<div class="m-1 flex h-max flex-col space-y-2 p-2">
	{#await lockedFunds}
		<p>loading locked funds</p>
	{:then lockedFunds}
		{#each lockedFunds as lockedfund}
			<Collapsible.Root>
				<Collapsible.Trigger>
					<div class="flex flex-col p-2">
						{lockedfund.address}
						{lockedfund.value}
					</div>
				</Collapsible.Trigger>
				<Collapsible.Content class="space-y-2">
					{#each lockedfund.tokens as lockedtoken}
						<div class="flex flex-col border p-1">
							amount: {lockedtoken.amount}
							release date: {lockedtoken.releaseDate}
							sent date: {lockedtoken.sentDate}
						</div>
					{/each}
				</Collapsible.Content>
			</Collapsible.Root>
		{/each}
	{/await}
</div>
