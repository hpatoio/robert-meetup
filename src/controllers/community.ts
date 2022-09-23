import { Request, Response } from "express";
import type { Community, CommunityPostRequest } from "../model/community";

export const readByAddress = async (
  req: Request<Pick<Community, "contractAddress">>,
  res: Response<Community>
) => {
  try {
    // get from mongo DB
    return res.status(200).json({
      _id: "12345",
      contractAddress: "0x1234",
      name: "La Tela di Carlotta",
    });
  } catch (e) {
    return res.status(404).send();
  }
};

export const create = async (
  req: Request<{}, {}, CommunityPostRequest>,
  res: Response<Pick<Community, "_id" | "contractAddress"> | { error: string }>
) => {
  try {
    // - call CommunityFactory smart contract to verify contractAddress is valid
    // - save to mongo DB
    return res.status(201).json({
      _id: "12345",
      contractAddress: "0x1234",
    });
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};
