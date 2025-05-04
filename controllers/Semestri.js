import Semestri from "../models/Semestri.js";

const readAllSemestrat = async (req, res) => {
    try {
        Semestri.readAllSemestrat((results) => {
            return res.status(200).json(results);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

const regjistroSemestrin = async (req, res) => {
    try {
        const { AfatiSemestrit, Nr_Semestrit } = req.body;
        Semestri.regjistroSemestrin(AfatiSemestrit, Nr_Semestrit, (err, results) => {
            if (err) {
                return res.status(404).json(err);
            }
            return res.status(200).json({ message: "Semestri u regjistrua me sukses!" });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

export default {
    readAllSemestrat,
    regjistroSemestrin
}