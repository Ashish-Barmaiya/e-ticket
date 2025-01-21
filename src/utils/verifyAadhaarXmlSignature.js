// import fs from "fs";
// import xml2js from "xml2js";
// import crypto from "crypto";

// async function verifyUserAadhaar(xmlFile, publicKeyFile) {
//   try {
//     const publicKeyPem = fs.readFileSync(publicKeyFile, "utf8");
//     const publicKey = crypto.createPublicKey(publicKeyPem);

//     const xmlData = fs.readFileSync(xmlFile, "utf8");
//     const parser = new xml2js.Parser();
//     const parsedXML = await parser.parseStringPromise(xmlData);

//     console.log("Parsed XML:", parsedXML);

//     // new line
//     const signedData = parsedXML.OfflinePaperlessKyc.Signature[0];

//     if (!parsedXML || !parsedXML.OfflinePaperlessKyc) {
//       throw new Error(
//         "Invalid XML structure: Missing OfflinePaperlessKyc element",
//       );
//     }

//     if (!parsedXML.OfflinePaperlessKyc.UidData) {
//       throw new Error("Invalid XML structure: Missing UidData element");
//     }

//     if (!parsedXML.OfflinePaperlessKyc.Signature) {
//       throw new Error("Invalid XML structure: Missing Data element");
//     }

//     if (!parsedXML.OfflinePaperlessKyc.Signature[0]) {
//       throw new Error("Data element is empty");
//     }

//     const signature = parsedXML.OfflinePaperlessKyc.Signature[0];

//     const isValid = crypto.verify(
//       "sha256",
//       Buffer.from(signedData),
//       publicKey,
//       Buffer.from(signature, "base64"),
//     );

//     return isValid;
//   } catch (error) {
//     console.error("Error verifying Aadhaar:", error.message);
//     return false;
//   }
// }

// const xmlFile = "../../eKYC/xmlUploads/offlineaadhaar20250107035630558.xml";
// const publicKeyFile = "../../eKYC/uidaiPublicKey/public_key.pem";

// const isValidSignature = await verifyUserAadhaar(xmlFile, publicKeyFile);

// if (isValidSignature) {
//   console.log("Aadhaar signature is valid");
//   // Proceed with further actions
// } else {
//   console.error("Aadhaar signature is invalid");
//   // Handle invalid signature
// }

import fs from "fs";
import xml2js from "xml2js";
import { SignedXml } from "xml-crypto";
import { DOMParser } from "xmldom";

// Read the XML file
const xmlFile = "../../eKYC/xmlUploads/offlineaadhaar20250107035630558.xml";
const xmlData = fs.readFileSync(xmlFile, "utf8");

// Parse the XML to extract data
const parser = new xml2js.Parser({ explicitArray: false });
parser.parseString(xmlData, async (err, result) => {
  if (err) {
    console.error("Error parsing XML:", err);
    return;
  }

  // Extract the signature block
  const signature = result["ns2:OfflinePaperlessKyc"]["Signature"];
  if (!signature) {
    console.error("No signature found in XML.");
    return;
  }

  // Extract required fields
  const uidData = result["ns2:OfflinePaperlessKyc"]["UidData"];
  const referenceId = result["ns2:OfflinePaperlessKyc"]["$"]["referenceId"];
  const name = uidData["Poi"]["$"]["name"];
  const dob = uidData["Poi"]["$"]["dob"];
  const gender = uidData["Poi"]["$"]["gender"];

  console.log("Extracted Data:");
  console.log("Reference ID:", referenceId);
  console.log("Name:", name);
  console.log("DOB:", dob);
  console.log("Gender:", gender);

  // Validate the XML Signature
  const doc = new DOMParser().parseFromString(xmlData);
  const sig = new SignedXml();

  try {
    sig.keyInfoProvider = {
      getKeyInfo: () => "<X509Data></X509Data>",
      getKey: () =>
        Buffer.from(
          signature["KeyInfo"]["X509Data"]["X509Certificate"],
          "base64",
        ),
    };

    const signatureNode = doc.getElementsByTagName("Signature")[0];
    sig.loadSignature(signatureNode);

    const isValid = sig.checkSignature(xmlData);
    if (isValid) {
      console.log("Signature is valid.");
    } else {
      console.error("Signature validation failed:", sig.validationErrors);
    }
  } catch (e) {
    console.error("Error validating signature:", e);
  }
});
