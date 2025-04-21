import db from "../database/Database.js";

class Profesori {

    static lexoProfesoret(callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, f.Emri Fakulteti, p.NrTel, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi  
        FROM Profesori p 
        INNER JOIN Fakulteti f on f.FakultetiID = p.FakultetiID`;

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

    static fshijProfesorinSipasId(ProfesoriID, callback){

        const sql = "DELETE FROM Profesori WHERE ProfesoriID = ?";
        const id = ProfesoriID;

        db.query(sql, [id],(err, results) =>{
            if(err){
                return callback(err, null);
            }
            console.log(results);
            callback(null, results);
        })
    }
}

export default Profesori;