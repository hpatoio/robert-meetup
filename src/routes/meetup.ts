/** source/routes/posts.ts */
import express from "express";
import { getAll, getById, add } from "@/controllers/meetup";
import { onlyAdmins } from "@/service/auth";

const router = express.Router();

router.get("/meetups", getAll);
router.get("/meetups/:id", getById);
router.post("/meetups", onlyAdmins, add);

export = router;
