import throng from "throng";
import Queue from "bull";
import {
  OrganizationCreationJobStatus,
  OrganizationPostRequest,
} from "../model/organization";
import "dotenv/config";
import { createOrganization as createOrganizationContract } from "../services/contracts/organizationFactory/index";
import { assertDefined } from "../utils/invariants";
import { saveData as saveDataOnArweave } from "../services/arweave";

const { REDIS_URL } = process.env;
assertDefined(REDIS_URL, "REDIS_URL must be defined!");

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
// @TODO this must be kept to 1 until we have working queues
const workers = process.env.REDIS_CONSUMER_CONCURRENCY || 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;

const start = async () => {
  const organizationQueue = new Queue<OrganizationPostRequest>(
    "organization",
    REDIS_URL
  );

  organizationQueue.process(maxJobsPerWorker, async (job) => {
    // This is an example job that just slowly reports on progress
    // while doing no work. Replace this with your own job logic.

    let progress: OrganizationCreationJobStatus = job.progress();

    // if process fails on saving to Arweave is rescheduled but smart contract already exists
    if (!progress.smartcontractAddress) {
      // Deploy new organization contract on blockchain
      try {
        await job.progress({
          status: "IN_PROGRESS",
        });
        const contractAddress = await createOrganizationContract(job.data);
        await job.progress({
          status: "IN_PROGRESS",
          smartcontractAddress: contractAddress,
        });
      } catch (e) {
        throw new Error("Organization contract creation failed!");
      }
    }

    // Save data on Arweave
    try {
      progress = job.progress();

      const arweaveTxId = await saveDataOnArweave(
        {
          name: job.data.name,
          organizers: job.data.organizers,
          smartcontractAddress: progress.smartcontractAddress,
        },
        {
          Model: "Organization",
          Name: job.data.name,
        }
      );

      const jobCompleted = {
        status: "COMPLETED",
        organizationId: arweaveTxId,
        smartcontractAddress: progress.smartcontractAddress,
      };

      await job.progress(jobCompleted);

      return jobCompleted;
    } catch (e) {
      throw new Error("Organization save on Arweave failed!");
    }
  });
};

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
