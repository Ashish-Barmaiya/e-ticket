import env from "dotenv";
import { app } from "./app.js";
import { db } from "./src/db/db.js";

env.config();

///// LISTENING ON THE PORT /////
const port = process.env.PORT || 3000;

db.connect()

.then(app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}))

.then(() => console.log("Connected to postgres database"))

.catch(err => console.error("Connector error:", err.stack));