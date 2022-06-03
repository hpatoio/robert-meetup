import { Request, Response, NextFunction } from "express";
import { assertDefined } from "../utils/invariants";

const { ADMIN_SECRET } = process.env;

assertDefined(ADMIN_SECRET, "ADMIN_SECRET must be defined!");

export const onlyAdmins = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.headers.authorization !== `Bearer ${ADMIN_SECRET}`) {
    response
      .status(403)
      .json({ message: "No enough privileges to access endpoint" });
    return;
  }

  next();
};
