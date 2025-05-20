import db from "../database/Database.js";
import jwt from "jsonwebtoken";

class StafiAdministrativ {
   
    constructor(AdminID, Fakulteti, Email, Password, Emri_Adminit, Mbiemri_Adminit, role, uKrijua){

        this.AdminID = AdminID;
        this.Fakulteti = Fakulteti;
        this.Email = Email;
        this.Password = Password;
        this.Emri_Adminit = Emri_Adminit;
        this.Mbiemri_Adminit = Mbiemri_Adminit;
        this.role = role;
        this.uKrijua = uKrijua;
    }

    static lexoAdminet(callback){

        const sql = `SELECT sa.AdminID, sa.Email, f.Emri AS Fakulteti, sa.Password, 
                    sa.Emri_Adminit, sa.Mbiemri_Adminit, sa.role, sa.uKrijua  
                    FROM StafiAdministrativ sa
                    INNER JOIN Fakulteti f ON f.FakultetiID = sa.FakultetiID`;

        db.query(sql,(err, results) =>{
            if(err){
                return callback(err);
            }
           
            const adminet = results.map((rows) => new StafiAdministrativ(rows.AdminID, rows.Fakulteti,
                rows.Email, rows.Password, rows.Emri_Adminit, rows.Mbiemri_Adminit, rows.role, rows.uKrijua));
            
            callback(null, adminet);
        });
    }

    static regjistroAdmin(FakultetiID, Email, Password, Emri_Adminit, Mbiemri_Adminit,role, callback){

        const sql = `INSERT INTO stafiadministrativ(FakultetiID, Email, Password, 
        Emri_Adminit, Mbiemri_Adminit, role) VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [FakultetiID, Email, Password, Emri_Adminit, Mbiemri_Adminit, role];

        db.query(sql, values,(err, results) =>{
            if(err){
                return callback(err);
            }
            const newAdmin = new StafiAdministrativ(results.insertId, FakultetiID, Email,
                Password, Emri_Adminit, Mbiemri_Adminit, role, results.uKrijua);
           
            callback(null, newAdmin)
        })
    }

    static loginStaff(Email, callback){

        const sqlAdmin = `SELECT FakultetiId, Email, Emri_Adminit, Mbiemri_Adminit, role
        FROM stafiadministrativ
        WHERE Email = ?`;

        const sqlProf = `SELECT FakultetiID, Emri, Mbiemri, Gjinia, 
        Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik
        FROM Profesori
        WHERE Email = ?`;

        db.query(sqlAdmin, Email,(err, results) =>{
            
            if(err){
                return callback(err);
            }
            
            if(results.length > 0){
                return callback(null, results);
            }
            else{
                db.query(sqlProf,Email, (err2,results2) =>{
                    if(err2){
                        return callback(err2);
                    }
                    if(results2.length === 0){
                        return callback(null, "Nuk ka të dhëna!"); 
                
                    }
                    return callback(null, results2);
                });
            }
        })
    }

    static updatePasword(ID, Password, callback){

        const sql = "UPDATE stafiadministrativ SET Password = ? WHERE AdminID = ?";
        const values = [Password, ID];

        db.query(sql, values,(err, results) =>{

            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

    static searchAdminById(id, callback){

        const sql = `SELECT * FROM StafiAdministrativ
         WHERE AdminID = ?`;

        db.query(sql, [id], (err, results) =>{

            if(err){
                return callback(err);
            }

            if(results.length === 0){
                return callback(("Admin nuk u gjet!"));
            }
            
            callback(null, results);
        })
    }

    static searchAdminByName(Emri, callback){

        const sql = `SELECT sa.AdminID, sa.Email, f.Emri AS Fakulteti, sa.Password, 
         sa.Emri_Adminit, sa.Mbiemri_Adminit, sa.role, sa.uKrijua  
         FROM StafiAdministrativ sa
         INNER JOIN Fakulteti f ON f.FakultetiID = sa.FakultetiID
        WHERE sa.Emri_Adminit LIKE CONCAT("%", ?, "%")`;

        db.query(sql, [Emri], (err, results) =>{

            if(err){
                return callback(err);
            }

            const admini =  results.map((row) => new StafiAdministrativ(row.AdminID, row.Fakulteti,
                row.Email, row.Password, row.Emri_Adminit, row.Mbiemri_Adminit, row.role, row.uKrijua));

            callback(null, admini);
        })
    }

    static getAdminByEmail(Email, callback){

        const sql = `SELECT sa.Email, f.Emri Fakulteti, sa.Emri_Adminit, sa.Mbiemri_Adminit, sa.role, sa.uKrijua  
        FROM StafiAdministrativ sa
        INNER JOIN Fakulteti f on f.FakultetiID = sa.FakultetiID
        WHERE Email = ?`;

        db.query(sql, [Email], (err, results) =>{
            if(err){
                return callback(err);
            }
        
            callback(null ,results);
        })
    }

    static deleteAdminById(id, callback){
        
        const sql = "DELETE FROM StafiAdministrativ WHERE AdminID = ?";

        db.query(sql, [id], (err, results) =>{

            if(err){
                return callback(err);
            }

            callback(null, results);
        })
    }

    static deleteAllAdminet(callback){
        const sql = "DELETE FROM StafiAdministrativ";

        db.query(sql, (err, results) =>{

            if(err){
                return callback(err);
            }

            callback(null, results);
        })
    }

    static patchAdminin(id, fushat, values, callback){
        const sql = `UPDATE StafiAdministrativ SET ${fushat.join(', ')} WHERE AdminID = ?`;

        values.push(id);

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }

            callback(null, results);
        })
    }
}


export default StafiAdministrativ;