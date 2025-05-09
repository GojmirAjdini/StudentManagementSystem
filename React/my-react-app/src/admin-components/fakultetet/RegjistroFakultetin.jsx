import { useState, useEffect } from "react";  
import Swal from "sweetalert2";
import axios from "axios";
import './assets/FakultetiRegister.css';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

function RegjistroFakultetin() {

    const API_URL = "http://localhost:3000/";
    
    const [successMessage, setSuccessMessage] = useState('');
    const [Emri, setEmri] = useState('');
    const [Niveli, setNiveli] = useState('');
    const [Lokacioni, setLokacioni] = useState('');
    const [Kodi_Fakultetit, setKodi_Fakultetit] = useState('');

    const handleReset = () => {
        setEmri('');
        setNiveli('');
        setLokacioni('');
        setKodi_Fakultetit('');
    };  


    const submitFakulteti = async(e) =>{

        e.preventDefault();

        if(!Emri || !Niveli || !Lokacioni || !Kodi_Fakultetit){
           await Swal.fire({
                icon: 'error',
                title: 'Fushat e zbrazura!',
                text: 'Ju lutem plotesoni te gjitha fushat!',
                confirmButtonText: 'OK',
            })
            return;
        }
        
            try{
                const response = await axios.post(`${API_URL}admin/fakultetet/submit`,{
                    Emri: Emri,
                    Niveli: Niveli,
                    Lokacioni: Lokacioni,
                    Kodi_Fakultetit: Kodi_Fakultetit
            }, { withCredentials:true});
                console.log(response.data);
                setSuccessMessage(response.data.message);
                
                
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);              
            }
            catch(err){
                console.error("Error krijimi i fakultetit", err);
                setSuccessMessage('Ka ndodhur nje gabim!');

                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            }
        }
    
    return (

        <div id="fadeInPage" className="container">

            <h1>REGJISTRO FAKULTETIN</h1>
            
            <form id="formFakulteti" onSubmit={submitFakulteti} action="">

            <div className="input-label">
            <label htmlFor="">Emri <span>*</span></label>
            <input className="form-control" required type="text" placeholder="Emri i Fakultetit" value={Emri} onChange={(e) => setEmri(e.target.value)} />
            </div> 

                <div className="input-label">
                 <label htmlFor="">Niveli<span> *</span></label>
                <select className="form-select" required value={Niveli} onChange={(e) => setNiveli(e.target.value)} aria-label="Default select example">
                <option disabled value="">Niveli</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                </select>
                    </div>

                <div className="input-label">
            <label htmlFor="">Lokacioni <span>*</span></label>
            <input className="form-control" required type="text" placeholder="Lokacioni" value={Lokacioni} onChange={(e) => setLokacioni(e.target.value)} />
             </div>

                <div className="input-label">
                    <label htmlFor="kodi">Kodi i Fakultetit <span> *</span></label>
                    <input type="text" id="kodi" className="form-control" placeholder="Kodi i Fakultetit" value={Kodi_Fakultetit} onChange={(e) => setKodi_Fakultetit(e.target.value)} required />
                </div>

                <div className="input-labelBtn">
                <Button variant="contained" id="primaryBtnFkt" type="submit">Regjistro</Button>
                <Button variant="contained" id="resetBtnFkt" type='button' onClick={handleReset}>Reset</Button>
                </div>

            </form>
            {successMessage && (
        <div id="successMsgFakulteti" className="fade-in" role="alert">
          <Alert severity="success">{successMessage}</Alert>
        </div>  
      )} 
        </div>
    );
    }
export default RegjistroFakultetin;