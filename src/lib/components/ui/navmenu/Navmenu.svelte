<script lang="ts">
	import { currentScreen } from '$lib/stores';
	import IconifyIcon from '@iconify/svelte';
	type MenuItem = {
		name: string;
		icon: string;
	};

	const dashboard: MenuItem = {
		name: 'Dashboard',
		icon: 'radix-icons:dashboard'
	};
	const transactions: MenuItem = {
		name: 'Transactions',
		icon: 'icon-park-outline:transaction-order'
	};
	const savings: MenuItem = {
		name: 'Savings',
		icon: 'clarity:savings-line'
	};

	const items = [dashboard, transactions, savings];
	$: itemColor = 'bg-transparent';
	let hoverIndex: MenuItem | null;
	function changeSelection(pageIndex: number) {
		currentScreen.set(pageIndex);
	}

	let outerHeight = 0;
	$: console.log(outerHeight);
</script>

<svelte:window bind:outerHeight />

<div class="fixed h-dvh">
	<nav class="m-2 flex h-5/6 max-w-[50px] justify-center rounded-lg bg-gray-600 md:max-w-48">
		<ul class="flex flex-col">
			{#each items as menuItem}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<li
					on:click={() => changeSelection(items.indexOf(menuItem))}
					class="m-3 rounded-lg p-2 {$currentScreen == items.indexOf(menuItem)
						? 'bg-emerald-100'
						: menuItem == hoverIndex
							? 'bg-slate-500'
							: 'bg-transparent'}"
					on:mouseenter={() => {
						hoverIndex = menuItem;
					}}
					on:mouseleave={() => {
						hoverIndex = null;
					}}
				>
					<div class="flex flex-row space-x-2">
						<IconifyIcon
							class={$currentScreen == items.indexOf(menuItem) ? 'red-icon' : 'blue-icon'}
							icon={menuItem.icon}
							width="24px"
							height="24px"
						/>
						<p
							class="{$currentScreen == items.indexOf(menuItem)
								? 'font-bold text-black'
								: 'text-g font-normal'} hidden md:block"
						>
							{menuItem.name}
						</p>
					</div>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<!-- // create a new account // send funds //account history //savings account //bridge //connect to
other stuff -->
