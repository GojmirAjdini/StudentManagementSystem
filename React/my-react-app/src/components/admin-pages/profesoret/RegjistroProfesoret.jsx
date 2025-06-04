import {useState, useEffect} from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import './assets/RegisterProfesoret.css';
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from '../../../services/axiosInstance';
import Loading from '../login-register/utils/Loading';

function RegjistroProfesoret() {
  
    const [successMessage, setSuccessMessage] = useState('');
    const [successEmail, setSuccessEmail] = useState('');
    
    const [Emri, setEmri] = useState('');
    const [Mbiemri, setMbiemri] = useState('');
    const [Gjinia, setGjinia] = useState('');
    const [EmailPrivat, setEmailPrivat] = useState('');
    const [Nr_Tel, setNr_Tel] = useState('');
    const [loading, setLoading] = useState(false);
    const [Data_Punesimit, setData_Punesimit] = useState('');
    const [Statusi, setStatusi] = useState('');
    const [Titulli_Akademik, setTitulli_Akademik] = useState('');

    const handleReset = () => {
        setEmri('');
        setMbiemri('');
        setGjinia('');
        setEmailPrivat('');
        setNr_Tel('');
        setData_Punesimit('');
        setStatusi('');
        setTitulli_Akademik('');
    };

    const submitProfesori = async(e) =>{
        e.preventDefault();

        if(!Emri || !Mbiemri || !Gjinia || !EmailPrivat ||
            !Nr_Tel || !Data_Punesimit || !Statusi || !Titulli_Akademik){
            
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
            
                }    });
            return;
        }
        setLoading(true);
        try{
            const response = await axiosInstance.post(`admin/profesoret/register`, {
                  
                Emri: Emri,
                Mbiemri: Mbiemri,
                Gjinia : Gjinia,
                EmailPrivat : EmailPrivat,
                NrTel : Nr_Tel,
                Data_Punesimit : Data_Punesimit,
                Statusi : Statusi,
                Titulli_Akademik: Titulli_Akademik
            });


        setTimeout(() => {
            setSuccessMessage(response.data.message);
            setSuccessEmail(response.data.emailNotification);

        setTimeout(() => {
             setSuccessMessage('');
             setSuccessEmail('');
           
        },5000);

        },1000);

        }catch(err){
            console.error("Error adding profesori",err); 
        
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
        }finally {
            setTimeout(()=>{
                setLoading(false);
            },1000);
            }
    }

    return (
    <div className='container' id="fadeInPage">

    <h1 id='profH1'>REGJISTRO PROFESORIN</h1>

    <form onSubmit={submitProfesori}>

    <div className="input-label">
    <label htmlFor="">Emri <span>*</span></label>
    <input className="form-control" required type="text" placeholder="Emri" value={Emri} onChange={(e) => setEmri(e.target.value)} />
    </div> 
    
    <div className="input-label">
    <label htmlFor="">Mbiemri <span>*</span></label>
    <input className="form-control" required type="text" placeholder="Mbiemri" value={Mbiemri} onChange={(e) => setMbiemri(e.target.value)} />
    </div>

    <div className="input-label">
    <label htmlFor="">Gjinia <span>*</span></label>
    
    <div id="gjinia" className="form-check ">
    <label className="form-check-label" htmlFor="flexRadioDefault1">
    <input required
    className="form-check-input"
    type="radio"
    name="gjinia"
    value="M"
    checked={Gjinia === "M"}
    onChange={(e) => setGjinia(e.target.value)}
    id="flexRadioDefault1"
    />
    Mashkull
    </label>
    
    <label className="form-check-label" htmlFor="flexRadioDefault2">
    <input required
    className="form-check-input"
    type="radio"
    name="gjinia"
    value="F"
    checked={Gjinia === "F"}
    onChange={(e) => setGjinia(e.target.value)}
    id="flexRadioDefault2"
        />
        Femër
      </label>
      </div>
    </div>

    <div className="input-label">
    <label htmlFor="">Email Privat <span>*</span></label>
    <input className="form-control" required type="email" placeholder="Email Privat" value={EmailPrivat} onChange={(e) => setEmailPrivat(e.target.value)} />
    </div>
    
    <div className="input-label">
    <label htmlFor="">Kontakt</label>
    <input className="form-control" required type="text" placeholder="04X-XXX-XXX" name="Nr_Tel" value={Nr_Tel} onChange={(e) => setNr_Tel(e.target.value)} />
    </div>

    <div className="input-label">
    <label htmlFor="">Data e Punësimit <span>*</span></label>
    <input className="form-control" required type="date" placeholder="Data e Punesimit" value={Data_Punesimit} onChange={(e) => setData_Punesimit(e.target.value)} />
    </div>

    <div className="input-label">
    <label htmlFor="">Statusi <span>*</span></label>
    <select id="select" required className="form-select" value={Statusi} onChange={(e) => setStatusi(e.target.value)}>
      <option disabled value="">Zgjedh Statusin</option>
      <option value="Aktiv">Aktiv</option>
      <option value="Deaktiv">Deaktiv</option>
    </select>
    </div>

    <div className="input-label">
    <label htmlFor="">Titulli Akademik <span>*</span></label>
    <select id="select" required className="form-select" value={Titulli_Akademik} onChange={(e) => setTitulli_Akademik(e.target.value)}>
      <option disabled value="">Zgjedh Titullin</option>
      <option value="BSc">Bachelor</option>
      <option value="cand.MSc">cand.Master</option>
      <option value="MSc">Master</option>
      <option value="cand.PhD">cand.PhD</option>
      <option value="PhD">PhD</option>
    </select>
    </div>

    <div className="input-labelProf">
        <Button sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        variant='contained' id="primaryBtnProf" type="submit" disabled={loading}>Regjistro</Button>
        <Button sx={{textTransform:'none', fontFamily:'Montserrat'}}
        variant='contained' id="resetBtnProf" type='button' disabled={loading} 
        onClick={handleReset}>
            Reset
            </Button>
        </div>
        </form>
        {loading && <Loading/>}
        {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
         <Alert  severity="success">  {successMessage}</Alert>
        </div>  
      )} 

      {successEmail && (
        <div id="successEmail" className="fade-in" role="alert">
         <Alert  severity="success">  {successEmail}</Alert>
        </div>  
      )}  


    
    </div>
)
}

export default RegjistroProfesoret;