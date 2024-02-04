<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import ImportAccount from './ImportAccount.svelte';
	import NewAccount from './NewAccount.svelte';

	let currentView = 0;
	function createNewAccount() {
		currentView = 1;
	}
	function importAccount() {
		currentView = 2;
	}
	function goBack() {
		currentView = 0;
	}
</script>

{#if currentView == 0}
	<div class="m-2 flex flex-col justify-center space-y-3 p-4">
		<Button on:click={createNewAccount}>Create New Account</Button>
		<center>Or</center>
		<Button on:click={importAccount}>Import Account</Button>
	</div>
{:else if currentView == 1}
	<Button on:click={goBack} size="icon" variant="outline">
		<Icon icon="lets-icons:back-light" />
	</Button>
	<!-- creation -->
	<NewAccount />
{:else if currentView == 2}
	<div class="flex flex-col space-y-2">
		<Button on:click={goBack} size="icon" variant="outline">
			<Icon icon="lets-icons:back-light" />
		</Button>
		<!--importation -->
		<ImportAccount />
	</div>
{/if}
