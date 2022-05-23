import { Request, Response, NextFunction } from "express";

export const onlyAdmins = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.headers.authorization !== process.env.ADMIN_SECRET) {
    response
      .status(403)
      .json({ message: "No enough privileges to access endpoint" });
    return;
  }

  next();
};
