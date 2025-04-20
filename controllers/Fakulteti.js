import { callbackPromise } from "nodemailer/lib/shared/index.js";
import Fakulteti from "../models/Fakulteti.js";

const lexojFakultetet = async (req, res)=>{

    try{
    Fakulteti.readFakultetet((fakultetet) =>{res.json(fakultetet);  });
    }
    catch(error){
        console.error(error);
        res.json(500).send("Server error");
    }
}

const shtoFakultet = async (req, res) => {
    
    try{
        const {Emri, Niveli, Lokacioni} = req.body;

        Fakulteti.regjistroFakultet(Emri, Niveli, Lokacioni,(err, newFakulteti) =>{

        if(err){
            return res.status(500).json({err: true, message: err.message});        
        }
        return res.status(200).json({
            message: "Fakulteti u regjistrua me sukses!",
            data: newFakulteti});
    })
}
    catch(err){
        console.error(err);
    }
}

const fshijFakultetin = async (req, res) => {
    
    const id = req.params.FakultetiID;

    try{

    Fakulteti.fshijFakultet(id, (err, result) =>{

        if(err){
            return res.status(500).json({err: true, message: err.message})
        }
        console.log("Fakulteti u fshi!")
        return res.status(200).json({message: "Fakulteti u fshi me sukses!"});
    });

}
catch(err){
    res.json({err: true, message: err.message});
}
}

const updateFakultetin = async (req, res) =>{

    try{

        const id = req.params.FakultetiID;

        const {Emri, Niveli, Lokacioni} = req.body;

        const updatedFk = new Fakulteti(id, Emri, Niveli, Lokacioni);

        Fakulteti.perditesoFakultetin(updatedFk,(err, results) =>{

            if(err){
                console.error(err);
                return res.status(500).json("Gabim ne perditesim!");
            }
            if(results.affectedRows === 0){
                return res.status(404).json({message:"Fakulteti nuk u gjet!"});
            }
            console.log(updatedFk);
            return res.status(200).json({message: "Te dhenat u perditesuan", data: updatedFk});
        })
    } catch(err){
        console.error(err);
        return res.json({err: true, error: err});
    }

}

export default {lexojFakultetet, shtoFakultet, fshijFakultetin, updateFakultetin};