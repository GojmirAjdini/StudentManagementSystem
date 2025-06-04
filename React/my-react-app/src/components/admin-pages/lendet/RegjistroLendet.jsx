import {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './assets/LendaRegister.css';
import { useParams } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import Loading from "../login-register/utils/Loading";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CircularProgress } from "@mui/material";


function RegjistroLendet() {

    const [EmriLendes, setEmriLendes] = useState('');
    const [KodiLendes, setKodiLendes] = useState('');
    const [ECTS, setECTS] = useState('');
    const [SemestriID, setSemestriID] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [semestrat, setSemestrat] = useState([]);

    const handleReset = () => {
        setEmriLendes('');
        setKodiLendes('');
        setECTS('');
        setSemestriID('');

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

        if(!EmriLendes || !KodiLendes || !ECTS || !SemestriID){
            
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
        setLoading(true);
        try{
            const response = await axiosInstance.post(`admin/lendet/submit`,{
                
                Emri_Lendes: EmriLendes,
                ECTS: ECTS,
                Kodi_Lendes: KodiLendes,
                SemestriID: SemestriID,
        });
            
            console.log(response.data);

            setTimeout(() => {
                setSuccessMessage(response.data.message);
                setTimeout(() =>{
                setSuccessMessage('');
                }, 5000);  

            },1000);
                     
        }
        catch(err){
            console.error("Error krijimi i lendes", err);
            setTimeout(() => {
              
            setWarningMessage(err.response.data.message);

            setTimeout(() => {
                setWarningMessage('');
            }, 3000);
          },1000);

        }finally{
         setTimeout(() => {
         setLoading(false);
        },1000);
}
    }
    useEffect(() => {   
        
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
        <label htmlFor="">ECTS <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Kredi" value={ECTS} onChange={(e) => setECTS(e.target.value)} />
        </div>

      <div className="input-label">
        <br />

        <Autocomplete
        style={{fontFamily:"Montserrat"}}
        fullWidth
        options={semestrat}
        getOptionLabel={(sms) =>
          `${sms.Fakulteti} - ${sms.Afati_Semestrit.split(' ')[0]} ${sms.NrSemestrit} - ${sms.NiveliStudimit} - ${sms.Viti_Gjenerates}`
        }
        sx={{
          fontFamily: "Montserrat",
          ".MuiInputBase-root": {
            borderRadius: "10px",
            height:"40px",
            fontFamily: "Montserrat",
          },
        }}
         ListboxProps={{

          style: {
            maxHeight: "200px",
            overflowY:"auto"
          }
         }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Zgjedh Fakultetin/Semestrin"
            required
            sx={{ 
              marginTop:"-5px",
              paddingTop:'6px',
              fontFamily: "Montserrat",
              '& .MuiInputBase-input::placeholder': {
              fontFamily: 'Montserrat',
            },
            '& .MuiInputLabel-root': {
              fontFamily: 'Montserrat',
            },
             }}
          />
        )}
        value={semestrat.find((s) => s.Semestri_ID === SemestriID) || null}
        onChange={(e, newValue) => {
          setSemestriID(newValue ? newValue.Semestri_ID : '');
        }}
        isOptionEqualToValue={(option, value) => option.Semestri_ID === value.Semestri_ID}
      />
      </div>
        <div className="input-labelLnt">
        <Button variant="contained" loading={loading} 
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25} />}
        id="primaryBtnLnt" className="btn btn-primary" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        type="submit">Regjistro</Button>
        
        <Button variant="contained" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        id="resetBtnLnt" className="btn btn-secondary" type="button" onClick={handleReset}>Reset</Button>
        </div>

        </form>
    
        {(successMessage || warningMessage) && (
        <div id="successMsgLenda" className="fade-in" role="alert">
         <Alert severity={successMessage ? "success" : 'warning'}>{successMessage || warningMessage}</Alert> 
            </div>
        )}
        </div>
    )
}

export default RegjistroLendet;