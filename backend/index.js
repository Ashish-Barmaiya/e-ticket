import env from "dotenv";
import { app } from "./app.js";
import { db } from "./src/db/db.js";

env.config();
const port = process.env.PORT || 3000;

/// CONNECTING TO DATABASE ///
db.connect()

  /// LISTENING ON THE PORT AFTER CONNECTING TO DATABASE ///
  .then(
    app.listen(port, () => {
      console.log(`Server running on http://eticketapp.test`);
    }),
  )

  .then(() => console.log("Connected to postgres database"))
  .catch((err) => console.error("Connector error:", err.stack));
