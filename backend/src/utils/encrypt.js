import env from "dotenv";
import crypto from "crypto";

env.config();

const secretKey = Buffer.from(
  process.env.ENCRYPTION_DECRYPTION_SECRET_KEY,
  "hex",
);
const iv = Buffer.from(process.env.ENCRYPTION_DECRYPTION_IV, "hex");

// ENCRYPTION //
const encryptData = (data) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// DECRYPTION //
const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { encryptData, decryptData };
