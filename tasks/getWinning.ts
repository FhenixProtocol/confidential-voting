import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getWin")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Voting = await deployments.get("Voting");

    const signers = await ethers.getSigners();

    const voting = await ethers.getContractAt("Voting", Voting.address);

    const [winOption, winTally] = await voting.connect(signers[taskArguments.account]).winning();

    console.log(`Winning option: ${winOption}\nWinning tally: ${winTally}`);
  });
