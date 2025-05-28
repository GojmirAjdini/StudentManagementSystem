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
        const { Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID } = req.body;
        Semestri.regjistroSemestrin(Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID, (err, results) => {
            console.log(results); 
            
            console.log('Received data:', {
        Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID
    });
            if(err){
           
                if (err.code === 'ER_DUP_ENTRY') {
                return res.status(404).json({message:"Semestri ekziston tashmë!"})
                
            }
                return res.status(500).json({ err: err, message:"Gabim gjatë regjistrimit"});
                
            }
            
            return res.status(200).json({ message: "Semestri u regjistrua me sukses!" });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

const lexoVitetAkademike = (req, res) =>{

   try {
        Semestri.lexoVitetAkademike((err, results) => {
            if(err){
                return res.status(500).json({err: true, message:err});
            }
            return res.status(200).json(results);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

export default {
    readAllSemestrat,regjistroSemestrin,lexoVitetAkademike
}