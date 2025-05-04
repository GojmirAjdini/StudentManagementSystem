import controllerProfesori from "../controllers/Profesori.js"
import express from "express";

const router = express.Router();

router.get("/all",controllerProfesori.readProfesoret);
router.post("/register",controllerProfesori.registerProfesoret);
router.delete("/delete/:ProfesoriID",controllerProfesori.deleteProfesorSipasId);
router.post("/login",controllerProfesori.loginProfessor);
router.patch("/update/:ProfesoriID", controllerProfesori.updatePassword);
router.patch("/edit/:ProfesoriID", controllerProfesori.patchProfesorin);
router.get("/:ProfesoriID", controllerProfesori.lexoProfesorinSipasId);

export default router;