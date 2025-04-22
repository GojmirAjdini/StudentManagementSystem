import controllerProfesori from "../controllers/Profesori.js"
import express from "express";

const router = express.Router();

router.get("/all",controllerProfesori.readProfesoret);
router.post("/register",controllerProfesori.registerProfesoret);
router.delete("/delete/:ProfesoriID",controllerProfesori.deleteProfesorSipasId);
router.post("/login",controllerProfesori.loginProfessor);
router.patch("/update/:ProfesoriID", controllerProfesori.updatePassword);

export default router;