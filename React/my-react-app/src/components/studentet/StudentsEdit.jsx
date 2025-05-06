import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./assets/Register.css";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import {Alert, Button} from '@mui/material';

function StudentsEdit() {
  const { ID } = useParams();
  const API_URL = "http://localhost:3000/";

  const [originalStudenti, setOriginalStudenti] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [fakultetet, setFakultetet] = useState([]);
  const [studenti, setStudenti] = useState({
    Emri: '',
    Mbiemri: '',
    Gjinia: '',
    EmailPrivat: '',
    Vendlindja: '',
    Data_Lindjes: '',
    Adresa: '',
    Nr_Tel: '',
    FakultetiID: '',
    Niveli: '',
    Statusi: '',
  });

  useEffect(() => {
    
    fetchStudenti();
    fetchFakultetet();

}, []);

  const fetchStudenti = async () => {
    try {
      const res = await axios.get(`${API_URL}studentet/${ID}`);
      console.log("Studenti data:", res.data);
      setStudenti(
        res.data[0]
      )
      setOriginalStudenti(res.data[0]);
    } catch (err) {
      console.error("Error fetching studenti", err);
    }
  };

  const fetchFakultetet = async () => {
    try {
      const res = await axios.get(`${API_URL}fakultetet/all`);
      console.log(res.data);
      setFakultetet(res.data);
    } catch (err) {
      console.error("Error fetching fakultetet", err);
    }
  };

  
const handleChange = (e) => {
    const { name, value } = e.target;
    setStudenti((prevStudenti) => ({
      ...prevStudenti,
      [name]: value,
    }));
  };

  const formatLocalDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEqual(studenti, originalStudenti)) {
      
      await Swal.fire({
        title: 'Nuk ka ndryshime!',
        text: 'Asnjë e dhënë nuk është ndryshuar.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor:'#3085d6',
        customClass: {
          confirmButton: 'swal-confirmBtn',
          popup: 'popupDesign',
          htmlContainer: 'textSwal',
        }
      });
      return; 
    }
   
    const result = await Swal.fire({
      
      background:"rgb(245, 245, 245)",
      position: "center",
      title: "Dëshironi t'i ruani të dhënat?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',      
      confirmButtonText: 'Po, ruaj!',
      cancelButtonText: 'Jo, anulo',
      timer:5000,
      customClass: {
        confirmButton:'swal-confirmBtn',
        cancelButton: 'swal-confirmBtn',
        popup:"popupDesign"
      }
    });

    if(result.isConfirmed){

    try {

      const response  = await axios.patch(`${API_URL}studentet/edit/${ID}`, studenti);

      setSuccessMessage(response.data.message);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Error updating studenti", err);
    }
  };
  }
  return (

    
    <div id="fadeInPage" className="container">
      <h1>PËRDITËSO STUDENTIN</h1>

      {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
         <Alert severity="success"> {successMessage}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        <div className="input-label">
          <label>Emri <span>*</span></label>
          <input className="form-control" type="text" name="Emri" value={studenti.Emri || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <label>Mbiemri <span>*</span></label>
          <input className="form-control" type="text" name="Mbiemri" value={studenti.Mbiemri || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Gjinia <span>*</span></label>

          <div id="gjinia" className="form-check">
            <label form="flexRadioDefault1" className="form-check-label">
              <input className="form-check-input" type="radio" name="Gjinia" value="M" checked={studenti.Gjinia === "M" || ''} onChange={handleChange} />
              Mashkull
            </label>
            
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              <input className="form-check-input" type="radio" name="Gjinia" value="F" checked={studenti.Gjinia === "F" || ''} onChange={handleChange} />
              Femër
            </label>
          </div>
        </div>

        <div className="input-label">
          <label>Email Privat <span>*</span></label>
          <input className="form-control" type="email" name="EmailPrivat" value={studenti.EmailPrivat || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Vendlindja <span>*</span></label>
          <input className="form-control" type="text" name="Vendlindja" value={studenti.Vendlindja || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Data e Lindjes <span>*</span></label>
          <input className="form-control" placeholder="YYYY-MM-DD" type="date" name="Data_Lindjes" 
          value={studenti.Data_Lindjes ? formatLocalDate(studenti.Data_Lindjes) : ''} 
          onChange = {handleChange}required />
          
        </div>
        <div className="input-label">
          <label>Adresa <span>*</span></label>
          <input className="form-control" type="text" name="Adresa" value={studenti.Adresa || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Kontakt</label>
          <input className="form-control" type="text" name="Nr_Tel" value={studenti.Nr_Tel || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <label>Fakulteti <span>*</span></label>
          <select className="form-select" name="FakultetiID" value={studenti.FakultetiID || ''} onChange={handleChange} required>
            <option value='' disabled >Zgjedh Fakultetin</option>
            {fakultetet.map((fk) => (
              <option key={fk.FakultetiID} value={fk.FakultetiID}>
                {fk.Emri}
              </option>
            ))}
          </select>
          {console.log(studenti.FakultetiID)}
        </div>

        <div className="input-label">
          <label>Niveli <span>*</span></label>
          <select className="form-select" name="Niveli" value={studenti.Niveli || ''} onChange={handleChange} required>
            <option disabled>Niveli</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        <div className="input-label">
          <label>Statusi <span>*</span></label>
          <select className="form-select" name="Statusi" value={studenti.Statusi|| ''} onChange={handleChange} required>
            <option disabled>Statusi</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Deaktiv">Deaktiv</option>
          </select>
        </div>

        <div className="input-label">
          <Button variant="contained" id="updateBtn" type="submit">Ruaj Ndryshimet</Button>
        </div>

        <div className="input-label">

         <Link className="kthehuLinkStd" to={`/studentet`}>  
        <Button variant="contained" color="inherit"> <FaArrowLeft className="leftArrow"/>Kthehu</Button> </Link>
        </div>

      </form>
    </div>
  );
}

export default StudentsEdit;
