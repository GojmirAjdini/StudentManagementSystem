import db from "../database/Database.js";

class Profesori {

    static lexoProfesoret(callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, p.NrTel, GROUP_CONCAT(DISTINCT f.Emri SEPARATOR ', ') Fakulteti, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, 					p.Titulli_Akademik
        FROM profesori p 
        LEFT JOIN profesori_fakulteti pf on p.ProfesoriID = pf.ProfesoriID
        LEFT JOIN fakulteti f on pf.FakultetiID = f.FakultetiID
        GROUP BY p.ProfesoriID`;

        db.query(sql,(err, results)=>{
            if(err){
                return callback(err,null);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static regjistroProfesorin(Emri, Mbiemri, Gjinia, Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi,Titulli_Akademik, callback){

        const sql = `INSERT INTO profesori
        (Emri, Mbiemri, Gjinia, Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [Emri, Mbiemri, Gjinia, Email, 
            NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik];
       
        db.query(sql, values,(err, results) =>{

            if(err){
                return callback(err, null);
            }
            console.log(results.affectedRows);
            callback(null, results);
        })
        }

    static fshijProfesorinSipasId(ProfesoriID, callback){

        const sql = "DELETE FROM profesori WHERE ProfesoriID = ?";
        const id = ProfesoriID;

        db.query(sql, [id],(err, results) =>{
            if(err){
                return callback(err, null);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static loginProfessori(Email, callback){

        const sql = `SELECT Emri, Mbiemri, Gjinia, 
        Email, NrTel, Password, EmailPrivat, Data_Punesimit, Statusi, Titulli_Akademik
        FROM profesori p
        WHERE p.Email = ?`;

        db.query(sql, Email, (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results.length);

            callback(null, results);
        })
    }
    static updatePassword(ID, Password, callback){

        const sql = "UPDATE profesori p SET p.Password = ? WHERE ProfesoriID = ?";
        const values = [Password, ID];

        db.query(sql, values, (err, results) =>{
            if(err){
                return callback(err);
            }

            callback(null, results);
        })
    }

    static lexoProfesorinSipasId(ProfesoriID, callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, p.NrTel, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, p.Titulli_Akademik  
        FROM Profesori p 

        WHERE p.ProfesoriID = ?`;

        db.query(sql, [ProfesoriID], (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results.length);

            callback(null, results);
        })
    }

    static patchProfesori(ProfesoriID, fushat, values, callback){

        const sql = `UPDATE profesori SET ${fushat.join(', ')} WHERE ProfesoriID = ?`;

        values.push(ProfesoriID);

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            console.log(results.affectedRows);
            
            callback(null, results);

        })
    }

    static caktoProfiLenda (LendaID, ProfesoriID, callback){

        const sql = "INSERT INTO lenda_profesori(LendaID, ProfesoriID) VALUES (?, ?)";

        const values = [LendaID, ProfesoriID];

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

    static searchProfesoriByName (Emri, callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, f.Emri Fakulteti, p.NrTel, p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, p.Titulli_Akademik
        FROM profesori p 
       
        WHERE p.Emri LIKE CONCAT("%", ? ,"%")`;

        db.query(sql, [Emri], (err, results) =>{

            if(err){
                return callback(err);
            }
            
            callback(null, results);
        })
    }

    static lexoProfesoretLendet(callback){
        
        const sql = `SELECT lp.LendaID, lp.ProfesoriID, f.Emri Fakulteti, p.Emri, p.Mbiemri, p.Gjinia, p.Email, 
        p.Titulli_Akademik, l.Emri_Lendes, l.Kodi_Lendes, l.ECTS, s.NrSemestrit, vk.VitiAkademik 
                FROM lenda_profesori lp
                INNER JOIN profesori p on p.ProfesoriID = lp.ProfesoriID
                INNER JOIN lenda l on l.LendaID = lp.LendaID
                INNER JOIN semestri s on s.Semestri_ID = l.SemestriID
                INNER JOIN viti_akademik vk on s.VitiAkademikID = vk.VitiAkademikID
                INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
                INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID`;

        db.query(sql, (err, results)=>{
            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static lexoLendetPerProfesorinSipasEmail(email, callback){
        
        const sql = `SELECT lp.LendaID, lp.ProfesoriID, f.Emri Fakulteti, p.Emri, p.Mbiemri, p.Gjinia, p.Email, 
        p.Titulli_Akademik, l.Emri_Lendes, l.Kodi_Lendes, l.ECTS, s.NrSemestrit, vk.VitiAkademik 
                FROM lenda_profesori lp
                INNER JOIN profesori p on p.ProfesoriID = lp.ProfesoriID
                INNER JOIN lenda l on l.LendaID = lp.LendaID
                INNER JOIN semestri s on s.Semestri_ID = l.SemestriID
                INNER JOIN viti_akademik vk on s.VitiAkademikID = vk.VitiAkademikID
                INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
                INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
                WHERE p.Email = ?`;

        db.query(sql, [email], (err, results)=>{
            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
    }
    
    static deleteProfesoretLendet(LendaID, ProfesoriID, callback){
        const sql = "DELETE FROM lenda_profesori WHERE LendaID = ? AND ProfesoriID = ?";
        const values = [LendaID, ProfesoriID];

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static lexoLendetSipasProfesorit(ProfesoriID, callback){

        const sql =`SELECT l.*
            FROM lenda_profesori lp
            INNER JOIN lenda l on l.LendaID = lp.LendaID
            WHERE lp.ProfesoriID = ?`

        db.query(sql, [ProfesoriID], (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
        }

        static lexoProfesorinSipasEmail(Email, callback){

        const sql = `SELECT p.ProfesoriID, p.Emri, p.Mbiemri, p.Gjinia, 
        p.Email, f.Emri Fakulteti, p.NrTel, 
        p.EmailPrivat, p.Data_Punesimit, p.uKrijua, p.Statusi, p.Titulli_Akademik  
        FROM profesori p 
        LEFT JOIN profesori_fakulteti pf on p.ProfesoriID = pf.ProfesoriID
        LEFT JOIN fakulteti f on pf.FakultetiID = f.FakultetiID
        WHERE p.Email = ?`;

        db.query(sql, [Email], (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results.length);

            callback(null, results);
        })
    }

    static caktoFakultetinProfesori(FakultetiID, ProfesoriID, callback){

        const sql = `INSERT INTO profesori_fakulteti(FakultetiID, ProfesoriID) 
        VALUES (?, ?)`;

        const values = [FakultetiID, ProfesoriID];

        db.query(sql,values, (err, results) =>{

            if(err){
                return callback(err);
            }

            callback(null, results);
        })
    }

    static lexoFakultetetSipasProfesorit(ProfesoriID, callback){

        const sql =`SELECT f.*
            FROM profesori_fakulteti pf
            INNER JOIN fakulteti f on pf.FakultetiID = f.FakultetiID
            WHERE pf.ProfesoriID = ?`

        db.query(sql, [ProfesoriID], (err, results) =>{
            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
        }

        static lexoProfesoretFakultetet(callback){

            const sql =`SELECT pf.FakultetiID ,pf.ProfesoriID, 
            p.Emri EmriProfit, p.Mbiemri, p.Gjinia, p.Email, p.Titulli_Akademik, 
            ns.Emri_Nivelit  NiveliStudimit, f.*
            FROM profesori_fakulteti pf
            INNER JOIN fakulteti f on pf.FakultetiID = f.FakultetiID
            INNER JOIN profesori p on pf.ProfesoriID = p.ProfesoriID
            INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID`;
         
            db.query(sql, (err, results)=>{
            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static deleteProfesoretFakultetet(FakultetiID, ProfesoriID, callback){
        const sql = "DELETE FROM profesori_fakulteti WHERE FakultetiID = ? AND ProfesoriID = ?";
        const values = [FakultetiID, ProfesoriID];

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            console.log(results);
            callback(null, results);
        })
    }

    static lexoStudentetEProfit(ProfesoriID, callback) {

        const sql =`SELECT sp.RegjistrimiProvimitID ProvimiID , s.ID, s.Emri, s.Mbiemri, s.EmailStudentor, 
        l.LendaID, l.Emri_Lendes, l.Kodi_Lendes, p.ProfesoriID 
        FROM student_provimi sp 
        INNER JOIN studenti s on sp.StudentiID = s.ID
        INNER JOIN provimi prv on sp.ProvimiID = prv.ProvimiID
        INNER JOIN periudha_regjistrimit_te_provimeve prtp on prv.PeriudhaID = prtp.PeriudhaID
        INNER JOIN lenda l on prv.LendaID = l.LendaID
        INNER JOIN profesori p on sp.ProfesoriID = p.ProfesoriID
        WHERE p.ProfesoriID = ?
        AND NOT EXISTS (
            SELECT *
			FROM rezultateteprovimit rp
            WHERE rp.ProvimiRegjistruar = sp.RegjistrimiProvimitID
            )
       	AND CURDATE() <= prtp.Data_Perfundimit_Notave`;
    
        db.query(sql,ProfesoriID,(err, results) =>{

            if(err){
                return callback(err);
            }
        
            return callback(null, results);
        })
    }
}

export default Profesori;