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

    static lexoProvimetSipasAfatit(callback){

        const sql = `SELECT p.ProvimiID, l.Emri_Lendes, l.ECTS, l.Kodi_Lendes, p.data_mbajtjes_provimit, 
        f.Emri, ns.Emri_Nivelit Niveli, s.NrSemestrit Semestri
    FROM provimi p
    INNER JOIN lenda l on p.LendaID = l.LendaID
    INNER JOIN semestri s on l.SemestriID = s.Semestri_ID
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
    INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID
    INNER JOIN periudha_regjistrimit_te_provimeve pr on p.PeriudhaID = pr.PeriudhaID
    WHERE pr.PeriudhaID = (
        SELECT pr.PeriudhaID
        ORDER BY pr.PeriudhaID DESC
        LIMIT 1
        );`;

        db.query(sql, (err, results) =>{

        if(err){
            return callback(err);
        }
            
            callback(null, results);
        })
    }

     static fshijProvimin(ProvimiID, callback){

        const sql = `DELETE FROM provimi WHERE ProvimiID = ?`;

        db.query(sql, [ProvimiID], (err, results) =>{

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
        SELECT l.LendaID, l.Kodi_Lendes, l.Emri_Lendes, l.ECTS , 
        s.Afati_Semestrit, s.NrSemestrit, p.ProvimiID
        FROM provimi p 
        INNER JOIN periudha_regjistrimit_te_provimeve prtp on p.PeriudhaID = prtp.PeriudhaID
        INNER JOIN lenda l on p.LendaID = l.LendaID
        INNER JOIN lenda_profesori lp on p.LendaID = lp.LendaID
        INNER JOIN profesori prof on lp.ProfesoriID = prof.ProfesoriID
        INNER JOIN semestri s on s.Semestri_ID = l.SemestriID
        INNER JOIN student_semestri ss on s.Semestri_ID = ss.Semestri_ID
        WHERE ss.StudentiID = ?
        AND NOT EXISTS (
            SELECT 1
			FROM student_provimi stdprv
            INNER JOIN provimi prov on stdprv.ProvimiID = prov.ProvimiID
            WHERE prov.LendaID = l.LendaID
            AND stdprv.StudentiID = ss.StudentiID
           
            )
        AND NOT EXISTS (
            SELECT 1
            FROM student_provimi sp
            INNER JOIN provimi p2 on sp.ProvimiID = p2.ProvimiID
            INNER JOIN rezultateteprovimit rp on sp.RegjistrimiProvimitID = rp.ProvimiRegjistruar
            WHERE p2.LendaID = l.LendaID
            AND sp.StudentiID = ss.StudentiID
            )
    AND CURDATE() BETWEEN prtp.Data_Fillimit AND prtp.Data_Perfundimit
        
        GROUP BY l.LendaID
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
        s.ID, rp.NOTA, sp.Date_Paraqitjes, rp.Data_Vendosjes_Notes, rp.RezultatiID, prof.Emri, prof.Mbiemri
        FROM student_provimi sp 
        INNER JOIN studenti s on sp.StudentiID = s.ID
        INNER JOIN provimi prv on sp.ProvimiID = prv.ProvimiID
        INNER JOIN lenda l on prv.LendaID = l.LendaID
        INNER JOIN profesori prof on sp.ProfesoriID = prof.ProfesoriID
        LEFT JOIN rezultateteprovimit rp on sp.RegjistrimiProvimitID = rp.ProvimiRegjistruar
        INNER JOIN periudha_regjistrimit_te_provimeve prtp ON prv.PeriudhaID = prtp.PeriudhaID
        WHERE sp.StudentiID = ?
        AND CURDATE() <= prtp.Data_Perfundimit_Notave`;
        
        db.query(sql,[StudentiID],(err, results) =>{
            
            if(err){
            return callback(err);
        }   
            callback(null, results);
        })
    }

    static transkriptaENotave(StudentiID, callback){

        const sql = `SELECT l.*, rp.*, sems.*, s.Emri,s.Mbiemri, f.Emri Drejtimi, ns.Emri_Nivelit, s.statusi
    FROM rezultateteprovimit rp
    INNER JOIN student_provimi sp on rp.ProvimiRegjistruar = sp.RegjistrimiProvimitID
    INNER JOIN provimi p on sp.ProvimiID = p.ProvimiID
    INNER JOIN lenda l on p.LendaID = l.LendaID
    INNER JOIN studenti s on sp.StudentiID = s.ID
    INNER JOIN semestri sems on l.SemestriID = sems.Semestri_ID
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
    INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID
    WHERE s.ID = ?
       AND rp.NOTA != 'jo prezent' 
       AND rp.NOTA IN ('6', '7', '8', '9', '10')`;

        db.query(sql, [StudentiID],(err, results) =>{
        
        if(err){
            return callback(err);
        }   
            callback(null, results);
        })
    }

     static notatSipasID(StudentiID, callback){

        const sql = `SELECT l.*, rp.*, sems.*, s.Emri,s.Mbiemri, f.Emri Drejtimi, ns.Emri_Nivelit, s.statusi
    FROM rezultateteprovimit rp
    INNER JOIN student_provimi sp on rp.ProvimiRegjistruar = sp.RegjistrimiProvimitID
    INNER JOIN provimi p on sp.ProvimiID = p.ProvimiID
    INNER JOIN lenda l on p.LendaID = l.LendaID
    INNER JOIN studenti s on sp.StudentiID = s.ID
    INNER JOIN semestri sems on l.SemestriID = sems.Semestri_ID
    INNER JOIN gjenerata gj on s.GjenerataID = gj.GjenerataID
    INNER JOIN fakulteti f on gj.FakultetiID = f.FakultetiID
    INNER JOIN niveli_studimit ns on f.Niveli = ns.NiveliID
    WHERE s.ID = ?
       AND rp.NOTA != 'jo prezent' 
       AND rp.NOTA IN ('6', '7', '8', '9', '10')`;

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
INNER JOIN viti_akademik vk on prp.VitiAkademikID = vk.VitiAkademikID
ORDER BY prp.PeriudhaID DESC`;

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

static notatERegjistruara(ProfesoriID, callback){

    const sql = `SELECT rp.RezultatiID, s.Emri, s.Mbiemri, s.EmailStudentor, l.Emri_Lendes, l.Kodi_Lendes, rp.NOTA
    FROM rezultateteprovimit rp
    INNER JOIN student_provimi sp on rp.ProvimiRegjistruar = sp.RegjistrimiProvimitID
    INNER JOIN provimi p on sp.ProvimiID = p.ProvimiID
    INNER JOIN periudha_regjistrimit_te_provimeve pr on p.PeriudhaID = pr.PeriudhaID
    INNER JOIN lenda l on p.LendaID = l.LendaID
    INNER JOIN profesori prof on sp.ProfesoriID = prof.ProfesoriID
    INNER JOIN studenti s on sp.StudentiID = s.ID
    WHERE prof.ProfesoriID = ? 
    AND CURRENT_DATE() <= pr.Data_Perfundimit_Notave`;

    db.query(sql, [ProfesoriID], (err, results) =>{

    if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static fshijNotenERegjistruar(RezultatiID, callback){

    const sql = `DELETE FROM rezultateteprovimit WHERE RezultatiID = ?`;

    db.query(sql, [RezultatiID], (err, results) =>{

    if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static caktoPeriudhenEProvimeve(VitiAkademikID, Data_Fillimit, Data_Perfundimit, 
    Data_Perfundimit_Notave, EmriPeriudhes, afatiPeriudhes, callback) {

    const sql = `INSERT INTO periudha_regjistrimit_te_provimeve(VitiAkademikID, Data_Fillimit, 
    Data_Perfundimit, Data_Perfundimit_Notave, EmriPeriudhes, afatiPeriudhes) 
    VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [VitiAkademikID, Data_Fillimit, Data_Perfundimit, 
    Data_Perfundimit_Notave, EmriPeriudhes, afatiPeriudhes], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static kontrolloRefuziminENotes(RegjistrimiProvimitID, callback){

    const sql = `SELECT r.*, 
       (NOW() <= r.Data_Vendosjes_Notes + INTERVAL 7 DAY) AS RefuzimiLejuar
    FROM rezultateteprovimit r
    WHERE r.ProvimiRegjistruar = ?`;

    db.query(sql, [RegjistrimiProvimitID], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static numriIProvimevePerNjePeriudhe(StudentiID, callback){

    const sql = `SELECT COUNT(*) AS total, prtp.afatiPeriudhes
    FROM student_provimi sp
    INNER JOIN provimi p on sp.ProvimiID = p.ProvimiID
    INNER JOIN periudha_regjistrimit_te_provimeve prtp on p.PeriudhaID = prtp.PeriudhaID
    WHERE sp.StudentiID = ?
    AND CURDATE() BETWEEN prtp.Data_Fillimit AND prtp.Data_Perfundimit`;

    db.query(sql, [StudentiID], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })

}

static ekzistonAfatiProvimit(StudentiID, callback){

    const sql = `SELECT * FROM 
periudha_regjistrimit_te_provimeve prtp 
WHERE CURDATE() BETWEEN prtp.Data_Fillimit AND prtp.Data_Perfundimit`;

    db.query(sql, [StudentiID], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })

}

static ekzistonAfatiIPerfundimitTeNotave(StudentiID, callback){

    const sql = `SELECT * FROM 
periudha_regjistrimit_te_provimeve prtp 
WHERE CURDATE() <= prtp.Data_Perfundimit_Notave`;

    db.query(sql, [StudentiID], (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static fshijProvimetEPaKaluara(callback){

    const sql = `DELETE FROM rezultateteprovimit
WHERE (NOTA = '5' OR NOTA = 'jo prezent')
  AND NOW() > Data_Vendosjes_Notes + INTERVAL 7 DAY;
`;

    db.query(sql, (err, results) =>{

        if(err){
        return callback(err);
    }
        console.log(results);
        callback(null, results);
    })
}

static patchPeriudhatEProvimeve(PeriudhaID, fushat, values, callback){

        const sql = `UPDATE periudha_regjistrimit_te_provimeve SET ${fushat.join(', ')} WHERE PeriudhaID = ?`;

        values.push(PeriudhaID);

        db.query(sql, values, (err, results) =>{

            if(err){
                return callback(err);
            }
            console.log(results.affectedRows);
            
            callback(null, results);

        })
    }
}
export default Provimi;