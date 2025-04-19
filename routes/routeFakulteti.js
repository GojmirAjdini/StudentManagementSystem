import express from "express";
import controllerFakulteti from "../controllers/Fakulteti.js";

const router = express.Router();

router.get("/all", controllerFakulteti.lexojFakultetet);
router.post("/submit", controllerFakulteti.shtoFakultet);
router.delete("/delete/:FakultetiID", controllerFakulteti.fshijFakultetin);

export default router;