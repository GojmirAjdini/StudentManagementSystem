import React, {useState, useEffect} from "react";
import './assets/CaktoLendetProfesoret.css';
import axios from "axios";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';

function CaktoLendetProf() {

    const API_URL = 'http://localhost:3000/';

    const [successMessage, setSuccessMessage] = useState('');

    const [lendet, setLendet] = useState([]);
    const [profesoret, setProfesoret] = useState([]);
    const [LendaID, setLendaID] = useState('');
    const [ProfesoriID, setProfesoriID] = useState('');

    const handleReset = () => {

        setLendaID('');
        setProfesoriID('');

    }

    useEffect (() =>{

        fetchLendet();
        fetchProfesoret();

    },[]);

    const fetchLendet = async() =>{

        try{

            const response = await axios.get(`${API_URL}admin/lendet/all`, {withCredentials:true});

           console.log(response.data);
           setLendet(response.data);
        
        }catch(err){
            console.error(err);
        }
    }

    const fetchProfesoret = async () =>{

        try{

            const response = await axios.get(`${API_URL}admin/profesoret/all`, { withCredentials:true});

            console.log(response.data);
            setProfesoret(response.data);
       
        }catch(err){
            console.error(err);
        }

    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!LendaID || !ProfesoriID){

            await Swal.fire ({
            title: 'Fushat e zbrazura!',
                    text: 'Ju lutem plotësoni të gjithë fushat. ',
                    icon: 'info',
                    confirmButtonText: 'OK',
                    confirmButtonColor:'#3085d6',
                    timer:5000,
                    customClass: {
                    confirmButton: 'swal-confirmBtn',
                    popup: 'popupDesign',
                    htmlContainer: 'textSwal',
        }
        
    })
    return;
}
        try{
                const response = await axios.post(`${API_URL}admin/profesoret/assign`,{
                    LendaID: LendaID,
                    ProfesoriID: ProfesoriID,

                }, { withCredentials:true})

        console.log(response.data.message);

        setSuccessMessage(response.data.message);

        setTimeout(() => {setSuccessMessage('')},5000);

        }catch(err){

            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                  
             console.log(err.response.data.message);
        
             Swal.fire({
            title: 'Gabim!',
            text: err.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor:'#d33',
            customClass: {
                confirmButton: 'swal-confirmBtn',
                popup: 'popupDesign',
                htmlContainer: 'textSwal',
                 }
             });
         }
    }
}

    return (

        <div className="container" id="fadeInPage">

        <h1>CAKTO LËNDËT DHE PROFESORËT</h1>

        <form className="formProfLnd" onSubmit={handleSubmit}>


        <div className="input-label">
        <label htmlFor="">Lënda <span>*</span></label>

        <select id="select"  required className="form-select selectProfLnd" value={LendaID} onChange={(e) => setLendaID(e.target.value)}>
      <option disabled value="">Zgjedh Lëndën</option>
      {lendet.map((lnd) => (
        <option key={lnd.LendaID} value={lnd.LendaID}>
          {lnd.Emri_Lendes + " - Semestri " + lnd.Semestri}
        </option>
      ))}
    </select>
    </div>

    <div className="input-label">
        <label htmlFor="">Profesori <span>*</span></label>
        
        <select id="select" required className="form-select selectProfLnd" value={ProfesoriID} onChange={(e) => setProfesoriID(e.target.value)}>
      <option disabled value="">Zgjedh Profesorin</option>
      {profesoret.map((prof) => (
        <option key={prof.ProfesoriID} value={prof.ProfesoriID}>
          { "Prof. " + prof.Emri + " " + prof.Mbiemri + " - " + prof.Titulli_Akademik}
        </option>
      ))}
    </select>
    </div>

    <div className="input-labelProfLnd">
        <Button variant="contained" id="primaryBtnProf"  type="submit">Cakto</Button>
        <Button variant="contained" id="resetBtnProf"  type='button' onClick={handleReset}>Reset</Button>
        </div>
        </form>

        {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
         <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 

        </div>

    )
}

export default CaktoLendetProf; 