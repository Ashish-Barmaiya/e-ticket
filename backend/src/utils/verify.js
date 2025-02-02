import crypto from "crypto";
import fs from "fs";
import xml2js from "xml2js";

// Load UIDAI's public key
const uidaiPublicKey = fs.readFileSync(
  "../../eKYC/uidaiPublicKey/public_key.pem",
);

// Load the e-KYC XML file
const ekycXml = fs.readFileSync("../../eKYC/xmlUploads/aadhaar.xml");

const parser = new xml2js.Parser();

parser.parseString(ekycXml, (err, result) => {
  if (err) {
    console.error("Error parsing XML:", err);
    return;
  }

  const signatureValue =
    result.OfflinePaperlessKyc.Signature[0].SignatureValue[0]; // Adjust based on XML structure

  if (!signatureValue) {
    console.error("Signature not found in XML.");
    return;
  }
  return signatureValue;
});

console.log(signatureValue);

// Verify the digital signature
const isVerified = crypto.verify(
  "sha256",
  Buffer.from(ekycXml),
  uidaiPublicKey,
  signatureValue, // Extracted signature from XML
);

if (isVerified) {
  console.log("e-KYC verified successfully");
} else {
  console.log("Invalid e-KYC file");
}
