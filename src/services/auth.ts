import { ethers } from "ethers";
import type { Request, Response, NextFunction } from "express";
import { isValidHash, generateDigest } from "../utils/crypto";

export const onlyAdmins = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    response
      .status(403)
      .json({ message: "No enough privileges to access endpoint" });
    return;
  }

  next();
};

export const onlySigned =
  (param) => (request: Request, response: Response, next: NextFunction) => {
    const wallet = request.body[param] || request.params[param];

    if (!wallet) {
      throw Error();
    }

    const { message, digest, signedMessage } = request.body;

    const serverHash = generateDigest(message);

    try {
      if (!isValidHash(serverHash, digest)) {
        throw Error();
      }
      const byteMessage = ethers.utils.toUtf8Bytes(message);
      const walletFromSignature = ethers.utils.verifyMessage(
        byteMessage,
        signedMessage
      );
      if (walletFromSignature !== wallet) {
        throw Error();
      }
    } catch (e) {
      response.status(403).json({ message: "Invalid signature" });
      return;
    }

    next();
  };
