import { Request, Response, NextFunction } from "express";

const { ADMIN_SECRET } = process.env;

if (!ADMIN_SECRET) {
  throw Error("ADMIN_SECRET must be defined!");
}

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
