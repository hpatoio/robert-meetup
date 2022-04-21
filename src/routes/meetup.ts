/** source/routes/posts.ts */
import express from 'express';
import {getAll} from '../controllers/meetup';
const router = express.Router();

router.get('/meetups', getAll);

export = router;