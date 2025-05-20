import controllerProfesori from "../controllers/Profesori.js"
import express from "express";
import auth from "../middlewares/Authentication.js";

const router = express.Router();


router.patch("/updatePassword/:ProfesoriID", auth.verifyToken, 
    auth.eshteProfesor, controllerProfesori.updatePassword);

router.get("/profile", auth.verifyToken, controllerProfesori.lexoProfesorinSipasEmail);


export default router;