/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import mapToMeetup from '../service/mapper';

// getting all meetup
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let response: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    return res.status(200).json({
        message: mapToMeetup(response.data)
    });
};


