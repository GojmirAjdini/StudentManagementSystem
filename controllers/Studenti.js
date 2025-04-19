import Studenti from "../models/Studenti.js";

const lexoStudentet = (req, res) =>{

        Studenti.readAll((studentet) =>{

        try{
            res.json(studentet);
        }
        catch(err){
            console.log("Error reading students!", err);
            return res.status(500).json({error: "Server error"})
        }
        
    } )
}

export default {lexoStudentet};