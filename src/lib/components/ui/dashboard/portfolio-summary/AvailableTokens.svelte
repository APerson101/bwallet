<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';

	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Label } from '$lib/components/ui/label';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getSavingstokens } from '$lib/firebasehelper';
	import { fetchAccountBalance, retreiveFunds } from '$lib/helper';
	import { allAddresses } from '$lib/stores';
	import type { LockedFunds } from '$lib/utils';
	import Icon from '@iconify/svelte';

	async function retreiveFund(lockID: string, pk: string) {
		await retreiveFunds(lockID, pk);
	}
	async function getReleasedFunds() {
		let lockedFunds: LockedFunds[] = [];
		for (let index = 0; index < $allAddresses.length; index++) {
			const address = $allAddresses[index];
			const tokens = await getSavingstokens(address.address, address.savingsAddress, true);
			const balance = await fetchAccountBalance(address.address);
			lockedFunds.push({
				address: address.address,
				tokens: tokens.filter((item) => parseInt(item.releaseDate) > Date.now()),
				value: balance
			});
		}
		return lockedFunds;
	}

	$: releasedFunds = getReleasedFunds();

	function filterItems(address: string, items: LockedFunds[]) {
		const filtered = items.filter((item) => item.address == address);
		if (filtered.length > 0) return filtered[0].tokens;
		else return [];
	}
</script>

<div>Available tokens</div>
{#await releasedFunds}
	<div class="flex items-center space-x-4">
		<Skeleton class="h-12 w-12 rounded-full" />
		<div class="space-y-2">
			<Skeleton class="h-4 w-[250px]" />
			<Skeleton class="h-4 w-[200px]" />
		</div>
	</div>
{:then released}
	<div class="m-1 flex h-max flex-col space-y-2 p-2">
		{#each $allAddresses as address}
			<Collapsible.Root>
				<Collapsible.Trigger>
					<div class="flex flex-col p-2">
						<Label>
							{address.address.substring(0, 5)}...{address.address.substring(
								address.address.length - 5,
								address.address.length
							)}
						</Label>
					</div>
				</Collapsible.Trigger>
				<Collapsible.Content class="space-y-2">
					{#each address.tokens as token}
						<div class="flex flex-row space-x-2 border p-1">
							<Avatar.Root class="h-7 w-7">
								<Avatar.Image src={token.token.icon_url} />
								<Avatar.Fallback>
									<Icon height="24px" width="24px" icon="mdi:ethereum" />
								</Avatar.Fallback>
							</Avatar.Root>
							<Label>
								{parseFloat(token.balance).toFixed(5)}
							</Label>
						</div>
					{/each}
				</Collapsible.Content>
				<p>Released funds</p>
				{#each filterItems(address.address, released) as aFunds}
					<div class="flex flex-col space-x-1 space-y-1 rounded-xl border p-2">
						<p>{aFunds.amount}</p>
						<p>sent on:{aFunds.sentDate}</p>
						<p>Released on:{aFunds.releaseDate}</p>
						<Button on:click={() => retreiveFund(aFunds.lockId, address.privateKey)} variant="ghost"
							>Retreive</Button
						>
					</div>
				{/each}
			</Collapsible.Root>
		{/each}
	</div>
{/await}
