import express from "express";
import studentKontroller from "../controllers/Studenti.js";

const router = express.Router();

router.get("/all", studentKontroller.lexoStudentet);
router.post("/register", studentKontroller.regjistroStudent);
router.patch("/update/:ID",studentKontroller.updatePassword);
router.delete("/delete/:ID", studentKontroller.fshijStudent);
router.delete("/deleteAll/",studentKontroller.fshijAllStudentet);
router.post("/login",studentKontroller.loginStudenti);

export default router;