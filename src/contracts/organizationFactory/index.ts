import { DefenderRelayProvider } from "defender-relay-client/lib/web3";
import Web3 from "web3";
// import erc20ABI from "./abi/erc20";
import organizationFactoryABI from "./abi/organizationFactory";
import { assertDefined } from "../../utils/invariants";
import "dotenv/config";

const { RELAY_API_KEY, RELAY_API_SECRET, ORGANIZATION_FACTORY_ADDRESS } =
  process.env;

assertDefined(
  ORGANIZATION_FACTORY_ADDRESS,
  "ORGANIZATION_FACTORY_ADDRESS must be defined!"
);
assertDefined(RELAY_API_KEY, "RELAY_API_KEY must be defined!");
assertDefined(RELAY_API_SECRET, "RELAY_API_SECRET must be defined!");

const credentials = {
  apiKey: RELAY_API_KEY,
  apiSecret: RELAY_API_SECRET,
};

const provider = new DefenderRelayProvider(credentials, {});
const web3 = new Web3(provider);

let organizationFactoryContract;

// IIFE required because with commonjs modules export is not possible to use await top-level:
// https://v8.dev/features/top-level-await
(async () => {
  const [from] = await web3.eth.getAccounts();

  organizationFactoryContract = new web3.eth.Contract(
    organizationFactoryABI,
    ORGANIZATION_FACTORY_ADDRESS,
    { from }
  );
  // organizationFactoryContract = new web3.eth.Contract(
  //   erc20ABI,
  //   "0xF07fE7401403De302245616879701D3e53C6b2Bd",
  //   { from }
  // );
})();

interface Params {
  name: string;
  organizers: string[];
}

export const createOrganization = async ({ name, organizers }: Params) => {
  try {
    const receipt = await organizationFactoryContract.methods
      .createOrganization(name, organizers, [50, 50])
      .send();
    const organizationAddress =
      receipt.events.NewOrganization.returnValues.newOrganization;
    console.log(organizationAddress);
  } catch (e) {
    console.error(e);
  }

  // const receipt = await organizationFactoryContract.methods
  //   .transfer("0x3067b0895107D48B9543C6bbA574F7C00eD7F130", "1")
  //   .send();
};
