import React, {useState, useEffect} from "react";
import './assets/CaktoLendetProfesoret.css';
import './assets/RegisterProfesoret.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import Cancel from "@mui/icons-material/Cancel";

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function CaktoFakultetin() {
    
  
  const text =<p><span style={{marginLeft:'5px'
  }}>
    Vërejtje! </span> Së pari duhet të zgjedhni Profesorin.</p>

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState(text);

    const [fakultetet, setFakultetet] = useState([]);
    const [profesoret, setProfesoret] = useState([]);
    const [FakultetiID, setFakultetiID] = useState('');
    const [ProfesoriID, setProfesoriID] = useState('');
    const [selectedProfesori, setSelectedProfesori] = useState('');
    const [assignedFakultetet, setAssignedFakultetet] = useState([]);

    const handleReset = () => {

        setFakultetiID('');
        setProfesoriID('');
        setAssignedFakultetet([]);
        setSelectedProfesori('');
       
    }
    const handleClose = () => {
        setInfoMessage('');
    }

    useEffect (() =>{
        
        fetchFakultetet();
        fetchProfesoret();
        
    },[]);

    const fetchAssignedFakultetet = async (ProfesoriID) => {
        try {
            const response = await axiosInstance.get(`admin/profesoret-fakultetet/read/${ProfesoriID}`);
            console.log(response.data);
            setAssignedFakultetet(response.data);
        } catch (err) {
            console.error(err);
}
}
    
    const fetchFakultetet = async() =>{

        try{

            const response = await axiosInstance.get(`admin/fakultetet/all`);

           console.log(response.data);
           setFakultetet(response.data);
        
        }catch(err){
            console.error(err);
        }
    }

    const fetchProfesoret = async () =>{

        try{

            const response = await axiosInstance.get(`admin/profesoret/all`);

            console.log(response.data);
            setProfesoret(response.data);
       
        }catch(err){
            console.error(err);
        }

    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!FakultetiID || !ProfesoriID){

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
}
        try{
            const response = await axiosInstance.post(`admin/profesoret/cakto-fakultetin`,{
                FakultetiID: FakultetiID,
                ProfesoriID: ProfesoriID,

                });

        console.log(response.data.message);

        setSuccessMessage(response.data.message);

        setTimeout(() => {setSuccessMessage('')},5000);

        }catch(err){

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

    return (

        <div className="containerProfLnd" id="fadeInPage">

        <h1 id="profLndH1">CAKTO FAKULTETIN PËR PROFESORËT</h1>

        <form className="formProfLnd" onSubmit={handleSubmit}>

<div className="selectForProfesoretLendet">

<FormControl fullWidth required >
     <Autocomplete
      options={profesoret}

    sx={{
      fontFamily: "Montserrat",
      ".MuiInputBase-root": {
        borderRadius: "10px",
        fontFamily: "Montserrat",
      },
    }}

      getOptionLabel={(option) => `Prof. ${option.Emri} ${option.Mbiemri} - ${option.Titulli_Akademik} - ${option.Fakulteti ? option.Fakulteti : ''}`}
      value={selectedProfesori || null}
      onChange={(event, newValue) => {
        setSelectedProfesori(newValue);
        setProfesoriID(newValue ? newValue.ProfesoriID : '');
        if(newValue) {
          fetchAssignedFakultetet(newValue.ProfesoriID);
          setFakultetiID(''); 
        } else {
          setAssignedLendet([]);
          setFakultetiID('');
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Zgjedh Profesorin"
          variant="outlined"
          required
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
      isOptionEqualToValue={(option, value) => option.ProfesoriID === value.ProfesoriID}
      clearOnEscape
  />
  </FormControl>

  <FormControl fullWidth required>
        <Autocomplete

        sx={{
      fontFamily: "Montserrat",
      ".MuiInputBase-root": {
        borderRadius: "10px",
        fontFamily: "Montserrat",
      },
    }}
        options={
        selectedProfesori
    ? fakultetet.filter(fkt => 
        !assignedFakultetet.some(assigned => assigned.FakultetiID === fkt.FakultetiID)
      )
    : []
}
        getOptionLabel={(option) => `${option.Emri} Niveli - ${option.Niveli}`}
        value={fakultetet.find(fkt => fkt.FakultetiID === FakultetiID) || null}
        onChange={(event, newValue) => {
          setFakultetiID(newValue ? newValue.FakultetiID : '');
        }}
        
        renderInput={(params) => (
          <TextField
            {...params}
            label="Zgjedh Fakultetin"
            variant="outlined"
            required
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
        disabled={!selectedProfesori}
        disableClearable={false}
        isOptionEqualToValue={(option, value) => option.FakultetiID === value.FakultetiID}
        clearOnEscape
      />
    </FormControl>

</div>

    <div className="input-labelProfLnd">
        <Button variant="contained" id="primaryBtnProfLenda"  type="submit">Cakto</Button>
        <Button variant="contained" id="resetBtnProfLenda"  type='button' onClick={handleReset}>Reset</Button>
        </div>
        </form>

        {successMessage && (
        <div id="successMsgLndProf" className="fade-in" role="alert">
         <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 

      
        {infoMessage && (
        <div id="infoMessageLndProf" role="alert">
          <Cancel color="action" sx={{position:'absolute', right:'0px', top:'2px', 
            height:'18px', ":hover":{color:'black', cursor:'pointer'}}} onClick={handleClose}/>
         <Alert sx={{paddingTop:'12px', paddingRight:'40px', paddingBottom:'0px' }} severity="info">{infoMessage} </Alert>
         
        </div>  
      )} 

        </div>

    )
}

export default CaktoFakultetin; 