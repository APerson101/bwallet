// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.9 <0.9.0;

contract TimeLock {
  address public owner;
  struct LockedFund {
    uint256 unlockTime;
    uint256 amount;
    bool isLocked;
  }

  mapping(uint256 => LockedFund) public lockedFunds;

  event FundsLocked(address indexed account, uint256 amount, uint256 unlockTime);
  event FundsUnLocked(address indexed account, uint256 amount);

  modifier onlyOwner()
  {
    require (msg.sender == owner, "Only the owner can call this function");
    _;
  }

  modifier onlyUnlocked (uint256 _lockId) {
    require(lockedFunds[_lockId].isLocked==true && 
    block.timestamp >= lockedFunds[_lockId].unlockTime ,"Funds are still locked");
    _;
  }
  constructor(address _owner)
  {
    owner =_owner;
  }

  function lockFunds(uint256 _lockDuration, uint256 _lockId) external payable {
    require (msg.value>0, "Must lock a non-zero amount");
    lockedFunds[_lockId] = LockedFund({
      unlockTime: block.timestamp + _lockDuration,
      amount: msg.value,
      isLocked:true
    });
    emit FundsLocked(msg.sender, msg.value, lockedFunds[_lockId].unlockTime);
  }
function unlockFunds(uint256 _lockId) external onlyOwner() onlyUnlocked(_lockId)
{
uint256 amountToTransfer = lockedFunds[_lockId].amount;
payable(owner).transfer(amountToTransfer);
emit FundsUnLocked(msg.sender, amountToTransfer);
}
}