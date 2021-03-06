/** source/routes/posts.ts */
import express from "express";
import { getAll, getById, add } from "../controllers/meetup";
import { onlyAdmins } from "../services/auth";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", onlyAdmins, add);

export = router;
