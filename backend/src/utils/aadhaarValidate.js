import fs from "fs";
import forge from "node-forge";
import xml2js from "xml2js";

// Function to validate XML signature
async function validateXmlSignature(xmlFilePath, certFilePath) {
  try {
    // Step 1: Load XML File
    const xmlData = fs.readFileSync(xmlFilePath, "utf8");

    // Parse the XML to extract the signature value and other data
    const parser = new xml2js.Parser();
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return;
      }

      // Debugging: Log the XML structure to inspect where the signature is
      //   console.log("Parsed XML:", JSON.stringify(result, null, 2));

      // Step 2: Extract Signature Value from XML
      const signatureValue =
        result.OfflinePaperlessKyc.Signature[0].SignatureValue[0]; // Adjust based on XML structure

      if (!signatureValue) {
        console.error("Signature not found in XML.");
        return;
      }

      // Step 3: Load the PEM Certificate
      //   const pemCert = fs.readFileSync(certFilePath, "utf8");
      //   const cert = forge.pki.certificateFromPem(pemCert);
      //   const publicKey = cert.publicKey;

      const publicKeyPem = fs.readFileSync(certFilePath, "utf8");
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

      console.log("Public Key: ", publicKey);

      // Step 4: Prepare the data to be verified (the XML data without the signature)
      const xmlWithoutSignature = xmlData.replace(
        /<Signature\b[^>]*>.*?<\/Signature>/s,
        "",
      );
      // Remove the signature element from XML (adjust if necessary)

      console.log(xmlWithoutSignature);

      // Step 5: Prepare the expected signature from the XML
      const expectedSig = forge.util.decode64(signatureValue);

      // Step 6: Verify the signature
      const md = forge.md.sha256.create();
      md.update(xmlWithoutSignature, "utf8");
      const isValid = publicKey.verify(md.digest().bytes(), expectedSig);

      // Step 7: Output result
      if (isValid) {
        console.log("XML Signature is valid.");
      } else {
        console.log("XML Signature is invalid.");
      }
    });
  } catch (error) {
    console.error("Error during XML signature validation:", error);
  }
}

// Call the function with paths to the XML file and certificate
const xmlFilePath = "../../eKYC/xmlUploads/aadhaar.xml"; // Adjust path to your XML file
const certFilePath = "../../eKYC/uidaiPublicKey/public_key.pem"; // Adjust path to your PEM certificate

validateXmlSignature(xmlFilePath, certFilePath);
