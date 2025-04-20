import Lenda from "../models/Lenda.js";

const lexoLendet = async (req, res)=>{
   
    try{
        Lenda.readAllLendet((lendet) =>{

        if(lendet.length === 0){
            return res.json({message: "Nuk ka lende te regjistruar!"});
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
        const {FakultetiID, Emri_Lendes, ECTS, semestri} = req.body;

        Lenda.regjistroLenden(FakultetiID, Emri_Lendes, ECTS, semestri, (err, results) =>{

            if(err){
                return res.status(500).json("Gabim ne query!");
            }

            if(results.affectedRows === 0){
                return res.status(404).json({message: "Nuk u regjistrua lenda!"});
            }
            console.log(results);  
            return res.status(201).json({message: "Lenda u regjistrua me sukses!"})
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
            return res.status(200).json({message:"Lenda u fshi me sukse!"});
        })
    }catch(err){
        console.error(err);
        return res.status(404).json({err:true,message:err});
    }
}

export default {lexoLendet, createLenden, fshijLendenSipasId};