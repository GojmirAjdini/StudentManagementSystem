import db from "../database/Database.js";

class Lenda{

    static readAllLendet(callback){

        const sql = "SELECT * FROM Lenda";

        db.query(sql, (err, results) =>{

            if(err){
                console.log(err);
            }
            console.log(results);
                callback(results);
            
        }
        )
    }

    static regjistroLenden(FakultetiID, Emri_Lendes, ECTS, semestri, callback){

        const sql = "INSERT INTO Lenda(FakultetiID, Emri_Lendes, ECTS, semestri) VALUES (?, ?, ?, ?)";
        const values = [FakultetiID, Emri_Lendes, ECTS, semestri];

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
}
export default Lenda;