import kontrollerAdmin from "../controllers/StafiAdministrativ.js";
import express from "express";

const router = express.Router();

router.get("/all",kontrollerAdmin.readAdminet);
router.post("/register",kontrollerAdmin.registerAdmin);
router.post("/login",kontrollerAdmin.loginAdmin);

export default router;