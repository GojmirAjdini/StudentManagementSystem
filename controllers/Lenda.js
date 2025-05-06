import Lenda from "../models/Lenda.js";

const lexoLendet = async (req, res)=>{
   
    try{
        Lenda.readAllLendet((lendet) =>{

        if(lendet.length === 0){
            return res.json({message: "Nuk ka lendë të regjistruar!"});
        }
            return res.json(lendet);
        })
    }
        catch(err){
            res.status(404).json({err: "Server error"});
    }
}

const createLenden = async (req, res) => {

    try{
        const {FakultetiID, Emri_Lendes, ECTS, Kodi_Lendes, SemestriID} = req.body;

        Lenda.regjistroLenden(FakultetiID, Emri_Lendes.trim(), ECTS, Kodi_Lendes, SemestriID, (err, results) =>{

            if(err){
                return res.status(500).json("Gabim ne query!");
            }

            if(results.affectedRows === 0){
                return res.status(404).json({message: "Nuk u regjistrua lënda!"});
            }
            console.log(results);  
            return res.status(201).json({message: "Lënda u regjistrua me sukses!"})
        })
    } catch(err){
        console.error(err);
        return res.status(500).json({err: true, message: err});
    }
}

const fshijLendenSipasId = async (req, res) => {

    try{

        const id = req.params.LendaID;

        Lenda.deleteLendenById(id, (err, results) =>{

            if(err){
                return res.status(404).json(err);
            }

            if(results.affectedRows === 0){
                return res.status(404).json({message:"Lenda nuk ekziston!"});
            }

            console.log(results);
            return res.status(200).json({message:"Lënda u fshi me sukses!"});
        })
    }catch(err){
        console.error(err);
        return res.status(404).json({err:true,message:err});
    }
}

const lexoLendenSipasId = async (req, res) => {

    try{

        const id = req.params.LendaID;

        Lenda.readLendaById(id, (err, results) =>{

            if(err){
                return res.status(404).json(err);
            }

            if(results.length === 0){
                return res.status(404).json({message:"Lenda nuk ekziston!"});
            }

            console.log(results);
            return res.status(200).json(results);
        })

    }
    catch(err){
        console.error(err);
        return res.status(404).json({err:true,message:err});
    }
}

const patchLenden = async (req, res) =>{

    try{
    const id = req.params.LendaID;
    const {FakultetiID, Emri_Lendes, ECTS, Kodi_Lendes, SemestriID} = req.body;
    const fushat = [];
    const values = [];

    const Emri = Emri_Lendes.charAt(0).toUpperCase(0) + Emri_Lendes.slice(1);

    if(FakultetiID){ fushat.push("FakultetiID = ?"); values.push(FakultetiID);}
    if(Emri){ fushat.push("Emri_Lendes = ?"); values.push(Emri.trim());}
    if(ECTS){ fushat.push("ECTS = ?"); values.push(ECTS);}
    if(Kodi_Lendes){ fushat.push("Kodi_Lendes = ?"); values.push(Kodi_Lendes.trim());}
    if(SemestriID){ fushat.push("SemestriID = ?"); values.push(SemestriID);}

    Lenda.patchLenda(id, fushat, values, (err, results) =>{

        if(err){
            return res.status(404).json(err);
        }

        if(results.affectedRows === 0){
            return res.status(404).json({message:"Lënda nuk ekziston!"});
        }

        console.log(results);
        return res.status(200).json({message:"Lënda u përditësua me sukses!"});
    })


}  catch(err){
        console.error(err);
        return res.status(404).json({err:true,message:err});
    }
}

const lexoLendenByName = async (req, res) => {

    try{

        const Emri = req.query.Emri_Lendes;

        Lenda.lexoLendenByName( [Emri.trim()] ,(err, results) =>{

            if(err){
                return res.status(500).json({message:"Server error", err: err});
            }
            
            if(results.length === 0){
                return res.status(404).json({message: "Lënda nuk ekziston!"})
            }
        
            return res.status(200).json(results);
        })
    }catch(err){
        console.error(err);
        return res.status(404).json({err:true,message:err});
    }
    
}

export default {lexoLendet, createLenden, fshijLendenSipasId, 
    lexoLendenSipasId, patchLenden, lexoLendenByName};