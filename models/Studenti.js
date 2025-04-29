
import db from "../database/Database.js";

class Studenti{

    static readAll(callback){

        const sql = `SELECT s.ID, s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
    s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, f.Emri Drejtimi, 
    f.Niveli, s.Statusi, s.StudentiID, s.Gjenerata, s.uKrijua
    FROM Studenti s INNER JOIN fakulteti f on f.FakultetiID = s.FakultetiID`;

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

    static updatePassword(ID, Password,callback){

        const sql = "UPDATE Studenti s SET s.Password = ? WHERE ID = ?";
        const values = [Password, ID];

        db.query(sql, values,(err, results) =>{
            if(err){
                return callback(err, null);
            }
            callback(null, results);
        })

    }

    static loginStudent (EmailStudentor, callback) {

        const sql = `SELECT s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
    s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, f.Emri Drejtimi, 
    f.Niveli, s.Statusi, s.StudentiID, s.Gjenerata
    FROM Studenti s INNER JOIN fakulteti f on f.FakultetiID = s.FakultetiID 
    WHERE s.EmailStudentor = ?`;

        db.query(sql, EmailStudentor, (err, results) =>{

            if(err){
                return callback(err);
            }
            callback(null, results);
        })
    }

    static patchStudenti (ID, fushat, values, callback){

            const sql =`UPDATE Studenti SET ${fushat.join(', ')}  WHERE ID = ?`;

            values.push(ID);

            db.query(sql, values, (err, results) =>{

                if(err){
                    return callback(err, null);
                }   
            callback(null,results);    
            })
        }

    static readStudentById(ID, callback){

    const sql = `SELECT s.ID, s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, s.FakultetiID, 
f.Niveli, s.Statusi, s.StudentiID, s.Gjenerata
FROM Studenti s INNER JOIN fakulteti f on f.FakultetiID = s.FakultetiID
WHERE ID = ?`;

    db.query(sql, [ID], (err, results) =>{
     
        if(err){
           return callback(err, null);
        }
        console.log(results);
        
        callback(null, results);
    })

}
}
export default Studenti;