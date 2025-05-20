import React, {useEffect, useState} from "react";
import axios from "axios";
import './assets/Register.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import axiosInstance from "../../../services/axiosInstance";

function Register(){

    const [fakultetet, setFakultetet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [successEmail, setSuccessEmail] = useState('');
    const [emri, setEmri] = useState('');
    const [mbiemri, setMbiemri] = useState('');
    const [gjinia, setGjinia] = useState('');
    const [emailprivat, setEmailPrivat] = useState('');
    const [vendlindja, setVendlindja] = useState('');
    const [data_lindjes, setData_Lindjes] = useState('');
    const [adresa, setAdresa] = useState('');
    const [nr_tel, setNr_Tel] = useState('');
    const [fakultetiID, setFakultetiID] = useState('');
    const [niveli, setNiveli] = useState('');
    const [statusi, setStatusi] = useState('');

    const handleReset = () => {
        setEmri('');
        setMbiemri('');
        setGjinia('');
        setEmailPrivat('');
        setVendlindja('');
        setData_Lindjes('');
        setAdresa('');
        setNr_Tel('');
        setFakultetiID('');
        setStatusi('');
        setNiveli('');
    };
    

    const fakultetetDisponueshme = async() =>{

        try{
        const response = await axiosInstance.get(`admin/fakultetet/all`);

        setFakultetet(response.data);
    }catch(err){
        console.error("Error fetching fakultetet",err); 
    }
}

    const submitStudenti = async(e) =>{

        e.preventDefault();

      if(!emri && !mbiemri && !gjinia && !emailprivat && 
        !vendlindja &&!data_lindjes && !adresa && !nr_tel && 
        !fakultetiID && !statusi && !niveli ){

      await Swal.fire({
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
  
    });

    return; 
    }

    try{

        const response = await axiosInstance.post(`admin/studentet/register/`,{

            Emri: emri, Mbiemri: mbiemri, Gjinia: gjinia, EmailPrivat: emailprivat,
            Vendlindja: vendlindja, Data_Lindjes: data_lindjes, Adresa: adresa, Nr_Tel: nr_tel,
            FakultetiID: fakultetiID, Statusi: statusi 
        });

        setSuccessMessage(response.data.message);
        setSuccessEmail(response.data.emailNotification);

        console.log(response.data.emailNotification);

        setTimeout(() => setSuccessMessage(''),5000);
        setTimeout(() => setSuccessEmail(''),5000);

    } catch(err){
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
    

useEffect(() =>{

    fakultetetDisponueshme();

},[]);

return (

    <div className="container fade-in">

        <h1 id="studentH1">REGJISTRO STUDENTË</h1>

        <form onSubmit={submitStudenti} autoComplete='on' action="">

        <div className="input-label">
        <label >Emri <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Emri" value={emri} onChange={(e) => setEmri(e.target.value)} />
        </div> 
       
        <div className="input-label">
        <label htmlFor="">Mbiemri <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Mbiemri" value={mbiemri} onChange={(e) => setMbiemri(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Gjinia <span>*</span></label>
       
        <div id="gjinia" className="form-check ">
        <label className="form-check-label" htmlFor="flexRadioDefault1">
    <input
      className="form-check-input"
      type="radio"
      name="gjinia"
      value="M"
      checked={gjinia === "M"}
      onChange={(e) => setGjinia(e.target.value)}
      id="flexRadioDefault1"
    />
    Mashkull
    </label>

    <label className="form-check-label" htmlFor="flexRadioDefault2">
    <input
      className="form-check-input"
      type="radio"
      name="gjinia"
      value="F"
      checked={gjinia === "F"}
      onChange={(e) => setGjinia(e.target.value)}
      id="flexRadioDefault2"
    />
    Femër
  </label>
  </div>
</div>

        <div className="input-label">
        <label htmlFor="">Email Privat <span>*</span></label>
        <input className="form-control" required type="email" placeholder="Email Privat" value={emailprivat} onChange={(e) => setEmailPrivat(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Vendlindja <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Vendlindja" value={vendlindja} onChange={(e) => setVendlindja(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Lindjes <span>*</span></label>
        <input className="form-control" required type="date" placeholder="Data e Lindjes" value={data_lindjes} onChange={(e) => setData_Lindjes(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Adresa <span>*</span></label>
        <input  className="form-control" required type="text" placeholder="Adresa" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
        </div>
        
        <div className="input-label">
        <label htmlFor="">Kontakt</label>
        <input className="form-control" type="text" placeholder="04X-XXX-XXX" name="Nr_Tel" value={nr_tel} onChange={(e) => setNr_Tel(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti <span>*</span></label>

        <select id="select" className="form-select" value={fakultetiID} onChange={(e) => setFakultetiID(e.target.value)}>
          <option disabled value="">Zgjedh Fakultetin</option>
          {fakultetet.map((fk) => (
            <option key={fk.FakultetiID} value={fk.FakultetiID}>
              {fk.Emri}
            </option>
          ))}
        </select>
        </div>

        <div className="input-label">
        <label htmlFor="">Niveli<span> *</span></label>
        <select className="form-select" required value={niveli} onChange={(e) => setNiveli(e.target.value)} aria-label="Default select example">
        <option disabled value="">Niveli</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Master">Master</option>
        <option value="PhD">PhD</option>
        </select>
        </div>

        <div className="input-label">
        <label htmlFor="">Statusi<span> *</span></label>
        <select required onChange={(e) => setStatusi(e.target.value)} className="form-select" aria-label="Default select example">
        <option disabled selected>Statusi</option>
        <option value="Aktiv">Aktiv</option>
        <option value="Deaktiv">Deaktiv</option>
        </select>
        </div>

        <div className="input-label">
        <Button id="primaryBtn" variant="contained"  type="submit">Regjistro</Button>
        <Button id="resetBtn" variant="contained" type="button" onClick={handleReset}>Reset</Button>
        </div>
        </form>
        {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
          <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 

      {successEmail && (
        <div id="successEmailStd" className="fade-in" role="alert">
          <Alert severity="success">{successEmail} </Alert>
        </div>  
      )}  

</div>
);
}

export default Register;