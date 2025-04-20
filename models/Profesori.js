import db from "../database/Database.js";

class Profesori {

    static lexoProfesoret(callback){

        const sql = "SELECT * FROM Profesori";

        db.query(sql,(err, results)=>{
            if(err){
                return callback(err,null);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static regjistroProfesorin(FakultetiID, Emri, Mbiemri, Gjinia, Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, callback){

        const sql = `INSERT INTO Profesori
        (FakultetiID, Emri, Mbiemri, Gjinia, Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [FakultetiID, Emri, Mbiemri, Gjinia, Email, 
            NrTel, Password, EmailPrivat, Data_Punesimit, Statusi];
       
        db.query(sql, values,(err, results) =>{

            if(err){
                return callback(err, null);
            }
            console.log(results.affectedRows);
            callback(null, results);
        })
        }
}

export default Profesori;