import express from "express";
import studentKontroller from "../controllers/Studenti.js";

const router = express.Router();

router.get("/all", studentKontroller.lexoStudentet);

export default router;