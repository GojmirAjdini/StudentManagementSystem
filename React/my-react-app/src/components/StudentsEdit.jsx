import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Register.css";
import Studentet from "./Students";


function StudentsEdit() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://localhost:3000/";

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
      setStudenti(res.data[0],{
        Drejtimi: res.data[0].Drejtimi,
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response  = await axios.patch(`${API_URL}studentet/edit/${ID}`,studenti);

      setSuccessMessage(response.data.message);

      setTimeout(() => setSuccessMessage(''), 3000);
      setTimeout(() =>  navigate("/studentet"), 3000);
    } catch (err) {
      console.error("Error updating studenti", err);
    }
  };

  return (

    
    <div className="container">
      <h1>PËRDITËSO STUDENTIN</h1>

      {successMessage && (
        <div id="successMsg" className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        <div className="input-label">
          <label>Emri <span>*</span></label>
          <input type="text" name="Emri" value={studenti.Emri || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <label>Mbiemri <span>*</span></label>
          <input type="text" name="Mbiemri" value={studenti.Mbiemri || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Gjinia <span>*</span></label>
          <div className="form-check">
            <label>
              <input type="radio" name="Gjinia" value="M" checked={studenti.Gjinia === "M" || ''} onChange={handleChange} />
              Mashkull
            </label>
            <label>
              <input type="radio" name="Gjinia" value="F" checked={studenti.Gjinia === "F" || ''} onChange={handleChange} />
              Femër
            </label>
          </div>
        </div>

        <div className="input-label">
          <label>Email Privat <span>*</span></label>
          <input type="email" name="EmailPrivat" value={studenti.EmailPrivat || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Vendlindja <span>*</span></label>
          <input type="text" name="Vendlindja" value={studenti.Vendlindja || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Data e Lindjes <span>*</span></label>
          <input type="date" name="Data_Lindjes" value={studenti.Data_Lindjes?.slice(0,10) || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Adresa <span>*</span></label>
          <input type="text" name="Adresa" value={studenti.Adresa || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Kontakt</label>
          <input type="text" name="NrTel" value={studenti.Nr_Tel || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <label>Fakulteti <span>*</span></label>
          <select name="FakultetiID" value={studenti.FakultetiID || ''} onChange={handleChange} required>
            <option value="" disabled>Zgjedh Fakultetin</option>
            {fakultetet.map((fk) => (
              <option key={fk.FakultetiID} value={fk.FakultetiID}>
                {fk.Emri}
              </option>
            ))}
          </select>
        </div>

        <div className="input-label">
          <label>Niveli <span>*</span></label>
          <select name="Niveli" value={studenti.Niveli || ''} onChange={handleChange} required>
            <option disabled>Niveli</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        <div className="input-label">
          <label>Statusi <span>*</span></label>
          <select name="Statusi" value={studenti.Statusi|| ''} onChange={handleChange} required>
            <option disabled>Statusi</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Deaktiv">Deaktiv</option>
          </select>
        </div>

        <div className="input-label">
          <button id="updateBtn" className="btn btn-primary" type="submit">Ruaj Ndryshimet</button>
        </div>

      </form>
    </div>
  );
}

export default StudentsEdit;
