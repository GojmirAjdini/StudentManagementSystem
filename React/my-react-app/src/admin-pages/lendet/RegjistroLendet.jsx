import {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './assets/LendaRegister.css';
import { useParams } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../services/axiosInstance";

function RegjistroLendet() {

    const [EmriLendes, setEmriLendes] = useState('');
    const [KodiLendes, setKodiLendes] = useState('');
    const [FakultetiID, setFakultetiID] = useState('');
    const [ECTS, setECTS] = useState('');
    const [SemestriID, setSemestriID] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fakultetet, setFakultetet] = useState([]);
    const [semestrat, setSemestrat] = useState([]);

    const handleReset = () => {
        setEmriLendes('');
        setKodiLendes('');
        setFakultetiID('');
        setECTS('');
    }

    const fakultetetDisponueshme = async() =>{

        try{
            const response = await axiosInstance.get(`admin/fakultetet/all`);
            setFakultetet(response.data);
            console.log(response.data);

        }catch(err){
            console.error("Error fetching fakultetet",err); 
        }
    }

    const semestratDisponueshme = async() =>{
        try{
            const response = await axiosInstance.get(`admin/semestri/all`);
            setSemestrat(response.data); 
            console.log(response.data);
        }
        catch(err){
            console.error("Error fetching semestrat",err);  
        }
    }
    const submitLenda = async(e) =>{    

        e.preventDefault();

        if(!EmriLendes || !KodiLendes || !FakultetiID || !ECTS || !SemestriID){
            
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
            })  
            return;
        }

        try{
            const response = await axiosInstance.post(`admin/lendet/submit`,{
                
                FakultetiID: FakultetiID,
                Emri_Lendes: EmriLendes,
                ECTS: ECTS,
                Kodi_Lendes: KodiLendes,
                SemestriID: SemestriID
        });
            
            console.log(response.data);
            setSuccessMessage(response.data.message);

            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);              
        }
        catch(err){
            console.error("Error krijimi i lendes", err);
            setSuccessMessage('Ka ndodhur nje gabim!');

            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        }
    }
    useEffect(() => {   
        fakultetetDisponueshme();
        semestratDisponueshme();
    }
    ,[]);

    return(
        <div id="fadeInPage" className="container">

            <h1 id="lendaH1">REGJISTRO LËNDËN</h1>

            <form id="formLenda" onSubmit={submitLenda} className="form-container">

        <div className="input-label">
        <label htmlFor="">Emri i Lëndës <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Emri" value={EmriLendes} onChange={(e) => setEmriLendes(e.target.value)} />
        </div> 
       
        <div className="input-label">
        <label htmlFor="">Kodi i Lëndës <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Kodi i Lëndës" value={KodiLendes} onChange={(e) => setKodiLendes(e.target.value)} />
        </div>
        
        <div className="input-label">
        <label htmlFor="">Fakulteti <span>*</span></label>

        <select id="select" className="form-select" value={FakultetiID} onChange={(e) => setFakultetiID(e.target.value)}>
          <option disabled value="">Zgjedh Fakultetin</option>
          {fakultetet.map((fk) => (
            <option key={fk.FakultetiID} value={fk.FakultetiID}>
              {fk.Emri}
            </option>
          ))}
        </select>
        </div>

        <div className="input-label">
        <label htmlFor="">ECTS <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Kredi" value={ECTS} onChange={(e) => setECTS(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Semestri <span>*</span></label>

        <select id="select" className="form-select" value={SemestriID} onChange={(e) => setSemestriID(e.target.value)}>
          <option disabled value="">Zgjedh Semestrin</option>
          {semestrat.map((sms) => (
            <option key={sms.Semestri_ID} value={sms.Semestri_ID}>
              {sms.NrSemestrit + " - " + sms.Afati_Semestrit}
            </option>
          ))}
        </select>
        </div>

        <div className="input-labelLnt">
        <Button variant="contained" id="primaryBtnLnt" className="btn btn-primary" type="submit">Regjistro</Button>
        <Button variant="contained" id="resetBtnLnt" className="btn btn-secondary" type="button" onClick={handleReset}>Reset</Button>
        </div>

        </form>

        {successMessage && (
        <div id="successMsgLenda" className="fade-in" role="alert">
         <Alert severity="success">{successMessage}</Alert> 
            </div>
        )}
        </div>
    )
}

export default RegjistroLendet;