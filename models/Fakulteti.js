import db from "../database/Database.js";

class Fakulteti{

    constructor(FakultetiID, Emri, Niveli, Lokacioni, Kodi_Fakultetit){
        
        this.FakultetiID = FakultetiID;
        this.Emri = Emri;
        this.Niveli = Niveli;
        this.Lokacioni = Lokacioni;
        this.Kodi_Fakultetit = Kodi_Fakultetit;
    }

    static readFakultetet(callback){


        const sql = "SELECT * FROM Fakulteti";

         db.query(sql, (err, results) =>{

            if(err){
                return callback(err.cause);
            }
            console.log(results);
            
            const fakultetet = results.map((row) => new Fakulteti(row.FakultetiID, row.Emri, row.Niveli, row.Lokacioni, row.Kodi_Fakultetit));

            callback(fakultetet);
        });
    }

    static regjistroFakultet(Emri, Niveli, Lokacioni, Kodi_Fakultetit, callback){

        const sql = "INSERT INTO Fakulteti(Emri, Niveli, Lokacioni, Kodi_Fakultetit) VALUES (?, ?, ?, ?)";
        const values = [Emri, Niveli, Lokacioni, Kodi_Fakultetit];

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }

            const newFakulteti = new Fakulteti(results.insertId, Emri, Niveli, Lokacioni, Kodi_Fakultetit);
            callback(null, newFakulteti);
        })
    }

    static fshijFakultet(id, callback){

        const sql = "DELETE FROM Fakulteti WHERE FakultetiID = ?";

        db.query(sql,[id], (err, results)=>{

            if(err){
                return callback(err);
            }
            callback(err, results);
        });
    }

    static perditesoFakultetin(fakulteti, callback){

        const sql = `UPDATE Fakulteti SET Emri = ?, Niveli = ?, 
        Lokacioni = ?, Kodi_Fakultetit = ? WHERE FakultetiID = ?`;
        
        const values = [fakulteti.Emri, fakulteti.Niveli, 
            fakulteti.Lokacioni, fakulteti.Kodi_Fakultetit, fakulteti.FakultetiID];

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err, null);
            }

            callback(null, results);
        })
    }
}
export default Fakulteti;