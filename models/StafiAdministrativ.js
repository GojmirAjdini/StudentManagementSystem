import db from "../database/Database.js";

class StafiAdministrativ {
   
    constructor(AdminID, FakultetiID, Email, Password, Emri_Adminit, Mbiemri_Adminit){

        this.AdminID = AdminID;
        this.FakultetiID = FakultetiID;
        this.Email = Email;
        this.Password = Password;
        this.Emri_Adminit = Emri_Adminit;
        this.Mbiemri_Adminit = Mbiemri_Adminit;
    }

    static lexoAdminet(callback){

        const sql = "SELECT * FROM stafiadministrativ";

        db.query(sql,(err, results) =>{
            if(err){
                return callback(err);
            }
           
            const adminet = results.map((rows) => new StafiAdministrativ(rows.AdminID, rows.FakultetiID,
                rows.Email, rows.Password, rows.Emri_Adminit, rows.Mbiemri_Adminit));
            
            callback(null, adminet);
        });
    }

    static regjistroAdmin(FakultetiID, Email, Password, Emri_Adminit, Mbiemri_Adminit, callback){

        const sql = `INSERT INTO stafiadministrativ(FakultetiID, Email, Password, 
        Emri_Adminit, Mbiemri_Adminit) VALUES (?, ?, ?, ?, ?)`;

        const values = [FakultetiID, Email, Password, Emri_Adminit, Mbiemri_Adminit];

        db.query(sql, values,(err, results) =>{
            if(err){
                return callback(err);
            }
            const newAdmin = new StafiAdministrativ(results.insertId, FakultetiID, Email,
                Password, Emri_Adminit, Mbiemri_Adminit)
           
            callback(null, newAdmin)
        })
    }

    static loginAdmin(Email, callback){

        const sql = `SELECT FakultetiId, Email, Emri_Adminit, Mbiemri_Adminit 
        FROM stafiadministrativ
        WHERE Email = ?`;

        db.query(sql, Email,(err, results) =>{
            
            if(err){
                return callback(err);
            }
            console.log(results.length);
            if(results.length === 0){
                return callback(null, "Nuk ka te dhena!");
            }
        
        callback(null, results);
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
                return callback(new Error("Admin nuk u gjet!"));
            }

            const admini = new StafiAdministrativ(results[0].AdminID, results[0].FakultetiID, results[0].Email, results[0].Password, results[0].Emri_Adminit, results[0].Mbiemri_Adminit);
            callback(null, admini);
        })
    }

    static searchAdminByName(Emri, callback){

        const sql = `SELECT * FROM StafiAdministrativ
         WHERE Emri_Adminit = ?`;

        db.query(sql, [Emri], (err, results) =>{

            if(err){
                return callback(err);
            }

            if(results.length === 0){
                return callback(new Error("Admin nuk u gjet!"));
            }

            const admini = new StafiAdministrativ(results[0].AdminID, results[0].FakultetiID, results[0].Email, results[0].Password, results[0].Emri_Adminit, results[0].Mbiemri_Adminit);
            callback(null, admini);
        })
    }
}


export default StafiAdministrativ;