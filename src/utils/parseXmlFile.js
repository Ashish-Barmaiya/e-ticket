import fs from "fs";
import xml2js from "xml2js";

const parseXmlFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    fs.readFile(filePath, (err, data) => {
      if (err) return reject(err);
      parser.parseString(data, (parseErr, result) => {
        if (parseErr) {
          console.error("XML Parsing Error:", parseErr.message);
          return reject(parseErr);
        }
        resolve(result);
      });
    });
  });
};

export { parseXmlFile };
