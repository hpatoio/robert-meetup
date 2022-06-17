import type { Request, Response, NextFunction } from "express";
import { onlyAdmins } from "../auth";

describe("services - auth", () => {
  let env;

  beforeEach(() => {
    env = process.env;
  });
  afterEach(() => {
    process.env = env;
  });
  describe("onlyAdmins", () => {
    let mockedRequest: Partial<Request>;
    let mockedResponse: Partial<Response>;
    const status = jest.fn();
    const json = jest.fn();
    const next: NextFunction = jest.fn();

    beforeEach(() => {
      jest.restoreAllMocks();
      mockedRequest = {};
      mockedResponse = {
        status: status.mockReturnValue({
          json,
        }),
      };
    });

    it("should call next function if Bearer token is valid", () => {
      process.env.ADMIN_SECRET = "SECRET";

      mockedRequest = {
        headers: {
          authorization: "Bearer SECRET",
        },
      };

      onlyAdmins(mockedRequest as Request, mockedResponse as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 403 response with an error message if token is not valid", () => {
      process.env.ADMIN_SECRET = "SECRET";

      mockedRequest = {
        headers: {
          authorization: "Bearer WRONG_SECRET",
        },
      };

      onlyAdmins(mockedRequest as Request, mockedResponse as Response, next);

      expect(status).toHaveBeenCalledWith(403);
      expect(json).toHaveBeenCalledWith({
        message: "No enough privileges to access endpoint",
      });
    });
  });
});
