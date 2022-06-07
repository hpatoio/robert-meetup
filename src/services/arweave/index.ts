import axios, { AxiosResponse } from "axios";
import Arweave from "arweave";
import { wait } from "../../utils/wait";

const HOST = "arweave.net";

export const arweave = Arweave.init({
  host: HOST,
  port: 443,
  protocol: "https",
  timeout: 5000,
});

export const privateKey = JSON.parse(process.env.ARWEAVE_WALLET_PRIVATE_KEY!);
export const publicAddress = process.env.ARWEAVE_WALLET_ADDRESS;
export const startBlock = process.env.ARWEAVE_START_BLOCK;

/**
 * Retrieve data directly from arweave gateway.
 * transaction is first saved to gateway and then propagated to the blockchain,
 * to retrieve transaction in the blockchain use `waitForTransactionConfirmation` followed by `getTransaction`
 */
export const getData = async (transactionId: string) => {
  const response: AxiosResponse = await axios.get(
    `https://${HOST}/${transactionId}`
  );
  return response.data;
};

/**
 * Query data on Arweave using GraphQL (https://gql-guide.vercel.app/)
 */
export const queryData = async (graphQLQuery: string) => {
  const response: AxiosResponse = await axios.post(`https://${HOST}/graphql`, {
    query: graphQLQuery,
  });
  return response.data.data;
};

/**
 * Persist data to Arweave
 */
export const saveData = async (
  data: Record<string, any>,
  tags: Record<string, string> = {}
) => {
  const transaction = await arweave.createTransaction(
    {
      data: JSON.stringify(data),
    },
    privateKey
  );

  transaction.addTag("Content-Type", "application/json");
  Object.keys(tags).forEach((tag) => transaction.addTag(tag, tags[tag]));

  await arweave.transactions.sign(transaction, privateKey);
  await arweave.transactions.post(transaction);

  return transaction.id;
};

// get transaction from Arweave blockchain
export const getTransaction = async (transactionId: string) => {
  const jsonString = (await arweave.transactions.getData(transactionId, {
    decode: true,
    string: true,
  })) as string;
  return JSON.parse(jsonString);
};

// poll transaction status every 3 seconds for max 10min (600 sec):
// - resolve: transaction is confirmed (https://www.npmjs.com/package/arweave#get-a-transaction-status)
// - reject: transaction is not confirmed within 10min (600 sec)
export const waitForTransactionConfirmation = (id) => {
  const MAX_CONFIRMATION_TIME = 600; // seconds
  const POLLING_INTERVAL = 3; // seconds

  const isTransactionConfirmed = async (transactionId) => {
    const { status, confirmed } = await arweave.transactions.getStatus(
      transactionId
    );
    console.log(status, confirmed);
    return status === 200 && confirmed;
  };

  async function poll() {
    if (await isTransactionConfirmed(id)) {
      return Promise.resolve(true);
    }
    await wait(POLLING_INTERVAL);
    // recursive
    return poll();
  }

  return Promise.race([
    poll(),
    wait(MAX_CONFIRMATION_TIME).then(() =>
      Promise.reject(new Error(`Arweave Transaction ${id} not confirmed!`))
    ),
  ]);
};
