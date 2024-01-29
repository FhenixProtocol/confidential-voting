import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const voting = await deploy("Voting", {
    from: deployer,
    args: ["question??", ["yes", "no"], 30],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log(`Voting contract: `, voting.address);
};

export default func;
func.id = "deploy_voting";
func.tags = ["Voting"];
