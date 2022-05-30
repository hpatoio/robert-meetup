import { Request, Response } from "express";
import { Organization } from "../model/organization";

const Redis = require("ioredis");

// @TODO add validation on request body
export const add = async (
  req: Request<{}, {}, Organization>,
  res: Response
) => {
  try {
    const redis = new Redis(process.env.REDIS_URL);
    const channel = "organization";

    redis.publish(channel, req.body.name);

    return res.status(201).json();
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};
