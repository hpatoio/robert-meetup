import { Request, Response } from "express";
import { Meetup } from "../model/meetup";

// getting all meetups, it gets data from chain so need some minutes to a new data to be available
export const getAll = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({});
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

// get a meetup by arweave transaction id
export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    return res.status(200).json({});
  } catch (e) {
    return res.status(404).send();
  }
};

export const add = async (req: Request<{}, {}, Meetup>, res: Response) => {
  try {
    return res.status(201).json({});
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};
