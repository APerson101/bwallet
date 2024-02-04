import type {AccountType} from "$lib/utils";
import {writable} from "svelte/store";
import type {WalletConnectApp} from "./backend/walletconnect";
export const  currentScreen=writable(0);

export const currentAccountSelection = writable<AccountType>();
export const allAddresses = writable < AccountType[]>([]);
export const dappAddress = writable<string>("");
export const walletConnection = writable<WalletConnectApp>()
export const refereshActiveConnections  =writable<boolean>(false);
export const refereshPendingConnections  =writable<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pendingConnections  =writable<{topic:string, id:number, message:any}[]>([]);