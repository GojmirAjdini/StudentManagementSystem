import { useState, useEffect } from "react";  
import Swal from "sweetalert2";
import axios from "axios";
import './assets/FakultetiRegister.css';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import axiosInstance from "../../../services/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";

function RegjistroFakultetin() {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [Emri, setEmri] = useState('');
    const [Niveli, setNiveli] = useState('');
    const [Lokacioni, setLokacioni] = useState('');
    const [loading, setLoading] = useState(false);
    const [Kodi_Fakultetit, setKodi_Fakultetit] = useState('');
    const [nivelet, setNivelet] = useState([]);

    const handleReset = () => {
        setEmri('');
        setNiveli('');
        setLokacioni('');
        setKodi_Fakultetit('');
        setNivelet([]);
    };  

    useEffect(() =>{

        fetchNivelet();
    },[])

    const fetchNivelet = async () =>{

        try{

            const response = await axiosInstance.get("admin/nivelet-studimit");

            console.log(response.data.nivelet);
            setNivelet(response.data.nivelet);
        }catch(err){
            console.error(err);
        }
    }


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
        
        setLoading(true);
            try{
                const response = await axiosInstance.post(`admin/fakultetet/submit`,{
                    Emri: Emri,
                    Niveli: Niveli,
                    Lokacioni: Lokacioni,
                    Kodi_Fakultetit: Kodi_Fakultetit,
            }, );
            
                console.log(response.data);

                setTimeout(() => {
                setSuccessMessage(response.data.message);
                setTimeout(() =>{
                setSuccessMessage('');
                }, 5000);  

            },1000);      
            }
            catch(err){
                console.error("Error krijimi i fakultetit", err);
                setSuccessMessage('Ka ndodhur nje gabim!');

                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            }finally{
                setTimeout(() => {
                setLoading(false);
                },1000);
                
            }
        }

    return (

        <div id="fadeInPage" className="container">

            <h1 id="fakultetiH1">REGJISTRO FAKULTETIN</h1>
            
            <form id="formFakulteti" onSubmit={submitFakulteti} action="">

            <div className="input-label">
            <label htmlFor="">Emri <span>*</span></label>
            <input className="form-control" required type="text" placeholder="Emri i Fakultetit" value={Emri} onChange={(e) => setEmri(e.target.value)} />
            </div> 

            <div className="input-label">
             <label htmlFor="">Niveli<span> *</span></label>
            <select className="form-select" required value={Niveli} onChange={(e) => setNiveli(e.target.value)}>
            <option value="" disabled>Zgjedh Nivelin</option>
            {nivelet.map((nv) => (
            <option key={nv.NiveliID} value={nv.NiveliID}>
                {nv.Emri_Nivelit}
            
            </option>
            ))}
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
                <Button variant="contained" id="primaryBtnFkt" type="submit" 
                loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loading} >
                    Regjistro
                </Button>
                <Button variant="contained" id="resetBtnFkt" type='button'  onClick={handleReset}>Reset</Button>
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