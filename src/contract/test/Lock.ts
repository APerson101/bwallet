import {ethers} from "ethers";
import {abi} from "../../contract/artifacts/contracts/TimeLock.sol/TimeLock.json";
const url = 'https://replicator.pegasus.lightlink.io/rpc/v1';
const provider = new ethers.JsonRpcProvider(url);

describe("Lock", function () {
  const wallet=new ethers.Wallet("0xd367b71d54781c4577b95634791fc003769005b909cff1e6e0d383e48ab49e08", provider)
  const contract=new ethers.Contract("0xaC511a17Fd09075ba29Bb5180fb29fe917874636", abi, wallet);
  describe("lock funds", function () {
    it("Should lockup funds for the specified time and amount", async function () {
      const bytes = ethers.toBigInt(ethers.randomBytes(32));
      console.log(bytes)
      const transaction = await contract.lockFunds(
        2592000, 
        603148935874615541005950053593091649934690682613956335443936370160806315386n, 
        {value: ethers.parseEther('0.000404347826086957')});
      // const transaction = await contract.lockFunds(500, 4331, {value: ethers.parseEther('0.0040434')});
      const val=await transaction.wait();
      console.log(val)
    });

    it("should fail because funds are still locked", async function () {
      const transaction = await contract.unlockFunds(9036432830244744650682391811506488292192088019042501297287764991278433641004n);
const val=await transaction.wait();
console.log(val);
});

it("Should reject withdrawal due to wrong account", async function () {
  const wallet = new ethers.Wallet("7aa9bb9efa814aec18c8a7d502fbd5952102b3b0b626d779bb5f4c9e6125e60c", provider)
  const contract = new ethers.Contract("0xaC511a17Fd09075ba29Bb5180fb29fe917874636", abi, wallet);
  const transaction=await contract.unlockFunds(4331);
  const val=await transaction.wait();
  console.log(val);
  });
})});

  