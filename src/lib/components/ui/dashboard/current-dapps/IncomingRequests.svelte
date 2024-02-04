<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { allAddresses, pendingConnections, walletConnection } from '$lib/stores';

	$: allRequests = getPending($pendingConnections);

	async function acceptConnection(request: any) {
		const pk = $allAddresses.filter(
			(item) => item.address.toLowerCase() == request.message.from.toLowerCase()
		)[0].privateKey;
		await $walletConnection.approveDapp(pk, request);
	}
	async function rejectConnection(request: any) {
		await $walletConnection.rejectDapp(request);
	}
	async function getPending(pending: any) {
		const allConnted = [];
		console.log(pending);
		for (let index = 0; index < pending.length; index++) {
			const element = pending[index];
			const connected = await $walletConnection.getConnectedDapps(element.message.from);
			const it = connected.filter((item) => item.topic == element.topic)[0];
			allConnted.push({ info: element, data: it });
		}
		return allConnted;
	}

	function getSavings(amount: number) {
		const usdvalue = amount * 2300;
		const total = Math.ceil(usdvalue);
		const saving = total - usdvalue;
		return { savings: saving, total: total };
	}
</script>

<div class="w-1/2">
	<Label class="text-white" for="d">Signing Requests</Label>
	<div id="d" class="flex space-x-1 overflow-x-auto">
		{#await allRequests}
			<div class="flex items-center space-x-4">
				<Skeleton class="h-12 w-12 rounded-full" />
				<div class="space-y-2">
					<Skeleton class="h-4 w-[250px]" />
					<Skeleton class="h-4 w-[200px]" />
				</div>
			</div>
		{:then requests}
			{#if requests.length > 0}
				{#each requests as request}
					<div class="m-2 flex flex-col space-y-2 rounded-xl border p-2">
						<div class="flex flex-row">
							<Avatar.Root class="h-7 w-7">
								<Avatar.Image src={request.data.icon} />
								<Avatar.Fallback>DP</Avatar.Fallback>
							</Avatar.Root>
							<Label>
								{request.data.name}
							</Label>
						</div>
						<Label>Eth {parseInt(request.info.message.value) / 10 ** 18}</Label>
						<Label>usd {(parseInt(request.info.message.value) / 10 ** 18) * 2300}</Label>
						<Label
							>Savings {getSavings(parseInt(request.info.message.value) / 10 ** 18).savings}</Label
						>
						<Label>Total {getSavings(parseInt(request.info.message.value) / 10 ** 18).total}</Label>
						<hr />
						<div class="flex flex-row space-x-2">
							<Button on:click={() => acceptConnection(request.info)}>Accept</Button>
							<Button variant="destructive" on:click={() => rejectConnection(request.info)}
								>Reject</Button
							>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex items-center justify-center">
					<Label class="text-white">No requests</Label>
				</div>
			{/if}
		{/await}
	</div>
</div>
