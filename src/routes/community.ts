/** source/routes/posts.ts */
import express from "express";
import { body, param } from "express-validator";
import { onlySigned as verifySignature } from "../services/auth";
import { readByAddress, create } from "../controllers/community";
import { requireSignature, validate } from "../services/validation";

const router = express.Router();

router.get(
  "/:contractAddress",
  validate([param("contractAddress").isEthereumAddress()]),
  readByAddress
);

router.post(
  "/",
  validate([
    body("name").notEmpty(),
    body("founderAddress").notEmpty().isEthereumAddress(),
    body("contractAddress").notEmpty().isEthereumAddress(),
    ...requireSignature(),
  ]),
  verifySignature("founderAddress"),
  create
);

export = router;
