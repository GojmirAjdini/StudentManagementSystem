import db from "../database/Database.js";
import Provimi from "../models/Provimi.js";

const lexoAllProvimet = async(req, res)=>{

    try{

        Provimi.lexoProvimetAll((err, results) =>{
            if(err){
                return res.status(500).json({err:err});
            }
        
            return res.status(200).json({results});
        })
    }catch(err){
        return res.status(500).json({err:true,message:err});

    }
}

const caktoProviminByAdmin = async (req, res) => {
    
    try{

        const {LendaID, ProfesoriID} = req.body;

        Provimi.caktoProviminByAdmin(LendaID,ProfesoriID,(err, results) =>{

            if(err){
                return res.status(500).json({err:err});
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

        const sql = `SELECT ID 
        FROM studenti s 
        WHERE s.EmailStudentor = ?`;

        const [student] = await db.promise().query(sql, [email]);

        const StudentiID = student[0].ID;

        Provimi.paraqitProviminStudent(StudentiID, ProvimiID,(err, results) =>{

            if(err){

            if(err.code === 'ER_DUP_ENTRY'){

            return res.status(404).json({message:"Provimi është regjistruar tashmë!"});
        }
            return res.status(500).json({err:err});
        }

            return res.status(201).json({message:"Provimi u paraqit me sukses!"});
         })
    }
    catch(err){
        return res.status(500).json({err:true,message:err});

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


export default {lexoAllProvimet, caktoProviminByAdmin, paraqitProviminStudent, 
    lexoProvimetSipasStudentit, lexoProvimetEParaqituraTeStudentit, transkriptaENotave,
    lexoProfesoretSipasProvimit, caktoProfesorinPerProviminByAdmin, anuloParaqitjenEProvimit,
    mesatarjaENotave, refuzoNoten};