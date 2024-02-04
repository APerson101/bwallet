<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { addSavingsContract } from '$lib/firebasehelper';
	import { transferEther, transferToSavings, transferToken } from '$lib/helper';
	import { allAddresses } from '$lib/stores';
	import type { AccountType, UserToken } from '$lib/utils';
	import type { Selected } from 'bits-ui';
	import toast, { Toaster } from 'svelte-french-toast';

	$: accounts = allAddresses;
	let selectedAsset: Selected<UserToken> | undefined = undefined;
	let enteredAmount: string | undefined = undefined;
	let receiver: string | undefined = undefined;
	let selectedAccount: Selected<AccountType> | undefined = undefined;

	$: savingsAmount = () => {
		if (enteredAmount != undefined && selectedAsset != undefined) {
			// console.log(selectedAsset.value.token.value!);
			const toConvert =
				parseFloat(selectedAsset.value.token.exchange_rate!) * parseFloat(enteredAmount);
			// console.log(Math.ceil(toConvert));
			return Math.ceil(toConvert);
		} else return 0;
	};
	$: computeAmount = () => {
		if (selectedAsset != undefined && enteredAmount != undefined) {
			return parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount);
			// console.log(am);
		}
	};
	function completeSend() {
		toast.promise(transferAsset(), {
			loading: 'Sending...',
			success: 'Transfer successful',
			error: 'Failed to send'
		});
	}
	async function transferAsset() {
		if (selectedAsset!.value.token.type != 'erc20') {
			await transferEther(receiver!, enteredAmount!, selectedAccount!.value.privateKey);
		} else {
			await transferToken(
				receiver!,
				selectedAsset!.value.token.decimals,
				enteredAmount!,
				selectedAsset!.value.token.address,
				selectedAccount!.value.privateKey
			);
		}
		const savingsEther =
			(savingsAmount() -
				parseFloat(selectedAsset!.value.token.exchange_rate) * parseFloat(enteredAmount!)) *
			(1 / parseFloat(selectedAsset!.value.token.exchange_rate));

		const lockId = await transferToSavings(
			selectedAccount!.value.savingsAddress,
			savingsEther.toFixed(18).toString(),
			selectedAccount!.value.privateKey,
			parseInt(selectedAccount?.value.lockPeriod ?? '1') * 2592000
		);

		await addSavingsContract(
			selectedAccount!.value.savingsAddress,
			selectedAccount!.value.address,
			{
				amount: savingsEther.toString(),
				lockId: lockId.toString(),
				sentDate: Date.now().toString(),
				releaseDate: (
					Date.now() +
					parseInt(selectedAccount?.value.lockPeriod ?? '1') * 2592000
				).toString()
			}
		);
		toast.success('Succesfully sent funds');
	}
</script>

<div class="flex flex-col space-y-4">
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
								>{account.address.substring(0, 5)}...{account.address.substring(
									account.address.length - 5,
									account.address.length
								)}</Card.Title
							>
							<Card.Description>{account.value}</Card.Description>
						</div>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="selectedAccount" />
	</Select.Root>

	<!-- asset -->
	{#if selectedAccount != undefined}
		<Select.Root bind:selected={selectedAsset} portal={null}>
			<Select.Trigger class="w-[250px]">
				<Select.Value placeholder="Select Asset" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Assets</Select.Label>
					{#each selectedAccount.value.tokens as asset}
						<Select.Item class="m-2" value={asset} label={asset.token.name}>
							<div>
								<Card.Title>{asset.token.name}</Card.Title>
								<Card.Description>{asset.balance}</Card.Description>
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="selectedAsset" />
		</Select.Root>
	{/if}
	{#if selectedAsset != undefined}
		<div class="flex flex-row space-x-2">
			<Label for="balance">Balance</Label>
			<div class="flex flex-col space-y-2">
				<div class="flex flex-row">
					{selectedAsset.value.token.symbol}
					{selectedAsset.value.balance}
				</div>
				<div class="flex flex-row">
					usd {parseFloat(selectedAsset.value.token.exchange_rate) *
						parseFloat(selectedAsset.value.balance)}
				</div>
			</div>
		</div>
	{/if}
	<!-- Receiver -->
	<div class="flex flex-col gap-1.5">
		<Label for="receiver">Receiver</Label>
		<Input bind:value={receiver} id="receiver" placeholder="enter receiver address" />
	</div>
	<!-- Amount -->
	<div class="flex flex-col gap-1.5">
		<Label for="amount">Amount</Label>
		<div class="flex flex-row space-x-2">
			<Input bind:value={enteredAmount} class="grow-7" id="amount" placeholder="enter amount" />
			<Button
				on:click={// Set the new max value
				() => {
					enteredAmount = selectedAsset?.value.balance.toString();
				}}
				class="grow-1">Max</Button
			>
		</div>
	</div>
	{#if enteredAmount != undefined && selectedAsset != undefined}
		<div class="flex flex-col space-y-1">
			<div>
				<!-- selectedAsset!="undefined?" selectedAsset -->
				<Label for="amount_desc">Amount</Label>
				<Card.Root class="amount_desc"
					><Card.Title
						>{selectedAsset != undefined ? selectedAsset.label : ''}
						{enteredAmount != undefined ? enteredAmount : ''}</Card.Title
					>
					<Card.Description
						>USD {selectedAsset != undefined && enteredAmount != undefined
							? computeAmount()
							: ''}</Card.Description
					>
				</Card.Root>
			</div>

			<div>
				<Label for="your_savings">Savings</Label>
				<Card.Root class="your_savings">
					<Card.Title
						>{selectedAsset != null ? selectedAsset.value.token.name : ''}
						{(savingsAmount() -
							parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount)) *
							(1 / parseFloat(selectedAsset.value.token.exchange_rate))}</Card.Title
					>
					<Card.Description
						>USD {selectedAsset != undefined && savingsAmount() != undefined
							? savingsAmount() -
								parseFloat(selectedAsset.value.token.exchange_rate) * parseFloat(enteredAmount)
							: ''}</Card.Description
					>
				</Card.Root>
			</div>
			<div>
				<Label for="gas">Estimated gas fees</Label>
				<Card.Root class="gas"
					><Card.Title>0.0</Card.Title>
					<Card.Description>USD 0.0</Card.Description>
				</Card.Root>
			</div>
			<div>
				<Label for="total">Total</Label>
				<Card.Root class="total">
					<Card.Title
						>{selectedAsset.value.token.name}
						{savingsAmount() *
							(1 / parseFloat(selectedAsset.value.token.exchange_rate))}</Card.Title
					>
					<Card.Description>USD {savingsAmount()}</Card.Description>
				</Card.Root>
			</div>
		</div>
	{/if}
	<div class="h-[40px]"></div>
	<Button type="submit" on:click={completeSend}>Send Transaction</Button>
</div>

<Toaster />
