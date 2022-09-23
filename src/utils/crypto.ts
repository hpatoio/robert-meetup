import { createHmac, timingSafeEqual, randomBytes } from "crypto";

const { ADMIN_SECRET } = process.env;

export const generateMessageNonce = () => {
  return randomBytes(16).toString("base64");
};

export const generateDigest = (message: string) => {
  const hmac = createHmac("sha256", ADMIN_SECRET);
  hmac.update(message);
  return hmac.digest("hex").toString();
};

export const isValidHash = (serverHash: string, clientHash: string) => {
  return timingSafeEqual(Buffer.from(serverHash), Buffer.from(clientHash));
};
