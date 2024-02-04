<script lang="ts">
	import { WalletConnectApp } from '$lib/backend/walletconnect';
	import Navmenu from '$lib/components/ui/navmenu/Navmenu.svelte';
	import { fetchAccountBalance } from '$lib/helper';
	import { allAddresses, currentScreen, walletConnection } from '$lib/stores';
	import { Core } from '@walletconnect/core';

	import type { AccountType, UserToken } from '$lib/utils';
	import { Web3Wallet } from '@walletconnect/web3wallet';
	import { onMount } from 'svelte';
	import Dashboard from './dashboard/+page.svelte';
	import Savings from './savings/+page.svelte';
	import Transactions from './transactions/+page.svelte';
	let db: IDBDatabase;
	onMount(async () => {
		const values = await dbCreation();
		console.log(values);
		if (values != null) {
			await upDateTokenBalances(values as AccountType[]);
		}
		await intializeWalletConnect();
	});

	async function intializeWalletConnect() {
		const core = new Core({
			projectId: 'd30e22f5ae624752279ead86919f8885'
		});
		const walletConnectwallet = await Web3Wallet.init({
			core,
			metadata: {
				name: 'Demo app',
				description: 'Demo Client as Wallet/Peer',
				url: 'www.walletconnect.com',
				icons: []
			}
		});
		const wconnect = new WalletConnectApp(walletConnectwallet);
		await wconnect.initializeAddress();

		walletConnection.set(wconnect);
	}
	async function upDateTokenBalances(adds: AccountType[]) {
		console.log('did this page even work at all sef');
		const updatedAdds = [];
		for (let index = 0; index < adds.length; index++) {
			const address = adds[index];
			//fetch eth balance
			const ethBalance = await fetchAccountBalance(address.address);
			console.log('eth balance:', ethBalance);
			const response = await fetch(
				`https://pegasus.lightlink.io/api/v2/addresses/${address.address}/tokens?type=ERC-20%2CERC-721%2CERC-1155`
			);
			const data = (await response.json()).items;
			console.log('Tokens balances:', data);
			const tokens: UserToken[] = [];
			for (let index = 0; index < data.length; index++) {
				let tokenInfo: UserToken = {
					token: {
						id: '',
						address: '',
						name: '',
						decimals: 0,
						type: 'erc20',
						icon_url: '',
						symbol: '',
						exchange_rate: ''
					},
					balance: ''
				};
				const tokenData = data[index];
				tokenInfo = {
					balance: tokenData.value,
					token: {
						id: tokenData.token_instance?.id ?? null,
						name: tokenData.token.name,
						decimals: parseInt(tokenData.token.decimals),
						type: 'erc20',
						symbol: tokenData.token.symbol,
						address: tokenData.token.address,
						exchange_rate: tokenData.token.exchange_rate ?? '1.0',
						icon_url: tokenData.token.icon_url
					}
				};
				tokens.push(tokenInfo);
			}
			tokens.push({
				balance: ethBalance,
				token: {
					id: 'eth',
					name: 'Ether',
					decimals: 18,
					type: 'eth',
					symbol: 'Eth',
					address: 'unknown yet',
					exchange_rate: '2300',
					icon_url: 'unknown'
				}
			});
			console.log('mapped data', tokens);
			adds[index].balance = ethBalance;
			adds[index].tokens = tokens;
		}
		allAddresses.set([...adds]);
	}
	async function dbCreation() {
		try {
			const request = window.indexedDB.open('Wallets', 1);
			return new Promise((resolve, reject) => {
				request.onupgradeneeded = () => {
					db = request.result;
					const store = db.createObjectStore('wallets-store', {
						keyPath: 'address'
					});

					store.createIndex(
						'index[address + privateKey + phrase + value + balance + savingsAddress]',
						['address', 'privateKey', 'phrase', 'value', 'balance', 'savingsAddress'],
						{ unique: false }
					);
					store.createIndex('tokensIndex', 'tokens', { multiEntry: true });
					store.createIndex('nftsIndex', 'nfts', { multiEntry: true });
					store.createIndex('receiptsIndex', 'receipts', { multiEntry: true });
				};
				request.onsuccess = () => {
					db = request.result;
					const txn = db.transaction(['wallets-store'], 'readonly');
					const walletStore = txn.objectStore('wallets-store');
					const wrequests = walletStore.getAll();

					txn.oncomplete = (e) => {
						resolve(wrequests.result as AccountType[]);
						// allAddresses.set(wrequests.result as AccountType[]);
					};
				};
				request.onerror = (event) => {
					console.log(request.error);
					reject(request.error);
				};
			});
		} catch (error) {
			console.log('Error opening indexedDB: ', error);
			throw error;
		}
	}
</script>

<Navmenu />

<div class="mb-3 ml-[65px] mr-3 mt-3 h-[800px] flex-col md:ml-[180px]">
	{#if $currentScreen == 0}
		<Dashboard />
	{:else if $currentScreen == 1}
		<Transactions />
	{:else if $currentScreen == 2}
		<Savings />
	{/if}
</div>
