import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';
import "./assets/RegjistroAdmin.css";
import axiosInstance from "../../services/axiosInstance";

function RegjistroAdmin() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emri, setEmri] = useState("");
    const [mbiemri, setMbiemri] = useState("");
    const [role, setRole] = useState("");
    const [fakultetet, setFakultetet] = useState([]);
    const [fakultetiID, setFakultetiID] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
   
    const handleReset = () => {
        setEmail("");
        setEmri("");
        setMbiemri("");
        setRole("");
        setPassword("");
        setFakultetiID("");
    };

    const fakultetetDisponueshme = async() =>{

        try{
        const response = await axiosInstance.get(`admin/fakultetet/all`);

        setFakultetet(response.data);
    }catch(err){
        console.error("Error fetching fakultetet",err); 
    }
}

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if(!email && !emri && !mbiemri && !role && !fakultetiID){
            await Swal.fire({
            title: 'Fushat e zbrazura!',
            text: 'Ju lutem plotësoni të gjithë fushat. ',
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor:'#3085d6',
            timer:5000,
            customClass: {
            confirmButton: 'swal-confirmBtn',
            htmlContainer: 'textSwal',
            popup: 'popupDesign',
                  
              }
        });
            
        return; 
                }
        try {
            const response = await axiosInstance.post(`admin/register`, {
                FakultetiID: fakultetiID,
                Email : email,
                Password: password,
                Emri: emri,
                Mbiemri: mbiemri,
                role: role,
                
            });
            
            setSuccessMessage(response.data.message);
            console.log(response.data.emailNotification);
            
             setTimeout(() => setSuccessMessage(''),5000);
            
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

useEffect(() => { 
    fakultetetDisponueshme();


},[]);

return (

    <div className="container" id="fadeInPage">

    <h1 id="adminH1">REGJISTRO ADMIN</h1>

        <form onSubmit={handleSubmit} autoComplete="off" >

        <div className="input-label">
        <label>Emri <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Emri" value={emri} onChange={(e) => setEmri(e.target.value)} />
        </div> 
       
        <div className="input-label">
        <label htmlFor="">Mbiemri <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Mbiemri" value={mbiemri} onChange={(e) => setMbiemri(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email <span>*</span></label>
        <input className="form-control" required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

         <div className="input-label">
        <label htmlFor="">Password <span>*</span></label>
        <input className="form-control" required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
        <label htmlFor="">Role<span> *</span></label>
        <select className="form-select" required value={role} onChange={(e) => setRole(e.target.value)} aria-label="Default select example">
        <option disabled value="">Role</option>
        <option value="admin">admin</option>
        <option value="superadmin">superadmin</option>
        </select>
        </div>

         <div className="input-labelAdmButtons">
          <Button id="primaryBtnAdmin" variant="contained" type="submit">Regjistro</Button>
          <Button id="resetBtnAdmin" variant="contained" type="button" onClick={handleReset}>Reset</Button>
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

export default RegjistroAdmin;