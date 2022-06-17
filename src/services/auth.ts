import type { Request, Response, NextFunction } from "express";
import { assertDefined } from "../utils/invariants";

assertDefined(process.env.ADMIN_SECRET, "ADMIN_SECRET must be defined!");

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
