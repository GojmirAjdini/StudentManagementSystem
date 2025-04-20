import Lenda from "../models/Lenda.js";

const lexoLendet = async (req, res)=>{

    Lenda.readAllLendet((lendet) =>{

        try{
            res.json(lendet);
        }
        catch(err){
            res.status(404).json({err: "Server error"});
        }
    })
}

export default {lexoLendet};