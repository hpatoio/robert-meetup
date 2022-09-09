import { ethers } from "ethers";
import type { Request, Response, NextFunction } from "express";
import { isValidHash, generateMessageHash } from "../utils/crypto";

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

export const onlySigned = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const wallet = request.body.wallet || request.params.wallet;
  const { message, messageHash, signedMessage } = request.body;

  const serverHash = generateMessageHash(message);

  try {
    if (!isValidHash(serverHash, messageHash)) {
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
