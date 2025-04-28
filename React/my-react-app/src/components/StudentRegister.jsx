import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from "axios";
import App from "./Students";
import "../assets/Register.css";
import Swal from "sweetalert2";

function Register(){

    const API_URL = "http://localhost:3000/";

    const [fakultetet, setFakultetet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
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
        const response = await axios.get(`${API_URL}fakultetet/all`);

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

        const response = await axios.post(`${API_URL}studentet/register/`,{

            Emri: emri, Mbiemri: mbiemri, Gjinia: gjinia, EmailPrivat: emailprivat,
            Vendlindja: vendlindja, Data_Lindjes: data_lindjes, Adresa: adresa, Nr_Tel: nr_tel,
            FakultetiID: fakultetiID, Statusi: statusi 
        });

        setSuccessMessage(response.data.message);

        setTimeout(() => setSuccessMessage(''),3000);
        console.log(response.data.message);
    } catch(err){
        console.error(err);
    }

}

useEffect(() =>{

    fakultetetDisponueshme();

},[]);

return (

    <div className="container">

        <h1>REGJISTRO STUDENTË</h1>

        <form onSubmit={submitStudenti} action="">

        <div className="input-label">
        <label htmlFor="">Emri <span>*</span></label>
        <input required type="text" placeholder="Emri" value={emri} onChange={(e) => setEmri(e.target.value)} />
        </div> 
       
        <div className="input-label">
        <label htmlFor="">Mbiemri <span>*</span></label>
        <input required type="text" placeholder="Mbiemri" value={mbiemri} onChange={(e) => setMbiemri(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Gjinia <span>*</span></label>
       
        <div className="form-check">
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
        <input required type="email" placeholder="Email Privat" value={emailprivat} onChange={(e) => setEmailPrivat(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Vendlindja <span>*</span></label>
        <input required type="text" placeholder="Vendlindja" value={vendlindja} onChange={(e) => setVendlindja(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Lindjes <span>*</span></label>
        <input required type="date" placeholder="Data e Lindjes" value={data_lindjes} onChange={(e) => setData_Lindjes(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Adresa <span>*</span></label>
        <input required type="text" placeholder="Adresa" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
        </div>
        
        <div className="input-label">
        <label htmlFor="">Kontakt</label>
        <input type="text" placeholder="04X-XXX-XXX" name="Nr_Tel" value={nr_tel} onChange={(e) => setNr_Tel(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti <span>*</span></label>

        <select  value={fakultetiID} onChange={(e) => setFakultetiID(e.target.value)}>
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
        <select required class="form-select" value={niveli} onChange={(e) => setNiveli(e.target.value)} aria-label="Default select example">
        <option disabled value="">Niveli</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Master">Master</option>
        <option value="PhD">PhD</option>
        </select>
        </div>

        <div className="input-label">
        <label htmlFor="">Statusi<span> *</span></label>
        <select required onChange={(e) => setStatusi(e.target.value)} class="form-select" aria-label="Default select example">
        <option disabled selected>Statusi</option>
        <option value="Aktiv">Aktiv</option>
        <option value="Deaktiv">Deaktiv</option>
        </select>
        </div>

        <div className="input-label">
        <button id="primaryBtn" className="btn btn-primary" type="submit">Regjistro</button>
        <button id="resetBtn" className="btn btn-secondary" type="button" onClick={handleReset}>Reset</button>
        </div>
        </form>
        {successMessage && (
        <div id="successMsg" className="alert alert-success fade-in" role="alert">
          {successMessage}
        </div>  
      )}  
</div>
);
}

export default Register;