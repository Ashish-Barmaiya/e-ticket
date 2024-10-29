import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { loginHost } from "../../controllers/hostControllers/hostLogin.Controller.js";
import { hostLoginValidator } from "../../utils/validators.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// arriving at the login page //
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/host/hostLogin.html"));
})


// handling post req from login button //
router.route("/").post(hostLoginValidator, loginHost);


export default router;