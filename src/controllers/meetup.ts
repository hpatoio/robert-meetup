import { mapTransactionsToMeetupExcerpt } from './../service/mappers';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

import Arweave from 'arweave';
import { Meetup } from '../model/meetup';

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 5000
});


const privateKey = JSON.parse(process.env.ARWEAVE_WALLET_PRIVATE_KEY!);
const publicAddress = process.env.ARWEAVE_WALLET_ADDRESS;
const startBlock = process.env.ARWEAVE_START_BLOCK;

// getting all meetups
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
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

        let response: AxiosResponse = await axios.post(`https://arweave.net/graphql`, {
            query: graphQLQuery
        });
        return res.status(200).json(mapTransactionsToMeetupExcerpt(response.data.data));
    } catch (e) {
        return res.status(500).json({
            error: (e as Error).message
        })
    }
    
};

// get a meetup by arweave transaction id
export const getById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        let response: AxiosResponse = await axios.get(`http://arweave.net/${req.params.id}`);
        return res.status(200).json(response.data);

        // Seems the sdk is not working for retrieving transactions :(
        // const data = await arweave.transactions.getData(req.params.id, {decode: true});
        // return res.status(200).json(data);

    } catch (e) {
        return res.status(404);
    }
}

// @TODO add a middleware for authorization, you need to be authorized to add new meetups
// @TODO add validation on request body
export const add = async (req: Request<{},{}, Meetup>, res: Response, next: NextFunction) => {
    try {
        let transaction = await arweave.createTransaction({
            data: JSON.stringify(req.body),
        }, privateKey);

        transaction.addTag('Content-Type', 'application/json');
        transaction.addTag('Title', req.body.title);
        transaction.addTag('Date', req.body.date);

        await arweave.transactions.sign(transaction, privateKey);

        const response = await arweave.transactions.post(transaction);

        return res.status(response.status).json(response)
    } catch (e) {
        return res.status(500).json({
            error: (e as Error).message
        })
    }
}
