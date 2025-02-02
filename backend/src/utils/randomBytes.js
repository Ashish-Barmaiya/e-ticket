// import { randomBytes } from "crypto";

// randomBytes(16, (err, buffer) => {
//   if (err) {
//     console.error("Error in generating random bytes:", err);
//     return;
//   }
//   console.log("Random Bytes: ", buffer.toString("hex"));
// });

import crypto from "crypto";

// Generate a 32-byte (256-bit) random key
const secretKey = crypto.randomBytes(32); // Generates a 32-byte key
console.log("Generated Secret Key:", secretKey.toString("hex")); // Output as hex
