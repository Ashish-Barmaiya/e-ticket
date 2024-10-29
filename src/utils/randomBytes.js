import { randomBytes } from "crypto";

randomBytes (64, (err, buffer) => {
    if (err) {
        console.error("Error in generating random bytes:", err);
        return;
    }
    console.log("Random Bytes: ", buffer.toString("hex"));
    
})