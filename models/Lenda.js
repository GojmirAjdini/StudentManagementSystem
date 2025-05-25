import db from "../database/Database.js";

class Lenda{

    static readAllLendet(callback){

        const sql = `SELECT l.LendaID, f.Emri Fakulteti, l.Emri_Lendes, 
        l.ECTS, l.Kodi_Lendes, l.uKrijua, s.NrSemestrit Semestri FROM Lenda l 
        INNER JOIN Semestri s ON l.SemestriID = s.Semestri_ID
        INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
        INNER JOIN Fakulteti f on gj.FakultetiID = f.FakultetiID
        `;

        db.query(sql, (err, results) =>{

            if(err){
                console.log(err);
            }
            console.log(results);
                callback(results);
            
        }
        )
    }

    static regjistroLenden(Emri_Lendes, ECTS, Kodi_Lendes, SemestriID, callback){

        const sql = "INSERT INTO Lenda(Emri_Lendes, ECTS, Kodi_Lendes, SemestriID) VALUES (?, ?, ?, ?)";
        const values = [Emri_Lendes, ECTS, Kodi_Lendes, SemestriID];

        db.query(sql,values, (err, results) =>{

            if(err){
                return callback(err, null);
            }

            callback(null, results);
        })
    }

    static deleteLendenById(LendaID, callback){

        const sql = "DELETE FROM Lenda WHERE LendaID = ?";
        const id = LendaID;

        db.query(sql, [id], (err, results) =>{

            if(err){
                console.error(err);
                return callback("Gabim sintaksor ne query!", null);
            }
            callback(null, results);
        })
    }

    static readLendaById(LendaID, callback){

        const sql = "SELECT * FROM Lenda WHERE LendaID = ?";
        const id = LendaID;

        db.query(sql, [id], (err, results) =>{

            if(err){
                console.error(err);
                return callback("Gabim sintaksor ne query!", null);
            }
            callback(null, results);
        })
    }

    static patchLenda(LendaID, fushat, values, callback){

        const sql = `UPDATE Lenda SET ${fushat.join(', ')} WHERE LendaID = ?`;

        values.push(LendaID);
        
        db.query(sql, values, (err, results) =>{

            if(err){
                console.error(err);
                return callback("Gabim sintaksor ne query!", null);
            }
            callback(null, results);
        })

    }

    static lexoLendenByName(Emri_Lendes, callback){

        const sql = `SELECT l.LendaID, f.Emri Fakulteti, l.Emri_Lendes, 
        l.ECTS, l.Kodi_Lendes, l.uKrijua, s.NrSemestrit Semestri FROM Lenda l 
        INNER JOIN Fakulteti f ON l.FakultetiID = f.FakultetiID
        INNER JOIN Semestri s ON l.SemestriID = s.Semestri_ID WHERE Emri_Lendes LIKE CONCAT("%", ? , "%")`;

        db.query(sql, [Emri_Lendes], (err, results) =>{

            if(err){
                return callback(err);
            }
        
            callback(null, results);
        })
    }
}
export default Lenda;