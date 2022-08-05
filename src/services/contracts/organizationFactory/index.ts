import { assertDefined } from "../../../utils/invariants";
import web3 from "../index";
import organizationFactoryABI from "./abi/organizationFactory";

const { ORGANIZATION_FACTORY_ADDRESS } = process.env;

assertDefined(
  ORGANIZATION_FACTORY_ADDRESS,
  "ORGANIZATION_FACTORY_ADDRESS must be defined!"
);

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
})();

interface Params {
  name: string;
  organizers: string[];
}

export const createOrganization = async ({ name, organizers }: Params) => {
  const receipt = await organizationFactoryContract.methods
    .createOrganization(
      name,
      organizers,
      organizers.map(() => 10) // same number, same share
    )
    .send()
    .on("sending", () => console.log("Sending Transaction..."))
    .on("transactionHash", (hash) =>
      console.log(`Sent: https://mumbai.polygonscan.com/tx/${hash}`)
    )
    .on("receipt", ({ events }) =>
      console.log(
        `Processed: https://mumbai.polygonscan.com/address/${events.NewOrganization.returnValues.newOrganization}`
      )
    );

  return receipt.events.NewOrganization.returnValues.newOrganization;
};
