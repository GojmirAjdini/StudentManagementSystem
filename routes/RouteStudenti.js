import express from "express";
import studentKontroller from "../controllers/Studenti.js";

import auth from "../middlewares/Authentication.js";

const router = express.Router();

router.patch("/update/:ID",studentKontroller.updatePassword);
router.post("/login",studentKontroller.loginStudenti);
router.get("/dashboard", auth.verifyToken, auth.eshteStudent, studentKontroller.lexoStudentinByEmail);
router.post("/register/semester", auth.verifyToken, auth.eshteStudent, studentKontroller.regjistroSemestrinPerStudent )
router.get("/semestrat", auth.verifyToken, auth.eshteStudent, studentKontroller.lexoSemestratSipasFakultetit);
router.get("/lista-semestrave/registered",auth.verifyToken, auth.eshteStudent, studentKontroller.listaSemestraveTeRegjistruar);

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
    return res.status(500).json({ message: "Ç'kyçja dështoi!" });
  }
});


export default router;