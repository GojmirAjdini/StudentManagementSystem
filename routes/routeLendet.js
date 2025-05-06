import controllersLenda from "../controllers/Lenda.js";
import express from "express";

const router = express.Router();

router.get("/all", controllersLenda.lexoLendet);
router.post("/submit",controllersLenda.createLenden);
router.delete("/delete/:LendaID", controllersLenda.fshijLendenSipasId);
router.patch("/edit/:LendaID", controllersLenda.patchLenden);
router.get("/:LendaID", controllersLenda.lexoLendenSipasId);
router.get("/lenda/search",controllersLenda.lexoLendenByName);

export default router;