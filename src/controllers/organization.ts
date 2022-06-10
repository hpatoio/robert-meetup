import { Request, Response } from "express";
import type {
  Organization,
  OrganizationCreationJobStatus,
} from "../model/organization";

import { getData } from "../services/arweave";
import { stringToBase64 } from "../utils/base64";

// get an organization by arweave transaction id
export const getById = async (
  req: Request<Pick<Organization, "id">>,
  res: Response<Organization>
) => {
  try {
    const data = await getData(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404);
  }
};

// @TODO add validation on request body
export const add = async (
  req: Request<{}, {}, Organization>,
  res: Response<{ jobId: string } | { error: string }>
) => {
  try {
    const jobId = stringToBase64(req.body.name);
    // Add job to queue here

    return res.status(201).json({ jobId });
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
    return res.status(200).json({
      status: "COMPLETED",
      organizationId: "adwr324lkjnkl234j2...", // is present only if status is completed
    });
  } catch (e) {
    return res.status(404);
  }
};
