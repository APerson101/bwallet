<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AccountSummary from '$lib/components/ui/dashboard/account-summary/AccountSummary.svelte';
	import AddAccount from '$lib/components/ui/dashboard/add-account/AddAccount.svelte';
	import ActiveConnections from '$lib/components/ui/dashboard/current-dapps/ActiveConnections.svelte';
	import IncomingRequests from '$lib/components/ui/dashboard/current-dapps/IncomingRequests.svelte';
	import PortfolioSummary from '$lib/components/ui/dashboard/portfolio-summary/PortfolioSummary.svelte';
	import QrAccount from '$lib/components/ui/dashboard/qr-code/QrAccount.svelte';
	import SendButton from '$lib/components/ui/dashboard/sendbutton/SendButton.svelte';
	import { Label } from '$lib/components/ui/label';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import TestDapp from '$lib/test/TestDapp.svelte';
	import Icon from '@iconify/svelte';

	type actionButtonType = {
		label: string;
		icon: string;
		description: string;
		index: number;
	};
	const actionButtons: actionButtonType[] = [
		{
			label: 'send',
			description: 'Send tokens',
			icon: 'iconamoon:send-thin',
			index: 0
		},
		{
			label: 'receive',
			description: 'Via your account and QRCode',
			icon: 'uiw:qrcode',
			index: 1
		},
		{
			label: 'add account',
			description: 'Create new acount',
			icon: 'tdesign:blockchain',
			index: 2
		},

		// {
		// 	label: 'add token',
		// 	description: 'Add new Token',
		// 	icon: 'mingcute:add-line',
		// 	index: 4
		// },
		{
			label: 'Connect App',
			description: 'Test connection',
			icon: 'mingcute:add-line',
			index: 5
		}
	];
	let outerHeight = 0;
</script>

<svelte:window bind:outerHeight />
<div class="m-1 flex flex-col space-y-8 p-3">
	<div class="flex grow-[1] basis-24 flex-row items-center justify-end space-x-3">
		{#each actionButtons as btn}
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						class="space-x-2 bg-transparent text-white"
					>
						<Icon icon={btn.icon} width="20px" height="20px" />
						<Label>
							{btn.label}
						</Label></Button
					>
				</Sheet.Trigger>
				<Sheet.Content side="right" class="m-4 max-h-[750px] rounded-xl">
					<Sheet.Header>
						<Sheet.Title>
							{btn.label}
						</Sheet.Title>
						<Sheet.Description>
							{btn.description}
						</Sheet.Description>
					</Sheet.Header>
					{#if btn.index == 0}
						<SendButton />
					{:else if btn.index == 1}
						<QrAccount />
					{:else if btn.index == 2}
						<AddAccount />
						<!-- {:else if btn.index == 4}
						<AddToken /> -->
					{:else if btn.index == 5}
						<TestDapp />
					{/if}
				</Sheet.Content>
			</Sheet.Root>
		{/each}
	</div>
	<div class="flex flex-row">
		<ActiveConnections />
		<Separator orientation="vertical" />
		<IncomingRequests />
	</div>
	<div class="grow-[1] basis-48">
		<PortfolioSummary />
	</div>
	<div class="grow-1 basis-96">
		<AccountSummary />
	</div>
</div>
