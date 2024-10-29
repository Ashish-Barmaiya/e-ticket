import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { registerHost } from "../../controllers/hostControllers/hostRegister.Controller.js";
import { hostRegisterValidator } from "../../utils/validators.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// handling get req at registration page //
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/host/hostRegister.html"), (err) => {
        if(err) {
            next(err);
        }
    });
})

// handling post req from register button //
router.post("/", hostRegisterValidator, registerHost);

export default router;