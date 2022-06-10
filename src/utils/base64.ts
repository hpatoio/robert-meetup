/**
 * Return the given message encoded in Base64
 * stringToBase64("Hello World") => "aGVsbG8gd29ybGQ=""
 */

export function stringToBase64(msg: string) {
  return Buffer.from(msg).toString("base64");
}
