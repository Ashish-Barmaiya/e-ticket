import crypto from "crypto";

const generateHash = (
  aadhaarPhoneNumber,
  aadhaarXmlFilePassword,
  lastDigitOfAadhaarNumber,
) => {
  const combinedInput = aadhaarPhoneNumber + aadhaarXmlFilePassword;

  // Determine the number of rounds (default to 1 if last digit is 0)
  const rounds = lastDigitOfAadhaarNumber === 0 ? 1 : lastDigitOfAadhaarNumber;

  // Hash the initial input once
  let hash = crypto.createHash("sha256").update(combinedInput).digest("hex");

  // Further rounds hash the previous hash
  for (let i = 1; i < rounds; i++) {
    hash = crypto.createHash("sha256").update(hash).digest("hex");
  }

  // Return the final hash
  return hash;
};

export { generateHash };
