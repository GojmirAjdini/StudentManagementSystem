import kontrollerAdmin from "../controllers/StafiAdministrativ.js";
import controllerProfesori from "../controllers/Profesori.js";
import studentKontroller from "../controllers/Studenti.js";
import controllersLenda from "../controllers/Lenda.js";
import controllerFakulteti from "../controllers/Fakulteti.js";
import kontrollerSemestri from '../controllers/Semestri.js';
import provimet from "../controllers/Provimi.js";

import express, { Router } from "express";

import auth from "../middlewares/Authentication.js";
import refreshAccessToken from "../middlewares/RefreshToken.js";

const router = express.Router();

//ADMIN//
router.get("/all",auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.readAdminet);
router.post("/register", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.registerAdmin);
router.post("/profesor/login", kontrollerAdmin.loginAdmin);
router.patch("/update/:AdminID",auth.verifyToken, auth.eshteSuperAdmin,kontrollerAdmin.updatePassword);
router.get("/admin/:AdminID", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.readAdminById);
router.get("/search", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.readAdminByName);
router.get("/getAdminByEmail", auth.verifyToken, auth.eshteAdmin, kontrollerAdmin.getAdminByEmail);
router.delete("/delete/:AdminID", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.deleteAdminById);
router.delete("/deleteAll", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.deleteAllAdminet);
router.patch("/edit/:AdminID", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.patchAdmin);

//login
router.get('/check-authentication', auth.verifyToken, (req, res) => {
    res.status(200).json({ 
      message: "Authenticated", 
      email: req.user.email, 
      role: req.user.role });
  });

router.post('/refresh-token', refreshAccessToken );

//logout

router.post("/logout",(req, res) => {
   try {
  
    res.clearCookie('refreshToken', {
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      sameSite: 'Strict', 
      path: '/'
    });
   
    res.clearCookie('accessToken', {
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      sameSite: 'Strict', 
      path: '/'
    });
  
    return res.status(200).json({ message: "Ç'kyçja e suksesshme!" });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: 'Logout failed' });
  }
});

  
//PROFESORET//


