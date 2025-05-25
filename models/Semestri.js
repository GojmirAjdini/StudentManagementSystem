import db from "../database/Database.js";

class Semestri {

    static readAllSemestrat(callback) {
        const sql = `SELECT s.Semestri_ID, s.Afati_Semestrit, s.NrSemestrit, 
        gj.viti_akademik, f.Emri Fakulteti, gj.viti_akademik Viti_Akademik, ns.Emri_Nivelit Niveli
        FROM Semestri s
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

    static regjistroSemestrin(AfatiSemestrit, Nr_Semestrit, GjenerataID, callback) {
        const sql = "INSERT INTO Semestri(Afati_Semestrit, Nr_Semestrit, GjenerataID) VALUES (?, ?, ?)";
        const values = [AfatiSemestrit, Nr_Semestrit, GjenerataID];

        db.query(sql, values, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
}

export default Semestri;