import controllersLenda from "../controllers/Lenda.js";
import express from "express";

const router = express.Router();

router.get("/all", controllersLenda.lexoLendet);

export default router;