import express from "express";
import studentKontroller from "../controllers/Studenti.js";

const router = express.Router();

router.patch("/update/:ID",studentKontroller.updatePassword);
router.post("/login",studentKontroller.loginStudenti);

export default router;