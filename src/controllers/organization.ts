import { Request, Response } from "express";
import Queue from "bull";
import { mapTransactionsToOrganizationExcerpt } from "../services/mappers";
import type {
  Organization,
  OrganizationPostRequest,
  OrganizationCreationJobStatus,
} from "../model/organization";

import {
  startBlock,
  getData,
  publicAddress,
  queryData,
} from "../services/arweave";
import { stringToBase64 } from "../utils/base64";

const { REDIS_URL } = process.env;

const organizationQueue = new Queue<OrganizationPostRequest>(
  "organization",
  REDIS_URL
);

export const getAll = async (req: Request, res: Response) => {
  try {
    const graphQLQuery = `
            query {
                transactions(
                  owners:["${publicAddress}"], 
                  block: {min: ${startBlock}},
                  tags: {
                    name: "Model",
                    values: ["Organization"]
                  }
                  sort: HEIGHT_DESC, 
                ) {
                  edges {
                      node {
                          id,
                          tags {
                              name,
                              value
                          }
                      }
                  }
                }
            }
        `;
    const data = await queryData(graphQLQuery);

    return res.status(200).json(mapTransactionsToOrganizationExcerpt(data));
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

// get an organization by arweave transaction id
export const getById = async (
  req: Request<Pick<Organization, "id">>,
  res: Response<Organization>
) => {
  try {
    const data = await getData(req.params.id);
    return res.status(200).json({
      id: req.params.id,
      ...data,
    });
  } catch (e) {
    return res.status(404).send();
  }
};

export const add = async (
  req: Request<{}, {}, OrganizationPostRequest>,
  res: Response<{ jobId: string; retry?: boolean } | { error: string }>
) => {
  try {
    const jobId = stringToBase64(req.body.name);

    // check if a job with same id already exists and if is failed or stuck retry it
    const prevJob = await organizationQueue.getJob(jobId);
    if (prevJob) {
      const prevJobStatus = await prevJob.getState();
      if (prevJobStatus === "failed" || prevJobStatus === "stuck") {
        await prevJob.retry();
        return res
          .status(201)
          .json({ jobId: prevJob.id as string, retry: true });
      }
    }

    const job = await organizationQueue.add(req.body, {
      jobId,
      attempts: 3,
      backoff: {
        type: "fixed",
        delay: 5000,
      },
    });
    return res.status(201).json({ jobId: job.id as string });
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

export const getJobStatus = async (
  req: Request<{ jobId: string }>,
  res: Response<OrganizationCreationJobStatus | { error: string }>
) => {
  try {
    // get job status from queue
    const job = await organizationQueue.getJob(req.params.jobId);
    if (!job) {
      throw new Error("Cannot find JOB id");
    }
    const status = await job.getState();

    if (status === "failed") {
      return res.status(200).json({ status: "ERROR", error: job.failedReason });
    }

    if (status === "completed") {
      return res.status(200).json(job.returnvalue);
    }

    const progress = await job.progress();
    return res.status(200).json(progress);
  } catch (e) {
    return res.status(404).json({
      error: (e as Error).message,
    });
  }
};
