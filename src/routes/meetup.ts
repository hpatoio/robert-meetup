/** source/routes/posts.ts */
import express from "express";
import { getAll, getById, add } from "../controllers/meetup";

const router = express.Router();

router.get("/meetups", getAll);
router.get("/meetups/:id", getById);
router.post("/meetups", add);

export = router;
