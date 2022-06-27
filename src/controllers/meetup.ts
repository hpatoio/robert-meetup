import { Request, Response } from "express";
import {
  getData,
  saveData,
  publicAddress,
  queryData,
  startBlock,
} from "../services/arweave";
import { mapTransactionsToMeetupExcerpt } from "../services/mappers";

import { Meetup } from "../model/meetup";

// getting all meetups, it gets data from chain so need some minutes to a new data to be available
export const getAll = async (req: Request, res: Response) => {
  try {
    const graphQLQuery = `
            query {
                transactions(
                  owners:["${publicAddress}"], 
                  block: {min: ${startBlock}},
                  tags: {
                    name: "Model",
                    values: ["Meetup"]
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

    return res.status(200).json(mapTransactionsToMeetupExcerpt(data));
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

// get a meetup by arweave transaction id
export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const data = await getData(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404);
  }
};

// @TODO add validation on request body
export const add = async (req: Request<{}, {}, Meetup>, res: Response) => {
  try {
    const transactionId = await saveData(req.body, {
      Model: "Meetup",
      Title: req.body.title,
      Date: req.body.date,
    });

    return res.status(201).json({ id: transactionId });
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};
