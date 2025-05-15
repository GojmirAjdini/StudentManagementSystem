import Studenti from "../models/Studenti.js";
import bcrypt from "bcrypt";
import StudentCredentials from "./StudentCredentials.js";
import db from "../database/Database.js";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const lexoStudentet = async (req, res) =>{
    
    try{
        
        Studenti.readAll((err, studentet) =>{

            if(err){
                return res.status(500).json("Server error");
            }
            if(studentet.length === 0){
                return res.status(404).json({message: "Nuk ka te dhena!"});
            }
            
            res.status(200).json(studentet);
        });
    }
        catch(err){
            console.log("Error reading students!", err);
            return res.status(500).json({error: "Server error"})
        }  
    } 


const regjistroStudent = async (req, res) =>{

    const salts = 10;

    try{   
        
        const {Emri, Mbiemri, Gjinia, EmailPrivat, Vendlindja, 
            Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi} = req.body;

            const emailCheckQuery = `
            SELECT EmailPrivat FROM profesori WHERE EmailPrivat = ? 
            UNION 
            SELECT EmailPrivat FROM studenti WHERE EmailPrivat = ?
            UNION 
            SELECT Email from stafiadministrativ WHERE Email = ?
        `;
            // KONTROLLO NESE EMAIL PRIVAT EKZISTON NE DATABAZE //
        const [checkResults] = await db.promise().query(emailCheckQuery, [EmailPrivat, EmailPrivat, EmailPrivat]);

        if (checkResults.length > 0) {
            return res.status(400).json({ message: "Ky email ekziston tashmë në sistem!" });
        }

        const lastStudentIdCheck = `SELECT s.StudentiID 
        FROM Studenti s 
        ORDER BY s.StudentiID DESC LIMIT 0, 1`;

        const vitiAkademik = StudentCredentials.vitiAkademik();

        const latestIDAkademik = `${vitiAkademik}%`;

        const [resultsID] = await db.promise().query(lastStudentIdCheck,[latestIDAkademik]);
        
        const lastId = resultsID.length > 0 ? parseInt(resultsID[0].StudentiID) : 0;

        const studentiID = StudentCredentials.generateStudentID(vitiAkademik,lastId);
        
        const emailstudentor = StudentCredentials.randomEmail(Emri, Mbiemri, studentiID);
        const password = StudentCredentials.randomPassword(Emri, Mbiemri,studentiID);

        const hashedPassword = await bcrypt.hash(password, salts);

        const gjenerata = StudentCredentials.gjenerata();

        const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
        const upCMbiemri = Mbiemri.charAt(0).toUpperCase() + Mbiemri.slice(1);

        Studenti.createStudent( upCEmri.trim(), upCMbiemri.trim(), Gjinia, emailstudentor.trim(), EmailPrivat.trim(), 
            hashedPassword, Vendlindja.charAt(0).toUpperCase() + Vendlindja.slice(1), 
            Data_Lindjes, Adresa.charAt(0).toUpperCase() + Vendlindja.slice(1), Nr_Tel, 
            FakultetiID, Statusi, studentiID, gjenerata, (err, results) =>{

            if(err){
                console.log("Gabim gjate regjistrimit", err);
                return res.status(500).json({message: "Gabim gjate fshirjes!"})
            }

            if(results.affectedRows === 0){
                return res.status(404).json({message: "Studenti nuk u regjistrua!"});
            }
            else{
            
            StudentCredentials.sendEmail(EmailPrivat, emailstudentor, password);

            return res.status(200).json({
            message: "Studenti u regjistrua me sukses!",
            emailNotification: "Të dhënat iu dërguan studentit në email!",
            Student: Emri,
            Email: emailstudentor,
            Password: password
            
        });
    }
});

    }
catch(error){
    console.error(error);           
    return res.status(500).json({err: true, message: error})

}
}

