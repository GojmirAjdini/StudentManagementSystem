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

        const sql = "SELECT Password FROM stafiadministrativ WHERE Email = ?";

        const [storedPassword] = await db.promise().query(sql, Email);

        const admin = storedPassword[0];
        
        StafiAdministrativ.loginAdmin(Email,(err, results) =>{

            if(err){
                return res.status(500).json(err);
            }

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

const updatePassword = async (req, res) =>{

    const salts = 10;

    try{

        const ID = req.params.AdminID;
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({message: "Te gjitha fushat duhen plotesuar!"})
        }

        const sql = "SELECT Password from stafiAdministrativ WHERE AdminID = ?";

        const [oldPasswordCheck] = await db.promise().query(sql, [ID]);

        if(oldPasswordCheck.length === 0){
            return res.status(404).json({message: "Nuk ekziston ID e specifikuar!"});
        }

        const storedPassword = oldPasswordCheck[0].Password;

        let check = await bcrypt.compare(oldPassword, storedPassword);
        
            if(!check){
        
             return res.status(400).json({message: "Ju lutem kontrolloni passwordin tuaj te vjeter!"});
        }
            
            if(newPassword === oldPassword){
                return res.json({message: "Passwordi i ri nuk mund te jete i njejte me te vjetrin!"});
            }

            if(newPassword !== confirmPassword){
                return res.json({message: "Ju lutem konfirmoni passwordin tuaj te ri!"});
            }

            const hashedPassword = await bcrypt.hash(newPassword, salts);
            
            StafiAdministrativ.updatePasword(ID,hashedPassword,(err, results) =>{

                if(err){
                    return res.status(500).json(err,{message:"Server error"});
                }
    
                if(results.affectedRows === 0){
                    return res.status(404).json({message: "Passwordi nuk u perditesua!"});
                }
    
                return res.status(201).json({message: "Passwordi juaj u perditesua me sukses!"});
            });
        }
        catch(err){
            console.error(err);
            return res.status(500).json({message:err});
    }
}

export default {readAdminet, registerAdmin, loginAdmin, updatePassword};