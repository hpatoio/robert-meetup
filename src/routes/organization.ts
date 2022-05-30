/** source/routes/posts.ts */
import express from "express";
import { add } from "../controllers/organization";

const router = express.Router();

router.post("/organizations", add);

export = router;
