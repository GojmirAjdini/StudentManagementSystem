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

    static loginProfessori(Email, callback){

        const sql = `SELECT FakultetiID, Emri, Mbiemri, Gjinia, 
        Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi
        FROM Profesori
        WHERE Email = ?`;

        db.query(sql, Email, (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results.length);

            callback(null, results);
        })
    }
    static updatePassword(ID, Password, callback){

        const sql = "UPDATE Profesori p SET p.Password = ? WHERE ProfesoriID = ?";
        const values = [Password, ID];

        db.query(sql, values, (err, results) =>{
            if(err){
                return callback(err);
            }

            callback(null, results);
        })
    }
}

export default Profesori;