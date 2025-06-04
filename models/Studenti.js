
import db from "../database/Database.js";

class Studenti{

    static readAll(callback){

        const sql = `SELECT s.ID, s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
    s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, f.Emri Drejtimi, 
    ns.Emri_Nivelit Niveli, s.Statusi, s.StudentiID, s.Gjenerata, s.GjenerataID, gj.Viti_Gjenerates, s.uKrijua
    FROM studenti s 
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
    INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID`;

        db.query(sql,(err, results) =>{
         
            if(err){
               return callback(err, null);
            }
            console.log(results);
            
            callback(null, results);
        })

    }

    static createStudent(Emri, Mbiemri, Gjinia, EmailStudentor, EmailPrivat, Password, 
        Vendlindja, Data_Lindjes, Adresa, Nr_Tel , Statusi, StudentiID,Gjenerata, GjenerataID, callback){

        const sql = `INSERT INTO studenti(Emri, Mbiemri, Gjinia, EmailStudentor,EmailPrivat, Password, 
        Vendlindja,Data_Lindjes, Adresa, Nr_Tel , Statusi, StudentiID, Gjenerata, GjenerataID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
       
        const values = [Emri, Mbiemri, Gjinia, EmailStudentor, EmailPrivat, Password, Vendlindja, 
            Data_Lindjes, Adresa, Nr_Tel, Statusi, StudentiID, Gjenerata, GjenerataID];

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

        const sql = "DELETE FROM studenti WHERE ID = ?";

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

        const sql = "UPDATE studenti s SET s.Password = ? WHERE ID = ?";
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
    ns.Emri_Nivelit Niveli, s.Statusi, s.StudentiID, s.Gjenerata, s.GjenerataID, gj.Viti_Gjenerates, s.uKrijua
    FROM studenti s 
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
    INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID

    WHERE s.EmailStudentor = ?`;

        db.query(sql, EmailStudentor, (err, results) =>{

            if(err){
                return callback(err);
            }
            callback(null, results);
        })
    }

    static patchStudenti (ID, fushat, values, callback){

            const sql =`UPDATE studenti SET ${fushat.join(', ')}  WHERE ID = ?`;

            values.push(ID);

            db.query(sql, values, (err, results) =>{

                if(err){
                    return callback(err, null);
                }   
            callback(null, results);    
            })
        }

    static readStudentById(ID, callback){

    const sql = `SELECT s.ID, s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
    s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, f.Emri Drejtimi, 
    f.Niveli, s.Statusi, s.StudentiID, s.Gjenerata, s.GjenerataID, gj.Viti_Gjenerates, s.uKrijua
    FROM studenti s 
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = gj.FakultetiID
    WHERE s.ID = ?`;

    db.query(sql, [ID], (err, results) =>{
     
        if(err){
           return callback(err, null);
        }
        console.log(results);
        
        callback(null, results);
    })
}

static readStudentByName(Emri, callback){

    const sql = `SELECT s.ID, s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
    s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, f.Emri Drejtimi, 
    f.Niveli, s.Statusi, s.StudentiID, s.Gjenerata, s.GjenerataID, gj.Viti_Gjenerates, s.uKrijua
    FROM studenti s 
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = gj.FakultetiID
    WHERE s.Emri LIKE CONCAT("%", ? , "%")`;

    db.query(sql, [Emri], (err, results) =>{
     
        if(err){
           return callback(err, null);
        }
        console.log(results);
        
        callback(null, results);
    })
}
    static readStudentByEmail(Email, callback){

        const sql = `SELECT s.ID, s.Emri, s.Mbiemri, s.Gjinia, s.EmailStudentor, s.EmailPrivat,
    s.Vendlindja, s.Data_Lindjes, s.Adresa, s.Nr_Tel, f.Emri Drejtimi, 
    ns.Emri_Nivelit Niveli, s.Statusi, s.StudentiID, s.Gjenerata, s.GjenerataID, gj.Viti_Gjenerates, s.uKrijua
    FROM studenti s 
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
    INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID
    WHERE s.EmailStudentor = ?`;

        db.query(sql, Email, (err, results) =>{
         
            if(err){
               return callback(err, null);
            }
            console.log(results);
            
            callback(null, results);
        })

    }

     static regjistroSemestrinPerStudent(StudentiID, Semestri_ID, callback) {

        const sql = "INSERT INTO student_semestri(StudentiID, Semestri_ID) VALUES (?, ?)";
        const values = [StudentiID, Semestri_ID];

        db.query(sql, values, (err, results) => {
            if (err) {
                return callback(err);
            }
            
            callback(null, results);
        });
}
    static semestratSipasFakultetit(fakultetiID, callback){

        const sql = `SELECT s.Semestri_ID, s.Afati_Semestrit, s.NrSemestrit, 
        vk.VitiAkademik Viti_Akademik, f.Emri Fakulteti , gj.Viti_Gjenerates, ns.Emri_Nivelit NiveliStudimit 
        FROM semestri s
        INNER JOIN viti_akademik vk on s.VitiAkademikID = vk.VitiAkademikID
        INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
        INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
        INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID
        WHERE f.FakultetiID = ?`;

        db.query(sql, [fakultetiID],(err, results) =>{
            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

    static listaSemestraveTeRegjistruar(email, callback){

        const sql = `SELECT ss.ID, sms.Afati_Semestrit, vk.VitiAkademik,  
        sms.NrSemestrit, ss.Data_Regjistrimit uKrijua, ns.Emri_Nivelit Niveli
        FROM student_semestri ss 
        INNER JOIN studenti std on ss.StudentiID = std.ID
        INNER JOIN semestri sms on ss.Semestri_ID = sms.Semestri_ID
        INNER JOIN viti_akademik vk on sms.VitiAkademikID = vk.VitiAkademikID
        INNER JOIN gjenerata gj on sms.GjenerataID = gj.GjenerataID
        INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
        INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID
        WHERE std.EmailStudentor = ?`;

        db.query(sql, [email], (err, results) =>{
             
            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

    static çregjistroSemestrin(ID, callback){

        const sql = `DELETE FROM student_semestri WHERE ID = ?`;

        db.query(sql, [ID], (err, results) =>{

        if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

}
export default Studenti;