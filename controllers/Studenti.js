import Studenti from "../models/Studenti.js";
import bcrypt from "bcrypt";
import StudentCredentials from "./StudentCredentials.js";
import db from "../database/Database.js";

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

        Studenti.createStudent( Emri, Mbiemri, Gjinia, emailstudentor, EmailPrivat, 
            hashedPassword, Vendlindja, Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi, studentiID, gjenerata, (err, results) =>{

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
        const {oldPassword, newPassword } = req.body;

        const sql = "SELECT Password from Studenti WHERE ID = ?";

        const [oldPasswordCheck] = await db.promise().query(sql, [ID]);

        const storedPassword = oldPasswordCheck[0].Password;

        let check = await bcrypt.compare(oldPassword, storedPassword);
        if(!check){
            return res.status(400).json({message: "Ju lutem kontrolloni passwordin tuaj te vjeter!"});

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


export default {lexoStudentet, regjistroStudent, fshijStudent, fshijAllStudentet, updatePassword};