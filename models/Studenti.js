
import db from "../database/Database.js";

class Studenti{

    static readAll(callback){

        const sql = "SELECT * FROM studenti";

        db.query(sql,(err, results) =>{
         
            if(err){
               return callback(err, null);
            }
            console.log(results);
            
            callback(null, results);
        })

    }

    static createStudent(Emri, Mbiemri, Gjinia, EmailStudentor, EmailPrivat, Password, 
        Vendlindja, Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi, StudentiID,Gjenerata, callback){

        const sql = `INSERT INTO studenti(Emri, Mbiemri, Gjinia, EmailStudentor,EmailPrivat, Password, 
        Vendlindja,Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi, StudentiID, Gjenerata) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [Emri, Mbiemri, Gjinia, EmailStudentor, EmailPrivat, Password, Vendlindja, 
            Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi, StudentiID, Gjenerata];

        if (!EmailStudentor || !Password) {
            return callback("EmailStudentor dhe Password nuk duhet të jenë bosh.");
          }

        db.query(sql, values, (err, results) =>{
            if(err){
                console.error(err);
                return;
            }

            console.log(results);
            callback(null, results);
        })
    }

    static deleteById(id, callback){

        const sql = "DELETE FROM Studenti WHERE ID = ?";

        db.query(sql,[id], (err, results) =>{

            if(err){
                console.error(err);
                return callback(err, null);
            }
        callback(null, results);
    });
}
    static deleteAll(callback){

        const sql = "DELETE FROM studenti";

        db.query(sql, (err, results) =>{

            if(err){
                return callback(err, null);
            }
            callback(null, results);
        })
    }
}

export default Studenti;