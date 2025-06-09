import controllerProfesori from "../controllers/Profesori.js"
import express from "express";
import auth from "../middlewares/Authentication.js";
import provimet from "../controllers/Provimi.js";

const router = express.Router();


router.patch("/updatePassword/:ProfesoriID", auth.verifyToken, 
    auth.eshteProfesor, controllerProfesori.updatePassword);

router.get("/profile", auth.verifyToken, auth.eshteProfesor, controllerProfesori.lexoProfesorinSipasEmail);
router.get("/MY/lendet", auth.verifyToken, auth.eshteProfesor, controllerProfesori.lexoLendetPerProfesorinSipasEmail);
router.get("/MY/provimet", auth.verifyToken, auth.eshteProfesor, controllerProfesori.lexoStudentetProvimet);
router.post("/provimet/cakto-noten",auth.verifyToken, auth.eshteProfesor, provimet.caktoNotenEProvimit);

export default router;