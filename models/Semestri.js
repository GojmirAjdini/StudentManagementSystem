import db from "../database/Database.js";

class Semestri {

    static readAllSemestrat(callback) {
        const sql = `SELECT * FROM Semestri`;

        db.query(sql, (err, results) => {
            if (err) {
                console.log(err);
            }
            callback(results);
        });
    }

    static regjistroSemestrin(AfatiSemestrit, Nr_Semestrit, callback) {
        const sql = "INSERT INTO Semestri(Afati_Semestrit, Nr_Semestrit) VALUES (?, ?)";
        const values = [AfatiSemestrit, Nr_Semestrit];

        db.query(sql, values, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
}

export default Semestri;