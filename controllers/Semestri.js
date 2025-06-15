import Semestri from "../models/Semestri.js";

const readAllSemestrat = async (req, res) => {
    try {
        Semestri.readAllSemestrat((results) => {
            return res.status(200).json(results);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

const regjistroSemestrin = async (req, res) => {

   
    try {
        const { Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID } = req.body;
        Semestri.regjistroSemestrin(Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID, (err, results) => {
            console.log(results); 
            
            console.log('Received data:', {
        Afati_Semestrit, Nr_Semestrit, VitiAkademikID, GjenerataID
    });
            if(err){
           
                if (err.code === 'ER_DUP_ENTRY') {
                return res.status(404).json({message:"Semestri ekziston tashmë!"})
                
            }
                return res.status(500).json({ err: err, message:"Gabim gjatë regjistrimit"});
                
            }
            
            return res.status(200).json({ message: "Semestri u regjistrua me sukses!" });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

const lexoVitetAkademike = (req, res) =>{

   try {
        Semestri.lexoVitetAkademike((err, results) => {
            if(err){
                return res.status(500).json({err: true, message:err});
            }
            return res.status(200).json(results);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: true, message: err });
    }
}

const regjistroVitinAkademik = (req, res) =>{

    try{

        const {Viti_Fillimit, Viti_Mbarimit} = req.body; 

        const VitiAkademik = `${Viti_Fillimit}/${Viti_Mbarimit}`;

        console.log(VitiAkademik);
        Semestri.regjistroVitinAkademik(VitiAkademik, Viti_Fillimit, Viti_Mbarimit,(err, results) =>{

            if(err){

                if(err.code === 'ER_DUP_ENTRY'){
                     return res.status(404).json({message: "Viti akademik ekziston tashmë!"});
                }
                console.log(err);
                return res.status(500).json({message: err});
                
            }
            
            return res.status(201).json({message:'Viti akademik u regjistrua me sukses!'});
        })
    }
    catch(err){
        
        return res.status(500).json({ err: true, message: err });

    }
}


const regjistroGjeneraten = (req, res) =>{

    try{

        const {FakultetiID, Viti_Gjenerates, VitiAkademikID}= req.body; 

        Semestri.regjistroGjeneraten(FakultetiID, Viti_Gjenerates, VitiAkademikID,(err, results) =>{

            if(err){
                console.log(err);
                return res.status(500).json({message: err});
                
            }
            
            return res.status(201).json({message:'Gjenerata u regjistrua me sukses!'});
        })
    }
    catch(err){
        
        return res.status(500).json({ err: true, message: err });

    }
}

const fshijVitinAkademik = (req, res) =>{

    try{

        const VitiAkademikID = req.params.VitiAkademikID;

        Semestri.fshijVitinAkademik(VitiAkademikID, (err, results) =>{

            if(err){

                console.log(err);
                return res.status(500).json({message: err});
                
            }
            
            return res.status(201).json({message:'Viti akademik u fshi me sukses!'});
        })
    }
    catch(err){
        
        return res.status(500).json({ err: true, message: err });

    }
}

export default {
    readAllSemestrat,regjistroSemestrin,lexoVitetAkademike,
    regjistroVitinAkademik, regjistroGjeneraten, fshijVitinAkademik
}