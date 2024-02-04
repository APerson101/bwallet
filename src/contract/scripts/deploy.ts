import {ethers} from "hardhat";

export async function deploySavingsContract(address:string) {
  const lock = await ethers.deployContract("TimeLock", [address]);
  await lock.waitForDeployment();
const contractaddress=await  lock.getAddress();
console.log(address);
return contractaddress;
}