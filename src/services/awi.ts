import Arweave from "arweave";

export const awi = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 5000,
});

export const privateKey = JSON.parse(process.env.ARWEAVE_WALLET_PRIVATE_KEY!);
export const publicAddress = process.env.ARWEAVE_WALLET_ADDRESS;
export const startBlock = process.env.ARWEAVE_START_BLOCK;
