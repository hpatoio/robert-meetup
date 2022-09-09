import express from "express";
import { body, param } from "express-validator";
import { validate } from "../services/validation";
import { onlySigned } from "../services/auth";
import {
  getByAddress,
  getMessageToSign,
  add,
  remove,
  edit,
} from "../controllers/user";

const router = express.Router();

router.get("/message", getMessageToSign);
router.get(
  "/:wallet",
  validate([param("wallet").notEmpty().bail().isEthereumAddress()]),
  getByAddress
);
router.post(
  "/",
  validate([
    body("username").notEmpty(),
    body("wallet").notEmpty().bail().isEthereumAddress(),
    body("signedMessage").notEmpty(),
    body("message").notEmpty(),
    body("messageHash").notEmpty(),
  ]),
  onlySigned,
  add
);
router.patch(
  "/:wallet",
  validate([
    param("wallet").notEmpty().bail().isEthereumAddress(),
    body("wallet").not().exists(),
    body("username").notEmpty(),
    body("signedMessage").notEmpty(),
    body("message").notEmpty(),
    body("messageHash").notEmpty(),
  ]),
  onlySigned,
  edit
);
router.delete(
  "/:wallet",
  validate([
    param("wallet").notEmpty().bail().isEthereumAddress(),
    body("signedMessage").notEmpty(),
    body("message").notEmpty(),
    body("messageHash").notEmpty(),
  ]),
  onlySigned,
  remove
);

export = router;
