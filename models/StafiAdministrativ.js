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

        const sql = `SELECT FakultetiId, Email, Password, Emri_Adminit, Mbiemri_Adminit 
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
}


export default StafiAdministrativ;