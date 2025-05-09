import db from "../database/Database.js";

class Profesori {

    static lexoProfesoret(callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, f.Emri Fakulteti, p.NrTel, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, p.Titulli_Akademik
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

    static regjistroProfesorin(FakultetiID, Emri, Mbiemri, Gjinia, Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi,Titulli_Akademik, callback){

        const sql = `INSERT INTO Profesori
        (FakultetiID, Emri, Mbiemri, Gjinia, Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [FakultetiID, Emri, Mbiemri, Gjinia, Email, 
            NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik];
       
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
        Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik
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

    static lexoProfesorinSipasId(ProfesoriID, callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, p.FakultetiID , p.NrTel, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, p.Titulli_Akademik  
        FROM Profesori p 
        INNER JOIN Fakulteti f on f.FakultetiID = p.FakultetiID
        WHERE p.ProfesoriID = ?`;

        db.query(sql, [ProfesoriID], (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results.length);

            callback(null, results);
        })
    }

    static patchProfesori(ProfesoriID, fushat, values, callback){

        const sql = `UPDATE Profesori SET ${fushat.join(', ')} WHERE ProfesoriID = ?`;

        values.push(ProfesoriID);

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            console.log(results.affectedRows);
            
            callback(null, results);

        })
    }

    static caktoProfiLenda (LendaID, ProfesoriID, callback){

        const sql = "INSERT INTO lenda_profesori(LendaID, ProfesoriID) VALUES (?, ?)";

        const values = [LendaID, ProfesoriID];

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

    static searchProfesoriByName (Emri, callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, f.Emri Fakulteti, p.NrTel, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, p.Titulli_Akademik
        FROM Profesori p 
        INNER JOIN Fakulteti f on f.FakultetiID = p.FakultetiID
        WHERE p.Emri LIKE CONCAT("%", ? ,"%")`;

        db.query(sql, [Emri], (err, results) =>{

            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }
}

export default Profesori;