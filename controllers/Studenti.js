import Studenti from "../models/Studenti.js";
import bcrypt from "bcrypt";
import StudentCredentials from "./StudentCredentials.js";

const lexoStudentet = async (req, res) =>{

        Studenti.readAll((err, studentet) =>{

        try{
            res.json(studentet);
        }
        catch(err){
            console.log("Error reading students!", err);
            return res.status(500).json({error: "Server error"})
        }
        
    } )
}


const regjistroStudent = async (req, res) =>{

    const salts = 10;

    try{   
        
        const {Emri, Mbiemri, Gjinia, EmailPrivat, Vendlindja, 
            Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi} = req.body;

        const emailstudentor = StudentCredentials.randomEmail(Emri, Mbiemri);
        const password = StudentCredentials.randomPassword(Emri, Mbiemri);

        const hashedPassword = await bcrypt.hash(password, salts);

        Studenti.createStudent( Emri, Mbiemri, Gjinia, emailstudentor, EmailPrivat, 
            hashedPassword, Vendlindja, Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi, (err, results) =>{

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
        const id = req.params.StudentiID;

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


export default {lexoStudentet, regjistroStudent, fshijStudent};