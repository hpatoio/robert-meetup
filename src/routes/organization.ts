/** source/routes/posts.ts */
import express from "express";
import { getById, add, getJobStatus } from "../controllers/organization";
import { onlyAdmins } from "../services/auth";

const router = express.Router();

router.get("/:id", getById);
router.get("/status/:jobId", getJobStatus);
router.post("/", onlyAdmins, add);

export = router;
