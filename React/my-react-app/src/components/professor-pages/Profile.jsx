import {useState, useEffect} from 'react';
import axiosInstance from '../../services/axiosInstance';
import WavingHand from "@mui/icons-material/WavingHand";
import CircularProgress from '@mui/material/CircularProgress';
import Edit from "@mui/icons-material/Edit";

import './assets/Profile.css';

function Profile(){

    const [profesori, setProfesori] = useState({
    Emri: '',
    Mbiemri: '',
    Gjinia: '',
    Titulli_Akademik: '',
    NrTel: '',
    Email: '',
    Fakulteti: '',
    Statusi: '',
    uKrijua: ''
    });


    useEffect(() =>{

        fetchProfesori();
    },[])

    const fetchProfesori = async() =>{

        try{

            const response = await axiosInstance.get("profesori/profile");

            console.log(response.data[0])
            setProfesori(response.data[0]);

        } catch(err){
            console.error(err);
        }
    }

    return(
   
        <div id="fadeInPage" className="profilePageContainer">
            
            <h1 id='profiliH1'>PROFILI IM</h1>


        <div id="containerFormProfile">            
        <h3 id="h3ProfesoriInfo">Informatat Personale</h3>

        { profesori ? (
        <form id="loginProfesorProfileData">
        
        <div className="input-label">
        <label htmlFor="">Emri</label>
        <input className="form-control" disabled type="text"
        placeholder="Emri" value={profesori.Emri} />
        </div>

        <div className="input-label">
        <label htmlFor="">Mbiemri</label>
        <input className="form-control" disabled
         type="text" placeholder="Mbiemri" value={profesori.Mbiemri} />
        </div>

        <div className="input-label">
        <label htmlFor="">Gjinia</label>
        <input className="form-control" disabled 
        type="text" placeholder="Gjinia" value={profesori.Gjinia} />
        </div>

        <div className="input-label">
        <label htmlFor="">Titulli Akademik</label>
        <input className="form-control" disabled type="text"
        placeholder="Titulli_Akademik" value={profesori.Titulli_Akademik} />
        </div>

        <div className="input-label">
        <label htmlFor="">Kontakt</label>
        <input className="form-control" disabled type="text"
        placeholder="Kontakt" value={profesori.NrTel} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email</label>
        <input className="form-control" disabled 
        type="text" placeholder="Email" value={profesori.Email} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti</label>
        <input className="form-control" disabled 
        type="text" placeholder="Fakulteti" value={profesori.Fakulteti} />
        </div>
        
        <div className="input-label">
        <label htmlFor="">Statusi</label>
        <input className="form-control" disabled type="text"
        placeholder="Statusi" value={profesori.Statusi} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Regjistrimit</label>
        <input className="form-control"  
        disabled type="text" placeholder="createdAt" 
        value={profesori.uKrijua ? new Date(profesori.uKrijua).toLocaleString() : ''} />
        </div>
        
        </form>
        
    ): (
        <CircularProgress></CircularProgress>
    )}
    </div>
        </div>
    )
}

export default Profile;