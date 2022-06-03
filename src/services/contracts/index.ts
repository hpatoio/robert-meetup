import { DefenderRelayProvider } from "defender-relay-client/lib/web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { assertDefined } from "../../utils/invariants";

const { RELAY_API_KEY, RELAY_API_SECRET, GANACHE_SEED, GANACHE_URL } =
  process.env;

let provider;
if (process.env.NODE_ENV === "development") {
  // You can run a test blockchain locally using this command:
  // `npx ganache --database.dbPath db -d -b 5`
  // then pass the seed phrase to GANACHE_SEED inside .env
  assertDefined(GANACHE_SEED, "GANACHE_SEED must be defined!");
  provider = new HDWalletProvider({
    mnemonic: {
      phrase: GANACHE_SEED,
    },
    providerOrUrl: GANACHE_URL || "http://localhost:8545",
  });
} else {
  assertDefined(RELAY_API_KEY, "RELAY_API_KEY must be defined!");
  assertDefined(RELAY_API_SECRET, "RELAY_API_SECRET must be defined!");
  const credentials = {
    apiKey: RELAY_API_KEY,
    apiSecret: RELAY_API_SECRET,
  };
  provider = new DefenderRelayProvider(credentials, {});
}

export default new Web3(provider);
