import kontrollerAdmin from "../controllers/StafiAdministrativ.js";
import controllerProfesori from "../controllers/Profesori.js";
import studentKontroller from "../controllers/Studenti.js";
import controllersLenda from "../controllers/Lenda.js";
import controllerFakulteti from "../controllers/Fakulteti.js";
import kontrollerSemestri from '../controllers/Semestri.js';

import express from "express";

import auth from "../middlewares/Authentication.js";
import refreshAccessToken from "../middlewares/RefreshToken.js";

const router = express.Router();

//ADMIN//
router.get("/all",auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.readAdminet);
router.post("/register", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.registerAdmin);
router.post("/login", kontrollerAdmin.loginAdmin);
router.patch("/update/:AdminID",auth.verifyToken, auth.eshteSuperAdmin,kontrollerAdmin.updatePassword);
router.get("/edit/:AdminID", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.readAdminById);
router.get("/admin/search", auth.verifyToken, auth.eshteSuperAdmin, kontrollerAdmin.readAdminByName);
router.get("/admin", auth.verifyToken, kontrollerAdmin.getAdminByEmail);

//login
router.get('/admin/check-auth', auth.verifyToken, auth.eshteAdmin, (req, res) => {
    res.status(200).json({ 
      message: "Authenticated", 
      user: req.user, 
      role: req.user.role });
  });

router.post('/admin/refresh-token', refreshAccessToken );

//logout

router.post("/logout", auth.verifyToken, (req, res) => {
    
    res.clearCookie('accessToken', {
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      sameSite: 'Strict', 
      path: '/' });

    res.clearCookie('refreshToken', {
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      sameSite: 'Strict', 
      path: '/' });

    res.status(200).json({ message: "Ç'kyçja e suksesshme!" });
});

  
//PROFESORET//

router.get("/profesoret/all", auth.verifyToken, auth.eshteAdmin, controllerProfesori.readProfesoret);
router.delete("/profesoret/delete/:ProfesoriID", auth.verifyToken, auth.eshteAdmin,controllerProfesori.deleteProfesorSipasId);
router.patch("/profesoret/edit/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.patchProfesorin);
router.get("/profesoret/:ProfesoriID", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoProfesorinSipasId);
router.post("/profesoret/assign", auth.verifyToken, auth.eshteAdmin,controllerProfesori.caktoProfiLenda);
router.get("/profesoret/profesori/search", auth.verifyToken, auth.eshteAdmin, controllerProfesori.lexoProfesorinSipasEmrit);


//STUDENTET // 


router.get("/studentet/all",auth.verifyToken, auth.eshteAdmin, studentKontroller.lexoStudentet);
router.post("/studentet/register",auth.verifyToken, auth.eshteAdmin, studentKontroller.regjistroStudent);
router.delete("/studentet/delete/:ID",auth.verifyToken, auth.eshteAdmin, studentKontroller.fshijStudent);
router.delete("/studentet/deleteAll/",auth.verifyToken, auth.eshteAdmin,studentKontroller.fshijAllStudentet);
router.patch("/studentet/edit/:ID",auth.verifyToken, auth.eshteAdmin,studentKontroller.patchStudentin);
router.get("/studentet/:ID",auth.verifyToken, auth.eshteAdmin, studentKontroller.lexoStudentetByID);
router.get("/studentet/studenti/search",auth.verifyToken, auth.eshteAdmin,studentKontroller.lexoStudentetByName);

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

//SEMESTRI //

router.get('/semestri/all', auth.verifyToken, auth.eshteAdmin, kontrollerSemestri.readAllSemestrat);
export default router;  