import { stringToBase64 } from "../base64";

describe("utils - base64", () => {
  describe("stringToBase64", () => {
    it("should return the passed utf-8 string encoded in base64", () => {
      const msg = "hello world";
      expect(stringToBase64(msg)).toBe("aGVsbG8gd29ybGQ=");

      const utf8String = "ò à!£$%&òàèù&/()=?^*°§";
      expect(stringToBase64(utf8String)).toBe(
        "w7Igw6AhwqMkJSbDssOgw6jDuSYvKCk9P14qwrDCpw=="
      );
    });
  });
});
