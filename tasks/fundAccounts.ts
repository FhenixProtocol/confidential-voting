import { ethers } from "ethers";
import { task } from "hardhat/config";

task("task:fundAccounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  const fundingAcct = accounts[0];

  for (let i = 1; i < accounts.length; i++) {
    const account = accounts[i];
    await fundingAcct.sendTransaction({ to: account.address, value: ethers.parseEther("0.1") });
    console.log(account.address);
  }
});
