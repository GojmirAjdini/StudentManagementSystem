import db from "../database/Database.js";
import StafiAdministrativ from "../models/StafiAdministrativ.js";
import Admin from "../models/StafiAdministrativ.js";
import bcrypt from "bcrypt";

const readAdminet = async (req, res) => {
    
    try{

        Admin.lexoAdminet((err, adminet) =>{

            if(err){
                return res.status(500).json(err);
            }   
            if(adminet.length === 0){
                return res.status(404).json({message: "Nuk ka te dhena per adminet!"});
            }
            console.log(adminet.length);
            res.status(200).json(adminet);
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({message: err});

    }
}

const registerAdmin = async (req, res) =>{

    const salts = 10;

    try{

        const {FakultetiID, Email, Password, Emri, Mbiemri} = req.body;

        const emailCheckQuery = `
            SELECT EmailPrivat FROM profesori WHERE EmailPrivat = ? 
            UNION 
            SELECT EmailPrivat FROM studenti WHERE EmailPrivat = ?
            UNION 
            SELECT Email from stafiadministrativ WHERE Email = ? 
        `;

        const [checkResults] = await db.promise().query(emailCheckQuery, [Email, Email, Email]);

        if (checkResults.length > 0) {
            return res.status(400).json({ message: "Ky email ekziston tashmë në sistem!" });
        }
        
        const hashedPassword = await bcrypt.hash(Password, salts);

        Admin.regjistroAdmin(FakultetiID, Email, hashedPassword, Emri, Mbiemri,(err, results) =>{

            if(err){
                return res.status(500).json(err);
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Te dhenat nuk u regjistruan.."});
            }
            
            return res.status(201).json({message:"Te dhenat u regjistruan me sukses!", Data: results});
        })
    } catch(err){
        console.error(err);
        return res.status(500).json({message: err});
    }
}

const loginAdmin = async (req,res) =>{

    try{

        const {Email, Password} = req.body;
        
        StafiAdministrativ.loginAdmin(Email,(err, results) =>{

            if(err){
                return res.status(500).json(err);
            }
            const admin = results[0];

            bcrypt.compare(Password, admin.Password,(err, passCheck) =>{

                if(err){
                    return res.status(500).json(err);
                }

                if(!passCheck){
                    return res.status(404).json({loginMessage: "Kyçja deshtoi!", message:"Ju lutem kontrolloni passwordin tuaj!"});
                }

                return res.status(200).json({loginMessage:"Kyçja e suksesshme", 
                    message: `Pershendetje Admin: ${Email}`,
                    data: results
                });
            });
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({message: err});

    }
}

export default {readAdminet, registerAdmin, loginAdmin};