import Profesori from "../models/Profesori.js";
import db from "../database/Database.js";
import ProfesoriCredentials from "./ProfesoriCredentials.js";
import bcrypt from "bcrypt";

const readProfesoret = async (req, res) =>{

    try{
    
         Profesori.lexoProfesoret((err, results) =>{

            if(err){
                return res.status(500).json({message:"Server error"});
            }
            if(results.length === 0){
                return res.status(404).json({message: "Nuk ka te dhena!" });
            }
            
            console.log(results);
            return res.status(200).json(results);
    
        })      
   
    }catch(err){
        console.error(err);
        return res.status(500).json({err:true, message:err.message});
    }
}

const registerProfesoret = async (req, res) =>{

    const salts = 10;

    try{

        const {FakultetiID, Emri, Mbiemri, Gjinia, NrTel, 
            EmailPrivat, Data_Punesimit, Statusi} = req.body;

            const emailCheckQuery = `
            SELECT EmailPrivat FROM profesori WHERE EmailPrivat = ? 
            UNION 
            SELECT EmailPrivat FROM studenti WHERE EmailPrivat = ? 
        `;

        const [checkResults] = await db.promise().query(emailCheckQuery, [EmailPrivat, EmailPrivat]);

        if (checkResults.length > 0) {
            return res.status(400).json({ message: "Ky email ekziston tashmë në sistem!" });
        }
        
        const EmailAkademik = ProfesoriCredentials.randomEmail(Emri, Mbiemri);
        const Password = ProfesoriCredentials.randomPassword(Emri, Mbiemri);

        const hashedPassword = await bcrypt.hash(Password, salts);

        Profesori.regjistroProfesorin(FakultetiID, Emri, Mbiemri, Gjinia, EmailAkademik, NrTel, 
            hashedPassword, EmailPrivat, Data_Punesimit, Statusi, (err, results) =>{

            if(err){
                return res.status(500).json({message: "Server error"});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message: "Te dhenat nuk u regjistruan!"});
            }
            return res.status(201).json({message: "Te dhenat u regjistruan me sukses"});
    });
    
    }
    catch(err){
        console.error(err);
        return res.status(500).json({err:true, message:err.message});
    }
}

export default {readProfesoret, registerProfesoret};