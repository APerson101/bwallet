import {ethers, formatEther, formatUnits} from "ethers";
import {abi} from "../contract/artifacts/contracts/TimeLock.sol/TimeLock.json";
import erc20Abi from './abis/erc20.abi.json';
import {TOKENADDRESSES} from "./constants";
import * as lockdata from "./contracts/lockcontract/lockdata.json";
import type {UserToken} from "./utils";

const url = 'https://replicator.pegasus.lightlink.io/rpc/v1';
const provider = new ethers.JsonRpcProvider(url);
// d30e22f5ae624752279ead86919f8885


export async function fetchAccountBalance(address:string):Promise<string> {
  const result = await provider.getBalance(address);
  return formatEther(result);
}


export async function fetchErc20Balance(address:string, tokenAddress:string, 
  decimalPlaces:string):Promise<string>
{
  const contract=new ethers.Contract(tokenAddress, erc20Abi, provider);
  const balance=await contract.balanceOf(address);
 return formatUnits(balance,decimalPlaces);
}


export function createNewAccount(){
  const wallet= ethers.Wallet.createRandom()
  return wallet;
}

export  function loadWalletFromPhrase(phrase:string){
  const wallet=ethers.Wallet.fromPhrase(phrase);
  return wallet;
}
export  function loadWalletFromPK(privateKey:string){
  const wallet=new ethers.Wallet(privateKey);
  return wallet;
}

export function addAllTokens():UserToken[]
{
  return TOKENADDRESSES.map((tokenInfo)=>({balance:"0", token:tokenInfo}))
}



export async function retreiveFunds(lockId:string, pk:string)
{
  const wallet = new ethers.Wallet(pk, provider)
  const contract = new ethers.Contract("0xaC511a17Fd09075ba29Bb5180fb29fe917874636", abi, wallet);
  const transaction = await contract.unlockFunds(lockId);
  const val = await transaction.wait();
  console.log(val);
}

export async function transferToken(receiver:string, decimal:number, amount:string, tokenAddress:string, pk:string)
{
  const amountToSend=ethers.parseUnits(amount, decimal)
  const wallet = new ethers.Wallet(pk, provider)
  const erc20contract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
  const tx=await erc20contract.tranfer(receiver, amountToSend)
  await tx.wait();
}
export async function transferEther(receiver:string,  amount:string, pk:string)
{
  const amountToSend=ethers.parseEther(amount);
  const wallet = new ethers.Wallet(pk, provider)
  const txn=await wallet.sendTransaction({
    to:receiver,
    value:amountToSend
  })
  await txn.wait();
}


export async function transferToSavings(savingsContract:string, amount:string, pk:string, seconds:number)
{
const key = ethers.toBigInt(ethers.randomBytes(32));
console.log(key, amount, seconds)
  const wallet = new ethers.Wallet(pk, provider)
  const contract = new ethers.Contract(savingsContract, abi, wallet);
  const transaction = await contract.lockFunds(seconds, key, {value: ethers.parseEther(amount)});
  await transaction.wait();
  return key;
}


export async function deploySavingsContract (address:string, pk:string)
{
  const factory=new ethers.ContractFactory(lockdata.abi, lockdata.bytecode, new ethers.Wallet(pk, provider));
  const lock=await factory.deploy(address)
  await lock.waitForDeployment();
  const contractaddress = await lock.getAddress();
  return contractaddress;
}

