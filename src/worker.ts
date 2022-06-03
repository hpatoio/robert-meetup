import "dotenv/config";
import throng from "throng";
import { createOrganization as createOrganizationContract } from "./services/contracts/organizationFactory/index";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// @TODO this must be kept to 1 until we have working queues
const workers = process.env.WEB_CONCURRENCY || 1;

// @TODO just for testing, to be removed when we have working queues.
const wait = () =>
  new Promise((res) => {
    setTimeout(res, 5000);
  });

const start = async () => {
  await wait();
  // consume queue here: https://github.com/heroku-examples/node-workers-example/blob/main/worker.js
  try {
    const contractAddress = await createOrganizationContract({
      name: "Bravo Simo",
      organizers: [
        "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0",
        "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
      ],
    });
    console.log(contractAddress);
  } catch (e) {
    console.error("Contract creation failed!");
  }
};

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
