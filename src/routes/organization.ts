/** source/routes/posts.ts */
import express from "express";
import { body } from "express-validator";
import {
  getAll,
  getById,
  add,
  getJobStatus,
} from "../controllers/organization";
import { validate } from "../services/validation";
import { onlyAdmins } from "../services/auth";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/status/:jobId", getJobStatus);
router.post(
  "/",
  onlyAdmins,
  validate([
    body("name").notEmpty(),
    body("organizers").isArray().bail().isEthereumAddress(),
  ]),
  add
);

export = router;
