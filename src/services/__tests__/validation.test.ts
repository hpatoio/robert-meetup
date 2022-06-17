import type { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { validate } from "../validation";

jest.mock("express-validator");

const mockedValidationResult = validationResult as unknown as jest.Mock;

describe("services - validation", () => {
  describe("validate", () => {
    let mockedRequest: Partial<Request>;
    let mockedResponse: Partial<Response>;
    const status = jest.fn();
    const json = jest.fn();
    const next: NextFunction = jest.fn();

    const validations: Partial<ValidationChain>[] = [
      // @ts-expect-error
      { run: () => Promise.resolve() },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
      mockedRequest = {};
      mockedResponse = {
        status: status.mockReturnValue({
          json,
        }),
      };
    });

    it("should call next function if validation succeed", async () => {
      mockedValidationResult.mockReturnValue({
        isEmpty: () => true,
      });

      await validate(validations as ValidationChain[])(
        mockedRequest as Request,
        mockedResponse as Response,
        next
      );

      expect(next).toHaveBeenCalled();
    });

    it("should return 400 response with validation errors if validation fails", async () => {
      mockedValidationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          {
            msg: "Invalid value",
            param: "organizers",
            location: "body",
          },
        ],
      });

      await validate(validations as ValidationChain[])(
        mockedRequest as Request,
        mockedResponse as Response,
        next
      );

      expect(next).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({
        errors: [
          {
            msg: "Invalid value",
            param: "organizers",
            location: "body",
          },
        ],
      });
    });
  });
});
