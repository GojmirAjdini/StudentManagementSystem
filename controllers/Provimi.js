import db from "../database/Database.js";
import Provimi from "../models/Provimi.js";

const lexoAllProvimet = async(req, res)=>{

    try{

        Provimi.lexoProvimetAll((err, results) =>{
            if(err){
                return res.status(500).json({err:err});
            }
        
            return res.status(200).json(results);
        })
    }catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const caktoProviminByAdmin = async (req, res) => {
    
    try{

        const {LendaID, data_Provimit, PeriudhaID} = req.body;

        Provimi.caktoProviminByAdmin(LendaID,data_Provimit,PeriudhaID,(err, results) =>{

            if(err){

            if(err.code === 'ER_DUP_ENTRY'){

            return res.status(404).json({message:"Provimi është caktuar tashmë!"});
        }
        else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            
            return res.status(400).json({message:`Ju lutem kontrolloni se lënda a 
                ligjërohet nga ndonjë profesorë.`})
        }  
        return res.status(500).json({message:err}); 
        }

            return res.status(201).json({message:"Provimi u caktua me sukses!"});
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const caktoProfesorinPerProviminByAdmin = async (req, res) => {
    
    try{

        const {ProvimiID, ProfesoriID} = req.body;

        Provimi.caktoProfesorinPerProviminByAdmin(ProvimiID,ProfesoriID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(201).json({message:"Profesori u caktua me sukses!"});
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const lexoProvimetSipasStudentit = async(req, res) =>{

    try{

        const email = req.user.email;

        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.lexoProvimetSipasStudentit(StudentiID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }
            
            return res.status(200).json(results);
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const paraqitProviminStudent = async(req, res) =>{

    try{

        const email = req.user.email;
        const ProvimiID = req.body.ProvimiID;
        const ProfesoriID = req.body.ProfesoriID;
        
        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.paraqitProviminStudent(StudentiID, ProvimiID, ProfesoriID,(err, results) =>{

            if(err){

            if(err.code === 'ER_DUP_ENTRY'){

            return res.status(404).json({message:"Provimi është regjistruar tashmë!"});
        }
            return res.status(500).json({message:err});
        }

            return res.status(201).json({message:"Provimi u paraqit me sukses!"});
         })
    }
    catch(error){
        return res.status(500).json({err:true,message:error});

    }
}

const lexoProvimetEParaqituraTeStudentit = async(req, res) =>{

    try{
        
        const email = req.user.email;

        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.lexoProvimetEParaqituraTeStudentit(StudentiID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(200).json(results);
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const transkriptaENotave = async (req, res) => {

    try {
       
        const email = req.user.email;
       
        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.transkriptaENotave(StudentiID,(err, results) =>{

            if(err){

            return res.status(500).json({err:err, message:err});
        }

            return res.status(200).json(results);
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const notatSipasID = async (req, res) => {

    try {
       
        const StudentiID = req.params.ID;

        Provimi.transkriptaENotave(StudentiID,(err, results) =>{

            if(err){

            return res.status(500).json({err:err, message:err});
        }

            return res.status(200).json(results);
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const mesatarjaENotave = async (req, res) =>{

    try{

        const email = req.user.email;
       
        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.mesatarjaENotave(StudentiID,(err, results) =>{

            if(err){

            return res.status(500).json({err:err, message:err});
        }

            return res.status(200).json(results);
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}


const mesatarjaENotaveSipasID = async (req, res) =>{

    try{

    
        const StudentiID = req.params.ID;

        Provimi.mesatarjaENotave(StudentiID,(err, results) =>{

            if(err){

            return res.status(500).json({err:err, message:err});
        }

            return res.status(200).json(results);
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const lexoProfesoretSipasProvimit = async (req, res) => {
    
    try{

        const ProvimiID = req.params.ProvimiID;

        Provimi.lexoProfesoretSipasProvimit(ProvimiID,(err, results) =>{

            if(err){
                return res.status(500).json({message:"Server error", err});
            }
            if(results.length === 0){
                return res.status(404).json({message: "Nuk ka të dhëna!"});
            }

            return res.status(200).json(results);
        })
    }   
    catch(err){
        console.error(err);
        return res.status(500).json({message: err});
    }
}

const anuloParaqitjenEProvimit = async(req, res) =>{

    try{

        const RegjistrimiProvimitID = req.params.RegjistrimiProvimitID;

        Provimi.anuloParaqitjenEProvimit([RegjistrimiProvimitID], (err, results) =>{

           if(err){
                return res.status(500).json({message:"Server error", err});
            }

            return res.status(200).json({message:"Paraqitja e provimit u anulua!"});
        })
    }   
    catch(err){
        console.error(err);
        return res.status(500).json({message: err});
}
}

const refuzoNoten = async(req, res) =>{

    try{

        const RezultatiID = req.params.RezultatiID;

        Provimi.refuzoNoten([RezultatiID], (err, results) =>{

           if(err){
                return res.status(500).json({message:"Server error", err});
            }

            return res.status(200).json({message:"Nota u refuzua!"});
        })
    }   
    catch(err){
        console.error(err);
        return res.status(500).json({message: err});
}
}


const lexoPeriudhatEProvimeve = async (req, res) => {
    
    try{

        Provimi.lexoPeriudhatEProvimeve((err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(201).json(results);
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const caktoNotenEProvimit = async(req, res) =>{

    try{

       const nota = req.body.Nota;
       const provimiID = req.body.ProvimiID;
        
        Provimi.caktoNotenEProvimit(nota, provimiID,(err, results) =>{

            if(err){

            if(err.code === 'ER_DUP_ENTRY'){

            return res.status(404).json({message:"Nota është vendosur tashmë!"});
        }
            return res.status(500).json({message:err});
        }

            return res.status(201).json({message:"Nota u vendos me sukses!"});
         })
    }
    catch(error){
        return res.status(500).json({err:true,message:error});

    }
}


const lexoNotatERegjistruara = async (req, res) => {
    
    try{
        
        const email = req.user.email;

        const sql = `SELECT ProfesoriID 
        FROM profesori p 
        WHERE p.Email = ?`;

        const [profesor] = await db.promise().query(sql, [email]);

        const ProfesoriID = profesor[0].ProfesoriID;

        Provimi.notatERegjistruara(ProfesoriID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(201).json(results);
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const fshijNotenERegjistruar = async(req, res) =>{

    try{

       const RezultatiID = req.params.RezultatiID;
        
        Provimi.fshijNotenERegjistruar(RezultatiID, (err, results) =>{

            if(err){
                    
            return res.status(500).json({message:err});
        }

            return res.status(200).json({message:"Nota u ç'regjistrua me sukses!"});
         })
    }
    catch(error){
        return res.status(500).json({err:true,message:error});

    }
}


const caktoPeriudhenEProvimeve = async(req, res) =>{

    try{

       const {VitiAkademikID, Data_Fillimit, Data_Perfundimit, 
    Data_Perfundimit_Notave, EmriPeriudhes, afatiPeriudhes} = req.body;
        
        Provimi.caktoPeriudhenEProvimeve(VitiAkademikID, Data_Fillimit, Data_Perfundimit, 
    Data_Perfundimit_Notave, EmriPeriudhes, afatiPeriudhes, (err, results) =>{

            if(err){
                    
            return res.status(500).json({message:err});
        }

            return res.status(200).json({message:"Periudha u caktua me sukses!"});
         })
    }
    catch(error){
        return res.status(500).json({err:true,message:error});

    }
}

const kontrolloRefuziminENotes = async (req, res) => {
    
    try{
        
        
        const RegjistrimiProvimitID = req.params.RegjistrimiProvimitID;

        Provimi.kontrolloRefuziminENotes(RegjistrimiProvimitID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(200).json(results);
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}


const numriIProvimevePerNjePeriudhe = async (req, res) => {
    
    try{
        
        const email = req.user.email;
       
        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.numriIProvimevePerNjePeriudhe(StudentiID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(201).json(results);
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}


const ekzistonAfatiProvimit = async (req, res) => {
    
    try{
        
        const email = req.user.email;
       
        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.ekzistonAfatiProvimit(StudentiID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            if(results.length === 0){
                return res.status(404).json({message:'Afati i provimeve ka skaduar!'});
            }

            return res.status(201).json(results);
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const ekzistonAfatiIPerfundimitTeNotave = async (req, res) => {
    
    try{
        
        const email = req.user.email;
       
        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.ekzistonAfatiIPerfundimitTeNotave(StudentiID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
            }

            return res.status(201).json(results);
        })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

export default {lexoAllProvimet, caktoProviminByAdmin, paraqitProviminStudent, 
    lexoProvimetSipasStudentit, lexoProvimetEParaqituraTeStudentit, transkriptaENotave,
    lexoProfesoretSipasProvimit, caktoProfesorinPerProviminByAdmin, anuloParaqitjenEProvimit,
    mesatarjaENotave, refuzoNoten, lexoPeriudhatEProvimeve, caktoNotenEProvimit,
    lexoNotatERegjistruara, fshijNotenERegjistruar, notatSipasID, mesatarjaENotaveSipasID,
    caktoPeriudhenEProvimeve, kontrolloRefuziminENotes, numriIProvimevePerNjePeriudhe,
    ekzistonAfatiProvimit, ekzistonAfatiIPerfundimitTeNotave};