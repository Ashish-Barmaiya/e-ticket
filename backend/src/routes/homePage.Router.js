import express from "express";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import path from "path";

// const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/homePage.html"));
// });

router.get("/", (req, res) => {
  res.status(200).render("homePage");
});

export default router;
