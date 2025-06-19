import express from "express";
import studentKontroller from "../controllers/Studenti.js";
import provimet from "../controllers/Provimi.js";

import auth from "../middlewares/Authentication.js";

const router = express.Router();

router.patch("/update/:ID",studentKontroller.updatePassword);
router.post("/login",studentKontroller.loginStudenti);
router.get("/dashboard", auth.verifyToken, auth.eshteStudent, studentKontroller.lexoStudentinByEmail);
router.post("/register/semester", auth.verifyToken, auth.eshteStudent, studentKontroller.regjistroSemestrinPerStudent )
router.get("/semestrat", auth.verifyToken, auth.eshteStudent, studentKontroller.lexoSemestratSipasFakultetit);
router.get("/lista-semestrave/registered",auth.verifyToken, auth.eshteStudent, studentKontroller.listaSemestraveTeRegjistruar);
router.delete("/semestrat/delete/:ID", auth.verifyToken, auth.eshteStudent, studentKontroller.çregjistroSemestrin);

router.post("/paraqit-provimin",auth.verifyToken, auth.eshteStudent, provimet.paraqitProviminStudent);
router.get("/lista/provimeve", auth.verifyToken, auth.eshteStudent, provimet.lexoProvimetSipasStudentit);
router.get("/provimet/paraqitura/student", auth.verifyToken, auth.eshteStudent, provimet.lexoProvimetEParaqituraTeStudentit);
router.get("/transkripta/notat", auth.verifyToken, auth.eshteStudent, provimet.transkriptaENotave);
router.get("/mesatarja/notat", auth.verifyToken, auth.eshteStudent, provimet.mesatarjaENotave);
router.get("/profesoret/provimi/:ProvimiID", auth.verifyToken, auth.eshteStudent,provimet.lexoProfesoretSipasProvimit);
router.delete("/anulo-paraqitjen/provimet-paraqitura/:RegjistrimiProvimitID", auth.verifyToken, auth.eshteStudent, provimet.anuloParaqitjenEProvimit);
router.delete("/refuzo-noten/provimet-paraqitura/:RezultatiID", auth.verifyToken, auth.eshteStudent, provimet.refuzoNoten);
router.get("/kontrollo-noten/provimit/:RegjistrimiProvimitID", auth.verifyToken, auth.eshteStudent, provimet.kontrolloRefuziminENotes);
router.get("/numri-provimeve/afati", auth.verifyToken, auth.eshteStudent, provimet.numriIProvimevePerNjePeriudhe);
router.get("/ekziston/afati-provimeve", auth.verifyToken, auth.eshteStudent, provimet.ekzistonAfatiProvimit);
router.get("/ekziston/afati-perfundimit-notave", auth.verifyToken, auth.eshteStudent, provimet.ekzistonAfatiIPerfundimitTeNotave);
router.delete("/delete/provimet-e-pakaluara", auth.verifyToken, auth.eshteStudent, provimet.fshijProvimetEPaKaluara);

router.post("/logout",studentKontroller.logout);


export default router;