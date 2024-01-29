import { Signer } from "ethers";
import { generatePermit } from "fhenixjs";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { createFheInstance } from "../utils/instance";

task("task:getVote")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Voting = await deployments.get("Voting");

    const signers = await ethers.getSigners();

    const voting = await ethers.getContractAt("Voting", Voting.address);

    const { instance } = await createFheInstance(Voting.address, hre);
    const permit = await generatePermit(Voting.address, ethers.provider, signers[taskArguments.account] as Signer);
    instance.storePermit(permit);

    const userVote = await voting.connect(signers[taskArguments.account]).getUserVote(permit);
    const decryptedVote = instance.unseal(Voting.address, userVote);

    console.log(`Account voted: ${decryptedVote}`);
  });
