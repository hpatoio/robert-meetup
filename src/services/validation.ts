import type { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";

// see https://express-validator.github.io/docs/running-imperatively.html
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).json({ errors: errors.array() });
  };
};
