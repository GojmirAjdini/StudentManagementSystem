import Profesori from "../models/Profesori.js";
import db from "../database/Database.js";
import ProfesoriCredentials from "./ProfesoriCredentials.js";
import bcrypt from "bcrypt";
import { resolveContent } from "nodemailer/lib/shared/index.js";

const readProfesoret = async (req, res) =>{

    try{
    
         Profesori.lexoProfesoret((err, results) =>{

            if(err){
                return res.status(500).json({message:"Server error"});
            }
            if(results.length === 0){
                return res.status(404).json({message: "Nuk ka te dhena!" });
            }
            
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
            EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik} = req.body;

            const emailCheckQuery = `
            SELECT EmailPrivat FROM profesori WHERE EmailPrivat = ? 
            UNION 
            SELECT EmailPrivat FROM studenti WHERE EmailPrivat = ?
            UNION 
            SELECT Email from stafiadministrativ WHERE Email = ? 
        `;

        const [checkResults] = await db.promise().query(emailCheckQuery, [EmailPrivat, EmailPrivat, EmailPrivat]);

        if (checkResults.length > 0) {
            return res.status(400).json({ message: "Ky email ekziston tashmë në sistem!" });
        }
        
        const EmailAkademik = ProfesoriCredentials.randomEmail(Emri, Mbiemri);
        const Password = ProfesoriCredentials.randomPassword(Emri, Mbiemri);

        const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
        const upCMbiemri = Mbiemri.charAt(0).toUpperCase() + Mbiemri.slice(1);

        const hashedPassword = await bcrypt.hash(Password, salts);

        Profesori.regjistroProfesorin(FakultetiID, upCEmri, upCMbiemri, Gjinia, EmailAkademik, NrTel, 
            hashedPassword, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik, (err, results) =>{

            if(err){
                console.error(err);
                return res.status(500).json({message: "Server error"});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message: "Te dhenat nuk u regjistruan!"});
            } else{

        ProfesoriCredentials.sendEmail(EmailPrivat, EmailAkademik, Password);
            console.log("Te dhenat u regjistruan!");
            return res.status(201).json({
                message: "Profesori u regjistrua me sukses", 
                emailNotification: `Të dhënat iu dërguan profesorit në email!`,
                Email: `EmailAkademise: ${EmailAkademik}`,
                Password: `Password: ${Password}`
            });
        }
    });
    
    }
    catch(err){
        console.error(err);
        return res.status(500).json({err:true, message:err.message});
    }
}

const deleteProfesorSipasId = async (req, res) => {
    
    try{
        const id = req.params.ProfesoriID;

        Profesori.fshijProfesorinSipasId(id,(err, results) =>{

            if(err){
                return res.status(500).json("Server error");
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message: "Te dhenat nuk u fshine!"});
            }

            return res.status(200).json({message:"Te dhënat u fshinë me sukses!"});
        })
    } catch(err){
        console.error(err);
        return res.status(500).json({err: true, error: err});
    }
}

const loginProfessor = async (req, res) =>{

    try{

        const {Email, Password} = req.body;

        Profesori.loginProfessori(Email,(err, results) =>{

            if(err){
                return res.status(500).json({message: "Server error", error: err});
            }
            if(results.length === 0){
                return res.status(404).json({message: "Nuk ka llogari me emailin e shtypur!"});
            }

            const profesori = results[0];

            bcrypt.compare(Password, profesori.Password,(err, passCheck) =>{

                if(err){
                    return res.status(500).json(err);
                }
                if(!passCheck){
                    return res.status(404).json({loginMessage: "Kyçja deshtoi!", message:"Ju lutem kontrolloni passwordin tuaj!"});
                }
                
                return res.status(200).json({loginMessage:"Kyçja e suksesshme", 
                    message: `Pershendetje Profesor: ${Email}`,
                    data: results
            });
        })
    });
}
    catch(err){
        console.error(err);
        return res.status(500).json({message: err});
    }
}

const updatePassword = async (req, res) =>{

    const salts = 10;

    try{

        const ID = req.params.ProfesoriID;
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({message: "Fushat duhen plotësuar!"});

        }

        const sql = "SELECT Password FROM Profesori WHERE ProfesoriID = ?";

        if(oldPasswordCheck.length === 0){
        return res.status(404).json({message: "Nuk ekziston ID e specifikuar!"});}

        const [oldPasswordcheck] = await db.promise().query(sql, ID);

        const storedPassword = oldPasswordcheck[0].Password;

        let check = await bcrypt.compare(oldPassword, storedPassword);

            if(!check){

                return res.status(400).json({message: "Ju lutem kontrolloni passwordin tuaj te vjeter!"});
        }
        
        if(newPassword === oldPassword){
            return res.status(400).json({message: "Passwordi i ri nuk mund te jete i njejte me te vjetrin!"});

        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({message: "Ju lutem konfirmoni passwordin tuaj te ri!"});

        }

        
        const hashedPassword = await bcrypt.hash(newPassword, salts);

        Profesori.updatePassword(ID,hashedPassword,(err, results) =>{

            if(err){
                return res.status(500).json({message: "Server error", error: err});
            }

            if(results.affectedRows === 0){
                return res.status(404).json({message: "Passwordi nuk u perditesua!"});
            }

            return res.status(201).json({message: "Passwordi juaj u perditesua me sukses!"});
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({message:err});
    }
}

const patchProfesorin = async (req, res) => {

    try{

        const {FakultetiID, Emri, Mbiemri, Gjinia, Email, NrTel, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik} = req.body;
        const id = req.params.ProfesoriID;

        const fushat = [];
        const values = [];  
        
        if(FakultetiID){ fushat.push("FakultetiID = ?"); values.push(FakultetiID);}
        if(Emri){ fushat.push("Emri = ?"); values.push(Emri);}
        if(Mbiemri){ fushat.push("Mbiemri = ?"); values.push(Mbiemri);} 
        if(Gjinia){ fushat.push("Gjinia = ?"); values.push(Gjinia);}
        if(Email){ fushat.push("Email = ?"); values.push(Email);}   
        if(NrTel){ fushat.push("NrTel = ?"); values.push(NrTel);}
        if(EmailPrivat){ fushat.push("EmailPrivat = ?"); values.push(EmailPrivat);}
        if(Data_Punesimit){ fushat.push("Data_Punesimit = ?"); values.push(Data_Punesimit);}
        if(Statusi){ fushat.push("Statusi = ?"); values.push(Statusi);}
        if(Titulli_Akademik){ fushat.push("Titulli_Akademik = ?"); values.push(Titulli_Akademik);}
    
    
        Profesori.patchProfesori(id, fushat, values,  (err, results) =>{

            if(err){
                return res.status(500).json({message: "Server error", error: err});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message: "Te dhënat nuk u përditësuan!"});
            }

            return res.status(200).json({message: "Te dhënat u përditësuan me sukses!"});
        })

    }catch(err){
        console.error(err);
        return res.status(500).json({message: err});
}
}

const lexoProfesorinSipasId = async (req, res) =>{

    try{
        const id = req.params.ProfesoriID;

        Profesori.lexoProfesorinSipasId(id, (err, results) =>{

            if(err){
                return res.status(500).json({message: "Server error", error: err});
            }
            if(results.length === 0){
                return res.status(404).json({message: "Nuk ka te dhena!"});
            }

            return res.status(200).json(results);
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({message: err});
    }
}


export default {readProfesoret, registerProfesoret,deleteProfesorSipasId, 
    loginProfessor, updatePassword, patchProfesorin, lexoProfesorinSipasId};