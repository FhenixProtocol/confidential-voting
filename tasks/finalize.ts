import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:fin")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Voting = await deployments.get("Voting");

    const signers = await ethers.getSigners();

    const voting = await ethers.getContractAt("Voting", Voting.address);

    console.log(`contract at: ${Voting.address}, for signer: ${signers[taskArguments.account].address}`);

    await voting.connect(signers[Number(taskArguments.account)]).finalize();

    console.log(`Finalized voting!`);
  });