const fshijStudent = async (req, res) => {
    
    try{
        const id = req.params.ID;

        Studenti.deleteById(id,(err, results) =>{

            if(err){
                console.log("Gabim gjate fshirjes!", err);
                return res.status(500).json({message: "Gabim gjate fshirjes!"})
                ;
            } 
            
            if(results.affectedRows === 0){
                console.log(`"Student me id ${id} nuk ekziston!"`)
                return res.status(404).json({ message: "Studenti nuk u gjet!" });
            }
            
            console.log("Studenti u fshi!");
            return res.status(200).json({message: "Studenti u fshi me sukses!"})

})
    } catch(err){
        console.error(err);
        return res.status(500).json({err: true, message: err.cause})

    }
}

const fshijAllStudentet = async (req, res) => {
    
    try{

        Studenti.deleteAll((err,results) =>{

            if(err){
                return res.status(500).json("Server error");
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message: "Nuk ka te dhena per te fshire!"});
            }
            
            return res.status(200).json({message: "Te gjithe te dhenat u fshine me sukses!"});
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({err: true, message: err});

    }
}

const updatePassword = async (req, res) =>{

    const salts = 10;
    try{

        const ID = req.params.ID;
        const {oldPassword, newPassword, confirmPassword } = req.body;

        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({message: "Fushat duhen plotësuar!"});

        }
            
        const sql = "SELECT Password from Studenti WHERE ID = ?";

        const [oldPasswordCheck] = await db.promise().query(sql, [ID]);

        if(oldPasswordCheck.length === 0){
            return res.status(404).json({message: "Nuk ekziston ID e specifikuar!"});}

        const storedPassword = oldPasswordCheck[0].Password;

        let checkPass = await bcrypt.compare(oldPassword, storedPassword);
        if(!checkPass){
            return res.status(400).json({message: "Ju lutem kontrolloni passwordin tuaj te vjeter!"});
        }
        
        if(newPassword === oldPassword){
            return res.status(400).json({message: "Passwordi i ri nuk mund te jete i njejte me te vjetrin!"});

        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({message: "Ju lutem konfirmoni passwordin tuaj te ri!"});

        }

        const hashedPassword = await bcrypt.hash(newPassword, salts);

        Studenti.updatePassword(ID,hashedPassword,(err, results) =>{

            if(err){
                return res.status(500).json(err,{message:"Server error"});
            }

            if(results.affectedRows === 0){
                return res.status(404).json({message: "Passwordi nuk u perditesua!"});
            }

            return res.status(201).json({message: "Passwordi juaj u perditesua me sukses!"});
        })
    }
catch(err){
        console.error(err);
        return res.status(500).json({message:err});

}
}

const loginStudenti = async(req, res) =>{

    try{

        const {EmailStudentor, Password} = req.body;
        
        if(!EmailStudentor || !Password){
            return res.json({message: "Te gjitha fushat duhet plotesuar!"});
        }

        const sql = "SELECT Password FROM Studenti WHERE EmailStudentor = ?";

        const [storedPassword] = await db.promise().query(sql, [EmailStudentor]);

        const studenti = storedPassword[0];

        Studenti.loginStudent(EmailStudentor.trim(),(err, results) =>{

            if(err){
                return res.status(500).json(err, { message: "Server error"});
            }
            
            if(results.length === 0){
                return res.status(404).json({message: "Ju lutem kontrolloni emailin tuaj!"});
            }

            bcrypt.compare(Password, studenti.Password,(err, passCheck) =>{

                if(err){
                    return res.status(500).json(err, { message: "Server error"});
                }

                if(!passCheck){
                    return res.status(400).json({loginMessage: "Kyçja deshtoi!" ,
                        message: "Ju lutem kontrolloni passwordin tuaj!"});
                }

                const tokenPayLoad = {
                    Email: EmailStudentor,
                    role: "student"
                } 

                
                const accessToken = jwt.sign(tokenPayLoad,process.env.SECRET_TOKEN,{expiresIn:"1h"});
                
                const refreshToken = jwt.sign(tokenPayLoad, process.env.REFRESH_TOKEN, {expiresIn:"7d"})
            
            res.cookie('accessToken', accessToken, {    
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000,
                sameSite: 'Strict'
            })
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'Strict'
            })
            
            
                return res.status(200).json({loginMessage:"Kyçja e suksesshme!", 
                    message: `Pershendetje Student: ${EmailStudentor}`,
                    data: results,
                   
                });
            })
        })

    }catch(err){
        console.error(err);
        return res.status(500).json({message:err});
    }
}

