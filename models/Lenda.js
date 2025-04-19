import db from "../database/Database.js";

class Lenda{

    static readAllLendet(callback){

        const sql = "SELECT * FROM Lenda";

        db.query(sql, (err, results) =>{

            if(err){
                console.log(err);
            }
            console.log(results);
                callback(results);
            
        }
        )
    }
}
export default Lenda;