router.post("/profesoret/register", auth.verifyToken, auth.eshteAdmin, controllerProfesori.registerProfesoret);
router.get("/profesoret/all", auth.verifyToken, auth.eshteAdmin, controllerProfesori.readProfesoret);
router.delete("/profesoret/delete/:ProfesoriID", auth.verifyToken, auth.eshteAdmin,controllerProfesori.deleteProfesorSipasId);
router.patch("/profesoret/edit/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.patchProfesorin);
router.get("/profesoret/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoProfesorinSipasId);
router.post("/profesoret/assign", auth.verifyToken, auth.eshteAdmin,controllerProfesori.caktoProfiLenda);
router.get("/profesoret/profesori/search", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoProfesorinSipasEmrit);
router.get("/profesoret-lendet/all", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoProfesoretLendet);
router.delete("/profesoret-lendet/delete/:LendaID/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.deleteProfesoretLendetSipasID);
router.get("/profesoret-lendet/read/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoLendetSipasProfesoriID);
router.post("/profesoret/cakto-fakultetin", auth.verifyToken, auth.eshteAdmin, controllerProfesori.caktoFakultetinProfesori);
router.get("/profesoret-fakultetet/read/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoFakultetetSipasProfesoritID);
router.get("/profesoret-fakultetet/all",auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoProfesoretFakultetet);
router.delete("/profesoret-fakultetet/deletesipas/:FakultetiID/:ProfesoriID",auth.verifyToken, auth.eshteAdmin,controllerProfesori.deleteProfesoretFakultetetSipasID);

//STUDENTET // 


router.get("/studentet/all",auth.verifyToken, auth.eshteAdmin, studentKontroller.lexoStudentet);
router.post("/studentet/register",auth.verifyToken, auth.eshteAdmin, studentKontroller.regjistroStudent);
router.delete("/studentet/delete/:ID",auth.verifyToken, auth.eshteAdmin, studentKontroller.fshijStudent);
router.delete("/studentet/deleteAll/",auth.verifyToken, auth.eshteAdmin,studentKontroller.fshijAllStudentet);
router.patch("/studentet/edit/:ID",auth.verifyToken, auth.eshteAdmin,studentKontroller.patchStudentin);
router.get("/studentet/:ID",auth.verifyToken, auth.eshteAdmin, studentKontroller.lexoStudentetByID);
router.get("/studentet/studenti/search",auth.verifyToken, auth.eshteAdmin,studentKontroller.lexoStudentetByName);
router.get("/studenti/notat/:ID",auth.verifyToken, auth.eshteAdmin, provimet.notatSipasID);
router.get("/studenti/mesatarja-notave/:ID",auth.verifyToken, auth.eshteAdmin, provimet.mesatarjaENotaveSipasID);

//LENDET//

router.get("/lendet/all",auth.verifyToken, auth.eshteAdmin, controllersLenda.lexoLendet);
router.post("/lendet/submit",auth.verifyToken, auth.eshteAdmin,controllersLenda.createLenden);
router.delete("/lendet/delete/:LendaID",auth.verifyToken, auth.eshteAdmin, controllersLenda.fshijLendenSipasId);
router.patch("/lendet/edit/:LendaID",auth.verifyToken, auth.eshteAdmin, controllersLenda.patchLenden);
router.get("/lendet/:LendaID", auth.verifyToken, auth.eshteAdmin,controllersLenda.lexoLendenSipasId);
router.get("/lendet/lenda/search",auth.verifyToken, auth.eshteAdmin,controllersLenda.lexoLendenByName);

//FAKULTETET//

router.get("/fakultetet/all",auth.verifyToken, auth.eshteAdmin, controllerFakulteti.lexojFakultetet);
router.post("/fakultetet/submit",auth.verifyToken, auth.eshteAdmin, controllerFakulteti.shtoFakultet);
router.delete("/fakultetet/delete/:FakultetiID",auth.verifyToken, auth.eshteAdmin, controllerFakulteti.fshijFakultetin);
router.put("/fakultetet/update/:FakultetiID",auth.verifyToken, auth.eshteAdmin, controllerFakulteti.updateFakultetin);
router.get("/fakultetet/:FakultetiID",auth.verifyToken, auth.eshteAdmin, controllerFakulteti.lexoFakultetinId);
router.patch("/fakultetet/edit/:FakultetiID", auth.verifyToken, auth.eshteAdmin,controllerFakulteti.patchFakulteti);
router.get("/fakultetet/fakulteti/search",auth.verifyToken, auth.eshteAdmin,controllerFakulteti.lexoFakultetinByName);
router.get("/nivelet-studimit", auth.verifyToken, auth.eshteAdmin, controllerFakulteti.lexoNiveletEStudimit);
router.get("/gjeneratat", auth.verifyToken, auth.eshteAdmin, controllerFakulteti.lexoGjeneratat);
router.post("/register/gjeneratat", auth.verifyToken, auth.eshteAdmin, controllerFakulteti.regjistroGjeneratat);

//SEMESTRI //

router.get('/semestri/all', auth.verifyToken, auth.eshteAdmin, kontrollerSemestri.readAllSemestrat);
router.post("/semestri/register",auth.verifyToken, auth.eshteAdmin, kontrollerSemestri.regjistroSemestrin);
router.get("/vitet/akademike/all",auth.verifyToken,auth.eshteAdmin,kontrollerSemestri.lexoVitetAkademike);
router.post("/cakto/vitin-akademik",auth.verifyToken, auth.eshteAdmin, kontrollerSemestri.regjistroVitinAkademik);
router.post("/regjistro/gjenerata-re",auth.verifyToken, auth.eshteAdmin, kontrollerSemestri.regjistroGjeneraten);
router.delete("/fshij/vitin-akademik/:VitiAkademikID", auth.verifyToken, auth.eshteAdmin, kontrollerSemestri.fshijVitinAkademik);
// PROVIMET //

router.get("/provimet/all", auth.verifyToken, auth.eshteAdmin, provimet.lexoAllProvimet);
router.post("/provimet/register", auth.verifyToken, auth.eshteAdmin, provimet.caktoProviminByAdmin);
router.get("/periudhat-provimeve", auth.verifyToken, auth.eshteAdmin, provimet.lexoPeriudhatEProvimeve);
router.post("/periudhat-provimeve/regjistro", auth.verifyToken, auth.eshteAdmin, provimet.caktoPeriudhenEProvimeve);
router.get("/provimet/sipas-afatit", auth.verifyToken, auth.eshteAdmin, provimet.lexoProvimetSipasAfatit);
router.delete("/provimet/delete/:ProvimiID", auth.verifyToken, auth.eshteAdmin, provimet.fshijProvimin);

export default router;  