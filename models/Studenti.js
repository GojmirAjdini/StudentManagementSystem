
import db from "../database/Database.js";

class Studenti{

    static readAll(callback){

        const sql = "SELECT * FROM studenti";

        db.query(sql,(err, results) =>{
         
            if(err){
               throw err;
            }
            console.log(results);
            
            callback(results);
        })

    }
    
}

export default Studenti;