const patchStudentin = async (req, res) => {
    
    try{

        const id = req.params.ID;
        const {Emri, Mbiemri, Gjinia, EmailPrivat, Vendlindja, Data_Lindjes, 
            Adresa, Nr_Tel, FakultetiID, Statusi, Gjenerata} = req.body;

        const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
        const upCMbiemri = Mbiemri.charAt(0).toUpperCase() + Mbiemri.slice(1);

        const fushat = [];
        const values = [];
        
        if(upCEmri){ fushat.push('Emri = ?'); values.push(upCEmri.trim());} if(upCMbiemri){ fushat.push('Mbiemri = ?'); values.push(upCMbiemri.trim());} 
        if(Gjinia){ fushat.push('Gjinia = ?'); values.push(Gjinia);} if(EmailPrivat){ fushat.push('EmailPrivat = ?'); values.push(EmailPrivat.trim());} 
        if(Vendlindja.charAt(0).toUpperCase() + Vendlindja.slice(1)){ fushat.push('Vendlindja = ?'); values.push(Vendlindja.trim());} if(Data_Lindjes){ fushat.push('Data_Lindjes = ?'); values.push(Data_Lindjes);} 
        if(Adresa.charAt(0).toUpperCase() + Adresa.slice(1)){ fushat.push('Adresa = ?'); values.push(Adresa.trim());} if(Nr_Tel){ fushat.push('Nr_Tel = ?'); values.push(Nr_Tel.trim());} 
        if(FakultetiID){ fushat.push('FakultetiID = ?'); values.push(FakultetiID);} if(Statusi){ fushat.push('Statusi = ?'); values.push(Statusi);} 
        if(Gjenerata){ fushat.push('Gjenerata = ?'); values.push(Gjenerata);} 

        if(fushat.length === 0){

            return res.status(400).json({message: "Nuk ka të dhëna për regjistrim!"});
        }

        Studenti.patchStudenti(id, fushat, values, (err, results) =>{

            if (err) {
                return res.status(500).json({ message: "Gabim gjatë përditësimit të studentit.", error: err });
            }
            return res.status(200).json({ message: "Studenti u përditësua me sukses!", results });
        });
           
        } catch(err){
            console.error(err);
            return res.status(500).json({ message: "Server error", error: err });

        }
    }

    const lexoStudentetByID = async (req, res) =>{
    
        try{
            
            const id =  req.params.ID;

            Studenti.readStudentById(id, (err, studentet) =>{
    
                if(err){
                    return res.status(500).json("Server error");
                }
                if(studentet.length === 0){
                    return res.status(404).json({message: "Nuk ka te dhena!"});
                }
                
                res.status(200).json(studentet);
            });
        }
            catch(err){
                console.log("Error reading students!", err);
                return res.status(500).json({error: "Server error"})
            }  
    }

    const lexoStudentetByName = async (req, res) =>{
    
        try{
            
            const Emri =  req.query.Emri;

            Studenti.readStudentByName([Emri.trim()], (err, studentet) =>{
    
                if(err){
                    return res.status(500).json("Server error");
                }
                if(studentet.length === 0){
                    return res.status(404).json({message: "Studenti nuk ekziston!"});
                }
                
                res.status(200).json(studentet);
            });
        }
            catch(err){
                console.log("Error reading students!", err);
                return res.status(500).json({error: "Server error"})
            }  
        }
        
    

export default {lexoStudentet, regjistroStudent, fshijStudent, 
    fshijAllStudentet, updatePassword, loginStudenti, 
    patchStudentin, lexoStudentetByID, lexoStudentetByName};