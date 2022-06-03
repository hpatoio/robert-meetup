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

export const getData = async (transactionId: string) => {
  
}

const waitForSaveDataConfirmation = async (id) => {
  return new Promise((resolve, reject) => {
    arweave.transactions.getStatus
  })  
}

export const saveData = async (
  data: Record<string, unknown>,
  tags: Record<string, string>
) => {
  const transaction = await awi.createTransaction(
    {
      data: JSON.stringify(data),
    },
    privateKey
  );

  transaction.addTag("Content-Type", "application/json");
  Object.keys(tags).forEach((tag) => transaction.add(tag, tags[tag]));

  await awi.transactions.sign(transaction, privateKey);
  await awi.transactions.post(transaction);

  

  return transaction.id;
};
