import { FhenixClient, Permit, getPermit } from "fhenixjs";
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

export interface FheContract {
  instance: FhenixClient;
  permit: Permit;
}

export async function createFheInstance(contractAddress: string, hre: HardhatRuntimeEnvironment): Promise<FheContract> {
  const provider = hre.ethers.provider;

  let instance = new FhenixClient({ provider });
  const permit = await getPermit(contractAddress, provider);
  instance.storePermit(permit);
  return { instance, permit };
}
