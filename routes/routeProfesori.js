import controllerProfesori from "../controllers/Profesori.js"
import express from "express";

const router = express.Router();

router.get("/all",controllerProfesori.readProfesoret);
router.post("/submit",controllerProfesori.registerProfesoret);

export default router;