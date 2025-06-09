import db from "../database/Database.js";

class Provimi{

    static lexoProvimetAll(callback){

        const sql = `SELECT * FROM provimi`;

        db.query(sql, (err, results) =>{

        if(err){
            return callback(err);
        }
            
            callback(null, results);
        })
    }

    static caktoProviminByAdmin (LendaID, data_Provimit,PeriudhaID, callback){

        const sql = `INSERT INTO provimi(LendaID, data_mbajtjes_provimit, PeriudhaID) 
        VALUES (?, ?, ?)`;

        db.query(sql,[LendaID, data_Provimit, PeriudhaID],(err, results) =>{

          if(err){
            return callback(err);
        }
            
            callback(null, results);
        })
    }

    static caktoProfesorinPerProviminByAdmin (ProvimiID, ProfesoriID, callback){

        const sql = `INSERT INTO provimi_profesori(ProvimiID, ProfesoriID) 
        VALUES (?, ?)`;

        db.query(sql,[ProvimiID,ProfesoriID],(err, results) =>{

          if(err){
            return callback(err);
        }
            
            callback(null, results);
        })
    }

    static lexoProvimetSipasStudentit(StudentiID, callback){

        const sql = `
        SELECT DISTINCT l.LendaID, l.Kodi_Lendes, l.Emri_Lendes, l.ECTS , 
        s.Afati_Semestrit, s.NrSemestrit, p.ProvimiID
        FROM provimi p 
        INNER JOIN lenda l on p.LendaID = l.LendaID
        INNER JOIN lenda_profesori lp on p.LendaID = lp.LendaID
        INNER JOIN profesori prof on lp.ProfesoriID = prof.ProfesoriID
        INNER JOIN semestri s on s.Semestri_ID = l.SemestriID
        INNER JOIN student_semestri ss on s.Semestri_ID = ss.Semestri_ID
        WHERE ss.StudentiID = ?
        AND NOT EXISTS (
            SELECT *
			FROM student_provimi stdprv
            WHERE stdprv.ProvimiID = p.ProvimiID
            AND stdprv.StudentiID = ss.StudentiID
            )
        ORDER BY s.NrSemestrit`;

        db.query(sql, [StudentiID], (err, results) =>{

        if(err){
            return callback(err);
        }
            
            callback(null, results);
        })
    }

    static paraqitProviminStudent(StudentiID, ProvimiID, ProfesoriID, callback){

        const sql = `INSERT INTO student_provimi(StudentiID, ProvimiID, ProfesoriID) VALUES (?, ?, ?)`;

        const values = [StudentiID, ProvimiID, ProfesoriID];

        db.query(sql,values,(err, results) =>{
            
            if(err){
            return callback(err);
        }   
            callback(null, results);
        })
    }

    static lexoProvimetEParaqituraTeStudentit(StudentiID, callback){

        const sql = `SELECT sp.RegjistrimiProvimitID, l.LendaID, l.Emri_Lendes, l.Kodi_Lendes, 
        s.ID, rp.NOTA, sp.Date_Paraqitjes, rp.Data_Vendosjes_Notes, rp.RezultatiID
        FROM student_provimi sp 
        INNER JOIN studenti s on sp.StudentiID = s.ID
        INNER JOIN provimi prv on sp.ProvimiID = prv.ProvimiID
        INNER JOIN lenda l on prv.LendaID = l.LendaID
        LEFT JOIN rezultateteprovimit rp on sp.RegjistrimiProvimitID = rp.ProvimiRegjistruar
        WHERE sp.StudentiID = ?`;
        
        db.query(sql,[StudentiID],(err, results) =>{
            
            if(err){
            return callback(err);
        }   
            callback(null, results);
        })
    }

    static transkriptaENotave(StudentiID, callback){

        const sql = `SELECT l.*, rp.*, sems.*
    FROM rezultateteprovimit rp
    INNER JOIN student_provimi sp on rp.ProvimiRegjistruar = sp.RegjistrimiProvimitID
    INNER JOIN provimi p on sp.ProvimiID = p.ProvimiID
    INNER JOIN lenda l on p.LendaID = l.LendaID
    INNER JOIN studenti s on sp.StudentiID = s.ID
    INNER JOIN semestri sems on l.SemestriID = sems.Semestri_ID
    WHERE s.ID = ?
       AND rp.NOTA != 'jo prezent' 
       AND rp.NOTA IN ('5', '6', '7', '8', '9', '10')`;

        db.query(sql, [StudentiID],(err, results) =>{
        
        if(err){
            return callback(err);
        }   
            callback(null, results);
        })
    }

    static mesatarjaENotave(StudentiID, callback){

        const sql = `SELECT 
  SUM(CASE rp.NOTA
           WHEN '5' THEN 5
           WHEN '6' THEN 6
           WHEN '7' THEN 7
           WHEN '8' THEN 8
           WHEN '9' THEN 9
           WHEN '10' THEN 10
           ELSE 0
       END) AS gjithsej_notat,
   SUM(l.ECTS) AS gjithsej_kredi,
  AVG(CASE rp.NOTA
           WHEN '5' THEN 5
           WHEN '6' THEN 6
           WHEN '7' THEN 7
           WHEN '8' THEN 8
           WHEN '9' THEN 9
           WHEN '10' THEN 10
           ELSE NULL
       END) AS mesatarja_notave
FROM rezultateteprovimit rp 
INNER JOIN student_provimi sp ON rp.ProvimiRegjistruar = sp.RegjistrimiProvimitID
INNER JOIN provimi p on sp.ProvimiID = p.ProvimiID
INNER JOIN lenda l on p.LendaID = l.LendaID
WHERE sp.StudentiID = ?
  AND rp.NOTA NOT IN ('jo prezent');
`

        db.query(sql, [StudentiID], (err, results) =>{

            if(err){
            return callback(err);
        }   
            callback(null, results);
        })
    }

    static lexoProfesoretSipasProvimit(ProvimiID, callback){
    
    const sql = `SELECT * 
        FROM provimi p 
        INNER JOIN lenda_profesori lp on p.LendaID = lp.LendaID
        INNER JOIN profesori prof on lp.ProfesoriID = prof.ProfesoriID
        WHERE p.ProvimiID = ?`;  
    
    db.query(sql, [ProvimiID],(err, results) =>{
        
    if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

    static anuloParaqitjenEProvimit(RegjistrimiProvimitID, callback) {
        
        const sql = `DELETE FROM student_provimi WHERE RegjistrimiProvimitID = ?`;

        db.query(sql, [RegjistrimiProvimitID], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
    }
     
    static refuzoNoten(RezultatiID, callback) {
        
        const sql = `DELETE FROM rezultateteprovimit WHERE RezultatiID = ?`;

        db.query(sql, [RezultatiID], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
    }

    static lexoPeriudhatEProvimeve(callback){

        const sql = `SELECT * 
FROM periudha_regjistrimit_te_provimeve prp
INNER JOIN viti_akademik vk on prp.VitiAkademikID = vk.VitiAkademikID`;

    db.query(sql, (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static caktoNotenEProvimit(Nota, ProvimiID, callback){

    const sql = `INSERT INTO rezultateteprovimit(NOTA, ProvimiRegjistruar)
    VALUES (?, ?)`;

    db.query(sql, [Nota, ProvimiID], (err, results) =>{

    if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}
}
export default Provimi;