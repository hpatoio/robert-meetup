import "dotenv/config";
import fs from "fs";
import path from "path";

import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { assertDefined } from "../src/utils/invariants";
import organizationFactoryABI from "../src/services/contracts/organizationFactory/abi/organizationFactory";

const organizationFactoryBytecode = fs.readFileSync(
  path.join(
    __dirname,
    "../src/services/contracts/organizationFactory/bytecode/organizationFactory.txt"
  ),
  "utf-8"
);

const { GANACHE_SEED, GANACHE_URL } = process.env;

assertDefined(GANACHE_SEED, "GANACHE_SEED must be defined!");

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: GANACHE_SEED,
  },
  providerOrUrl: GANACHE_URL || "http://localhost:8545",
});

const web3 = new Web3(provider);

(async () => {
  const [from] = await web3.eth.getAccounts();

  const organizationFactoryContract = new web3.eth.Contract(
    organizationFactoryABI,
    undefined,
    { from }
  );

  try {
    const newContract = await organizationFactoryContract
      .deploy({
        data: organizationFactoryBytecode,
      })
      .send({
        from,
      });
    console.log("\n\r> OrganizationFactory contract created:");
    console.log(newContract.options.address);
  } catch (e) {
    console.error(e);
    console.error("\n\r> Contract creation failed!");
  }
  process.exit();
})();
