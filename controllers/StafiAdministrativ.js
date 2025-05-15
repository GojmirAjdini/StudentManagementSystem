import db from "../database/Database.js";
import StafiAdministrativ from "../models/StafiAdministrativ.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const readAdminet = async (req, res) => {
    
    try{

        StafiAdministrativ.lexoAdminet((err, adminet) =>{

            if(err){
                return res.status(500).json(err);
            }   
            if(adminet.length === 0){
                return res.status(404).json({message: "Nuk ka të dhëna për adminët!"});
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

        const {FakultetiID, Email, Password, Emri, Mbiemri, role} = req.body;

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

        const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
        const upCMbiemri = Mbiemri.charAt(0).toUpperCase() + Mbiemri.slice(1);


        StafiAdministrativ.regjistroAdmin(FakultetiID, Email.trim(), hashedPassword, upCEmri.trim(), upCMbiemri.trim(), role.trim(),(err, results) =>{

            if(err){
                return res.status(500).json(err);
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Te dhënat nuk u regjistruan.."});
            }
            
            return res.status(201).json({message:"Te dhënat u regjistruan me sukses!", Data: results});
        })
    } catch(err){
        console.error(err);
        return res.status(500).json({message: err});
    }
}

const loginAdmin = async (req,res) =>{

    try{

        const {Email, Password} = req.body;

        const trimEmail = Email.trim();
        
        if(!Email && !Password){
            return res.status(404).json({message: "Plotësoni fushat!"});
        }

        const sql = "SELECT Password, role FROM stafiadministrativ WHERE Email = ?";

        const [storedPassword] = await db.promise().query(sql, [trimEmail]);

        const admin = storedPassword[0];
        
        
        
        if(!admin){
            return res.status(404).json({message: "Email nuk ekziston!"});
        }
        
        StafiAdministrativ.loginAdmin(trimEmail,(err, results) =>{

            if(err){
                return res.status(500).json(err);
            }

            bcrypt.compare(Password, admin.Password,(err, passCheck) =>{

                if(err){
                    return res.status(500).json(err);
                }

                if(!passCheck){
                    return res.status(401).json({loginMessage: "Kyçja dështoi!", message:"Ju lutem kontrolloni passwordin tuaj!"});
                }

                const tokenPayLoad = {
                    email: trimEmail,
                    role: admin.role
                }
                
                const accessToken = jwt.sign(tokenPayLoad,process.env.SECRET_TOKEN,{expiresIn:"1h"});

                const refreshToken = jwt.sign(tokenPayLoad, process.env.REFRESH_TOKEN, {expiresIn:"7d"})

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 1000,
                    sameSite: 'Strict'
                })

                console.log(results);

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'Strict'
                })


                return res.status(200).json({loginMessage:"Kyçja e suksesshme", 
                    message: `Përshëndetje Admin: ${trimEmail}`,
                    data: results,
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
            return res.status(400).json({message: "Të gjitha fushat duhen plotësuar!"})
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
                    return res.status(500).json({error:err,message:"Server error"});
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

const readAdminById  = async (req, res) =>{

    try{

        const AdminID = req.params.AdminId;

        StafiAdministrativ.searchAdminById([AdminID],(err, adminet) =>{

            
            if(err){
                return res.status(500).json(err);
            }   
            if(adminet.length === 0){
                return res.status(404).json({message: "Nuk ka të dhëna për adminët!"});
            }
            console.log(adminet.length);
            res.status(200).json(adminet);
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: err});

    }
}

const readAdminByName  = async (req, res) =>{

    try{

        const Emri = req.query.Emri_Adminit;

        StafiAdministrativ.searchAdminById([Emri],(err, adminet) =>{

            
            if(err){
                return res.status(500).json(err);
            }   
            if(adminet.length === 0){
                return res.status(404).json({message: "Nuk ka të dhëna për adminët!"});
            }
            console.log(adminet.length);
            res.status(200).json(adminet);
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: err});

    }
}

const getAdminByEmail = async (req, res) =>{

    try{

        const email = req.user.email;

        StafiAdministrativ.getAdminByEmail([email], (err, results) =>{
            
            if(err){
                return res.status(500).json({message:"Error",err});
            }
            if(results.length === 0){
                return res.status(404).json({message:"Admini nuk ekziston!"});
            }

            return res.status(200).json(results);
        })
        
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Error",err});

    }
}

export default {readAdminet, registerAdmin, loginAdmin, 
    updatePassword, readAdminById, readAdminByName,
    getAdminByEmail};