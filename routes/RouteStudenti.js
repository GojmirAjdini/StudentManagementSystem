import express from "express";
import studentKontroller from "../controllers/Studenti.js";

const router = express.Router();

router.get("/all", studentKontroller.lexoStudentet);
router.post("/register", studentKontroller.regjistroStudent);
router.patch("/update/:ID",studentKontroller.updatePassword);
router.delete("/delete/:ID", studentKontroller.fshijStudent);
router.delete("/deleteAll/",studentKontroller.fshijAllStudentet);
router.post("/login",studentKontroller.loginStudenti);
router.patch("/edit/:ID",studentKontroller.patchStudentin);
router.get("/:ID", studentKontroller.lexoStudentetByID);
router.get("/studenti/search",studentKontroller.lexoStudentetByName);

export default router;