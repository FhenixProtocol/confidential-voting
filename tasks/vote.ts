import { task } from "hardhat/config";
import type { ArgumentType, TaskArguments } from "hardhat/types";

import { createFheInstance } from "../utils/instance";

task("task:vote")
  .addParam("option", "Option to choose")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Voting = await deployments.get("Voting");

    const signers = await ethers.getSigners();

    const voting = await ethers.getContractAt("Voting", Voting.address);

    console.log(`contract at: ${Voting.address}, for signer: ${signers[taskArguments.account].address}`);

    const { instance } = await createFheInstance(Voting.address, hre);
    const eOption = await instance.encrypt_uint32(Number(taskArguments.option));

    await voting.connect(signers[Number(taskArguments.account)]).vote(eOption);

    console.log(`Voted for option ${taskArguments.option}!`);
  });
