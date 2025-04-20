import express from "express";
import studentKontroller from "../controllers/Studenti.js";

const router = express.Router();

router.get("/all", studentKontroller.lexoStudentet);
router.post("/submit", studentKontroller.regjistroStudent);
router.delete("/delete/:StudentiID", studentKontroller.fshijStudent);

export default router;