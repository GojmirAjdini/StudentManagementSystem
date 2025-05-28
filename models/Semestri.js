import db from "../database/Database.js";

class Semestri {

    static readAllSemestrat(callback) {
        const sql = `SELECT s.Semestri_ID, s.Afati_Semestrit, s.NrSemestrit, 
        vk.VitiAkademik Viti_Akademik, f.Emri Fakulteti , gj.Viti_Gjenerates, ns.Emri_Nivelit NiveliStudimit 
        FROM Semestri s
        INNER JOIN viti_akademik vk on s.VitiAkademikID = vk.VitiAkademikID
        INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
        INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
        INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID`;

        db.query(sql, (err, results) => {
            if (err) {
                console.log(err);
            }
            callback(results);
        });
    }

    static regjistroSemestrin(Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID, callback) {
        const sql = "INSERT INTO Semestri(Afati_Semestrit, NrSemestrit, VitiAkademikID, GjenerataID) VALUES (?, ?, ?, ?)";
        const values = [Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID];

        db.query(sql, values, (err, results) => {
            if (err) {
                return callback(err);
            }
            
            callback(null, results);
        });
    }

    static lexoVitetAkademike(callback){

        const sql = `SELECT * FROM viti_akademik
        ORDER BY VitiAkademikID DESC`;

        db.query(sql, (err, results)=> {
            if (err) {
                return callback(err, null);
            }
            
            callback(null, results);
        });
    }
}

export default Semestri;