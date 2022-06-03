import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { mapTransactionsToMeetupExcerpt } from "../services/mappers";

import {
  awi,
  privateKey,
  publicAddress,
  startBlock,
} from "../services/arweave";
import { Meetup } from "../model/meetup";

// getting all meetups
export const getAll = async (req: Request, res: Response) => {
  try {
    const graphQLQuery = `
            query {
                transactions(owners:["${publicAddress}"], sort: HEIGHT_DESC, block: {min: ${startBlock}}) {
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

    const response: AxiosResponse = await axios.post(
      "https://arweave.net/graphql",
      {
        query: graphQLQuery,
      }
    );
    return res
      .status(200)
      .json(mapTransactionsToMeetupExcerpt(response.data.data));
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};

// get a meetup by arweave transaction id
export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const response: AxiosResponse = await axios.get(
      `http://arweave.net/${req.params.id}`
    );
    return res.status(200).json(response.data);

    // Seems the sdk is not working for retrieving transactions :(
    // const data = await arweave.transactions.getData(req.params.id, {decode: true});
    // return res.status(200).json(data);
  } catch (e) {
    return res.status(404);
  }
};

// @TODO add validation on request body
export const add = async (req: Request<{}, {}, Meetup>, res: Response) => {
  try {
    const transaction = await awi.createTransaction(
      {
        data: JSON.stringify(req.body),
      },
      privateKey
    );

    transaction.addTag("Content-Type", "application/json");
    transaction.addTag("Title", req.body.title);
    transaction.addTag("Date", req.body.date);

    await awi.transactions.sign(transaction, privateKey);
    await awi.transactions.post(transaction);

    return res.status(201).json({ id: transaction.id });
  } catch (e) {
    return res.status(500).json({
      error: (e as Error).message,
    });
  }
};
