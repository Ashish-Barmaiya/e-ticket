import env from "dotenv";
import crypto from "crypto";

env.config();

const secretKey = process.env.ENCRYPTION_DECRYPTION_SECRET_KEY;

// ENCRYPTION //
const encryptData = (data) => {
  const cipher = crypto.createCipher("aes-256-cbc", secretKey);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// DECRYPTION //
const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { encryptData, decryptData };
