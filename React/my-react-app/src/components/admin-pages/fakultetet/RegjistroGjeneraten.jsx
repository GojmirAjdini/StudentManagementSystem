import React, {useState, useEffect} from "react";
import './assets/CaktoSemestrin.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";

function RegjistroGjeneraten() {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [viti_Gjenerates, setViti_Gjenerates] = useState('');
    const [loading, setLoading] = useState(false);
    const [fakultetiID, setFakultetiID] = useState('');
    const [vitiAkademikID, setVitiAkademikID] = useState('');
    const [vitetAkademike, setVitetAkademike] = useState([]);
    const [fakultetet, setFakultetet] = useState([]);

    const handleReset = () => {

      setViti_Gjenerates('');
      setFakultetiID('');
      setVitiAkademikID('');
       
    }

    useEffect (() =>{
        
        fetchVitetAkademike();
        fetchFakultetet();
        
    },[]);
    
 const fetchVitetAkademike = async () =>{

      try{
        const response = await axiosInstance.get("admin/vitet/akademike/all");

        console.log(response.data);
        setVitetAkademike(response.data);
      }catch(err){

        console.error(err);
      }
    }

    const fetchFakultetet = async () =>{

      try{
        const response = await axiosInstance.get("admin/fakultetet/all");

        console.log(response.data);
        setFakultetet(response.data);
      }catch(err){

        console.error(err);
      }
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!viti_Gjenerates || !fakultetiID || !vitiAkademikID  ){

            await Swal.fire ({
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
}     setLoading(true);
        try{
            const response = await axiosInstance.post(`admin/register/gjeneratat`,{
                
                Viti_Gjenerates: viti_Gjenerates,
                FakultetiID: fakultetiID,
                VitiAkademikID: vitiAkademikID,

                });
        
        setTimeout(() => {
     
        setSuccessMessage(response.data.message);

        setTimeout(() => {setSuccessMessage('')
        
        },5000);
        
      }, 1000);

        }catch(err){

            console.error(err);
            if  (err.response && err.response.data && err.response.data.message) {
            
            setTimeout(()  =>{

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
            },1000);
          }
    }
    finally{
      setTimeout(() => {
          setLoading(false);
      }, 1000);
    }
}

    return (

        <div className="containerSemestri" id="fadeInPage">

        <h1 id="semesterH1">REGJISTRO GJENERATËN</h1>

        <form className="formSemestri" onSubmit={handleSubmit}>

        <div className="input-label">
        <label htmlFor="">Viti i gjeneratës <span>*</span></label>
        <input className="form-control" style={{height:'50px', border:'1px solid rgb(190, 190, 190)', borderRadius:'10px', fontFamily:'Montserrat'}} 
        required type="text" placeholder="YYYY/YYYY" value={viti_Gjenerates} 
        onChange={(e) => setViti_Gjenerates(e.target.value)} />
        </div>

       <div className="input-label">
     <br />
  <Autocomplete
   sx={{

      fontFamily: "Montserrat",
      ".MuiInputBase-root": { height:"50px",
        borderRadius: "10px",
        fontFamily: "Montserrat",
      },
    }}
    
    value={vitetAkademike.find((v) => v.VitiAkademikID === vitiAkademikID) || null}
    options={vitetAkademike}
    getOptionLabel={(option) => option.VitiAkademik || ''} 
    onChange={(event, newValue) => {
      setVitiAkademikID(newValue ? newValue.VitiAkademikID : '');
      
    }}
    renderInput={(params) => (
      <TextField
        {...params}

        label="Zgjedh Vitin Akademik"
        variant="outlined"
        sx={{ fontFamily: "Montserrat", 
            '& .MuiInputBase-input::placeholder': {
                fontFamily: 'Montserrat',
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Montserrat',
              },
           }}
      />
    )}
    noOptionsText="Nuk ka të dhëna"
      disableClearable={false}
      isOptionEqualToValue={(option, value) => option.VitiAkademikID === value.VitiAkademikID}
      clearOnEscape
  />
</div>

     <div className="input-label">
  <br />
  <Autocomplete
  
   sx={{
      fontFamily: "Montserrat",
      ".MuiInputBase-root": { height:"50px",
        borderRadius: "10px",
        fontFamily: "Montserrat",
      },
    }}
    value={fakultetet.find((f) => f.FakultetiID === fakultetiID) || null}
    options={fakultetet}
    getOptionLabel={(option) => 
      `${option.Emri} - ${option.Niveli}`} 
    onChange={(event, newValue) => {
      setFakultetiID(newValue ? newValue.FakultetiID : ''); 
       
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        
        label="Zgjedh Fakultetin"
        variant="outlined"
        sx={{ fontFamily: "Montserrat",  
            '& .MuiInputBase-input::placeholder': {
                fontFamily: 'Montserrat',
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Montserrat',
              },
           }}
      />
    )}

      disableClearable={false}
      isOptionEqualToValue={(option, value) => option?.FakultetiID === value?.FakultetiID}
      clearOnEscape
  />
</div>


    <div className="input-labelSemestri">
        <Button variant="contained" id="primaryBtnSemestri" 
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loading} sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        type="submit">Regjistro</Button>
        <Button sx={{textTransform:'none', fontFamily:'Montserrat'}}
        variant="contained" id="resetBtnSemestri"  type='button' onClick={handleReset}>Reset</Button>
        </div>
        </form>

        {successMessage && (
        <div id="successMsgLndProf" className="fade-in" role="alert">
         <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 

        </div>

    )
}

export default RegjistroGjeneraten; 