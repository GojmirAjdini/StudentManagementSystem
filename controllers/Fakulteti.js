import Fakulteti from "../models/Fakulteti.js";

const lexojFakultetet = async (req, res)=>{

    try{
    Fakulteti.readFakultetet((fakultetet) =>{
        
        res.json(fakultetet);  });
    }
    catch(error){
        console.error(error);
        res.json(500).send("Server error");
    }
}

const shtoFakultet = async (req, res) => {
    
    try{
        const {Emri, Niveli, Lokacioni, Kodi_Fakultetit} = req.body;

        const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
        const upCLokacioni = Lokacioni.charAt(0).toUpperCase() + Lokacioni.slice(1);

        Fakulteti.regjistroFakultet(upCEmri.trim(), Niveli, upCLokacioni.trim(),Kodi_Fakultetit, (err, newFakulteti) =>{

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

        const {Emri, Niveli, Lokacioni, Kodi_Fakultetit} = req.body;

        const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
        const upCLokacioni = Lokacioni.charAt(0).toUpperCase() + Lokacioni.slice(1);

        const updatedFk = new Fakulteti(id, upCEmri.trim(), Niveli, upCLokacioni.trim(), Kodi_Fakultetit);

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

const lexoFakultetinId = async (req, res) =>{

    const ID = req.params.FakultetiID;

    try{

        Fakulteti.getFakultetiById(ID, (err, fakulteti) =>{

            if(err){
                return res.status(500).json({err: true, message: err.message});
            }
            return res.status(200).json(fakulteti);
        })  
    }catch(err){
        console.error(err);
        return res.status(500).json({err: true, message: err.message});
    }
}

const patchFakulteti = async (req, res) =>{    
    
    try{
    
    const id = req.params.FakultetiID;
    const {Emri, Niveli, Lokacioni, Kodi_Fakultetit} = req.body;

    const fushat =[];
    const values = [];

    const upCEmri = Emri.charAt(0).toUpperCase() + Emri.slice(1);
    const upCLokacioni = Lokacioni.charAt(0).toUpperCase() + Lokacioni.slice(1);
        
    if(upCEmri){ fushat.push("Emri = ?"); values.push(upCEmri.trim()); } 
    if(Niveli){ fushat.push("Niveli = ?"); values.push(Niveli); } 
    if(upCLokacioni){ fushat.push("Lokacioni = ?"); values.push(upCLokacioni.trim()); } 
    if(Kodi_Fakultetit){ fushat.push("Kodi_Fakultetit = ?"); values.push(Kodi_Fakultetit); }

    if(fushat.length === 0){    
        return res.status(400).json({message: "Nuk ka të dhëna për përditësim!"});
    }
    
        Fakulteti.patchFakulteti(id, fushat, values, (err, result) =>{

            if(err){
                return res.status(500).json({err: true, message: err.message});
            }
            return res.status(200).json({message: "Fakulteti u përditësua me sukses!"});
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({err: true, message: err.message});
    }
}


const lexoFakultetinByName = async (req, res) =>{

    const Emri = req.query.Emri;

    try{

        Fakulteti.getFakultetiByName([Emri.trim()], (err, fakulteti) =>{

            if(err){
                return res.status(500).json({err: true, message: err.message});
            }
            if(fakulteti.length === 0){
                return res.status(404).json({message:"Fakulteti nuk ekziston!"});
            }
            return res.status(200).json(fakulteti);
        })  
    }catch(err){
        console.error(err);
        return res.status(500).json({err: true, message: err.message});
    }
}

const lexoNiveletEStudimit = async (req, res) =>{

    try{

        Fakulteti.lexoNiveletEStudimit((err, nivelet) =>{
               
            return res.status(200).json({nivelet});

        })
    }catch(error){
        console.error(error);
        res.json(500).send("Server error");
    }
}

const lexoGjeneratat = async(req, res) =>{

    try{

        Fakulteti.lexoGjeneratat((err, gjenerata) =>{
               
            if(err){
                return res.status(500).json({error:err})
            }
            return res.status(200).json({gjenerata});

        })
    }catch(error){
        console.error(error);
        res.json(500).send("Server error");
    }
}

export default {lexojFakultetet, shtoFakultet, fshijFakultetin, 
    updateFakultetin, lexoFakultetinId, patchFakulteti,
    lexoFakultetinByName, lexoNiveletEStudimit, lexoGjeneratat};