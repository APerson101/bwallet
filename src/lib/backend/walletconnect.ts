import {pendingConnections, refereshActiveConnections} from '$lib/stores';
import type {DappConnection} from "$lib/utils";
import {buildApprovedNamespaces, getSdkError} from '@walletconnect/utils';
import Client, {type Web3WalletTypes} from '@walletconnect/web3wallet';

import {ethers} from "ethers";
export class WalletConnectApp{
  private walletConnectWallet;
constructor(walletConnectWallet: Client)
{
this.walletConnectWallet= walletConnectWallet;

}


async pair(enteredUrl:string, address:string)
{
this.walletConnectWallet.on('session_proposal', (args) => this.session_proposal(args, address));
  await this.walletConnectWallet.pair(
{
      uri: enteredUrl
    });
}
async initializeAddress()
{
  this.walletConnectWallet.on('session_delete', this.session_delete);
    this.walletConnectWallet.on('session_request', this.session_request);

}
 async  disconnectDapp(dapp: DappConnection)
{
// manually disconnect from the dapp, update recent connections
  await this.walletConnectWallet.disconnectSession({
  topic:dapp.topic,
  reason: getSdkError('USER_DISCONNECTED')
});
}

 async  getConnectedDapps(address:string|undefined,):Promise<DappConnection[]>{
  if(address!=undefined)
  {const activeSessions=this.walletConnectWallet.getActiveSessions()
  const dapps:DappConnection[]=[]
  for (const key in activeSessions) {
    if (Object.prototype.hasOwnProperty.call(activeSessions, key)) {
      const element = activeSessions[key];
      if (element.namespaces['eip155'].accounts[0].toLowerCase() .includes(address.toLowerCase()))
      {dapps.push({name:element.peer.metadata.name,
        url: element.peer.metadata.url,
        icon: element.peer.metadata.icons[0],
        topic: element.topic,})}
    }
  }

  return [...dapps];
}
return [];
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
async approveDapp(pk:string, data:{message:any, topic:string, id:number})
{
  const url = 'https://replicator.pegasus.lightlink.io/rpc/v1';
  const provider = new ethers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(pk, provider)
  const signedMessage = await wallet.signMessage(ethers.toUtf8Bytes(data.message))
  await this.walletConnectWallet.respondSessionRequest({
    topic: data.topic,
    response: {
      id: data.id,
      result: signedMessage,
      jsonrpc: '2.0'
    }
  });
  pendingConnections.update((all) =>{
    const index=all.findIndex((item)=>item.topic==data.topic)
    all.splice(index, 1)
    return [...all];
  })  

}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
async rejectDapp(data:{message:any, topic:string, id:number})
{
  pendingConnections.update((all) =>{
    const index=all.findIndex((item)=>item.topic==data.topic)
    all.splice(index, 1)
    return [...all];
  })
}
async session_request(req: Web3WalletTypes.SessionRequest) {
  pendingConnections.update((all) => [...all, {topic: req.topic, id: req.id, message: req.params.request.params[0]}])  
}
async  session_delete() {
  refereshActiveConnections.set(true);
}

	async  session_proposal({id, params}: Web3WalletTypes.SessionProposal, address:string) {
  try {
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains: ['eip155:1890', 'eip155:1891'],
          methods: [
            'eth_sendTransaction',
            'personal_sign',
            'eth_signTransaction',
            'eth_sign',
            'get_balance'
          ],
          events: ['accountsChanged', 'chainChanged'],
          accounts: [
            `eip155:1890:${address}`,
            `eip155:1891:${address}`
            // 'eip155:1890:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
            // 'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
            // 'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
            // 'eip155:137:0xFC43fD057583DFda0aB376f0A9865E702AA70344',
            // 'eip155:1:0xFC43fD057583DFda0aB376f0A9865E702AA70344'
          ]
        }
      }
    });

    const session = await this.walletConnectWallet.approveSession({
      id,
      namespaces: approvedNamespaces
    });
    console.log('successfully connected to dapp with the following info');
    console.log(params.proposer.metadata.name);
    console.log(params.proposer.metadata.url);
    console.log(params.proposer.metadata.icons[0]);
    console.log(session.topic);
  } catch (error) {
    console.log('Failed to connect to dapp');
    console.log(error);
    await this.walletConnectWallet.rejectSession({
      id: id,
      reason: getSdkError('USER_REJECTED')
    });
  }
}
}