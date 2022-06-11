import { assertDefined } from "../invariants";

describe("utils - invariant", () => {
  describe("assertDefined", () => {
    it("should throw an error if passed condition is null", () => {
      expect(() => {
        const condition = null;
        assertDefined(condition, "Must be defined");
      }).toThrowError("Must be defined");
    });
    it("should throw an error if passed condition is undefined", () => {
      expect(() => {
        const condition = undefined;
        assertDefined(condition, "Must be defined");
      }).toThrowError("Must be defined");
    });
    it("should not throw an error if passed condition is valid", async () => {
      expect(() => {
        assertDefined(true, "");
        assertDefined(false, "");
      }).not.toThrow();
    });
  });
});
