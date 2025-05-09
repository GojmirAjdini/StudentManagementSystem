import controllerProfesori from "../controllers/Profesori.js"
import express from "express";

const router = express.Router();

router.post("/register",controllerProfesori.registerProfesoret);
router.post("/login",controllerProfesori.loginProfessor);
router.patch("/update/:ProfesoriID", controllerProfesori.updatePassword);


export default router;