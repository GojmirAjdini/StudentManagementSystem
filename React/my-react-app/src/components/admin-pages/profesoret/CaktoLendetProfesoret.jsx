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
import CircularProgress from "@mui/material/CircularProgress";

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function CaktoLendetProf() {
    
  
  const text = <p  style={{marginLeft:'5px'
  }}>
    <strong>Vërejtje!</strong> Së pari duhet të zgjedhni Profesorin.</p>

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState(text);
    const [loading, setLoading] = useState(false);

    const [lendet, setLendet] = useState([]);
    const [profesoret, setProfesoret] = useState([]);
    const [LendaID, setLendaID] = useState('');
    const [ProfesoriID, setProfesoriID] = useState('');
    const [selectedProfesori, setSelectedProfesori] = useState('');
    const [selectedFakulteti, setSelectedFakulteti] = useState('');
    const [assignedLendet, setAssignedLendet] = useState([]);

    const handleReset = () => {

        setLendaID('');
        setProfesoriID('');
        setAssignedLendet([]);
        setSelectedProfesori('');
        setSelectedFakulteti('');
    }
    const handleClose = () => {
        setInfoMessage('');
    }

    const fakultetiOptions = selectedProfesori && selectedProfesori.Fakulteti?
    selectedProfesori.Fakulteti.split(',').map(f => f.trim())
    : [];

    const skaFakultet = fakultetiOptions.length === 0;

    useEffect (() =>{
        
        fetchLendet();
        fetchProfesoret();
        
    },[]);

    const fetchAssignedLendet = async (ProfesoriID) => {
        try {
            const response = await axiosInstance.get(`admin/profesoret-lendet/read/${ProfesoriID}`);
            console.log(response.data);
            setAssignedLendet(response.data);
        } catch (err) {
            console.error(err);
}
}
    
    const fetchLendet = async() =>{

        try{

            const response = await axiosInstance.get(`admin/lendet/all`);

           console.log(response.data);
           setLendet(response.data);
        
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

        if(!LendaID || !ProfesoriID){

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
}   setLoading(true);
        try{
            const response = await axiosInstance.post(`admin/profesoret/assign`,{
                LendaID: LendaID,
                ProfesoriID: ProfesoriID,

                });

        console.log(response.data.message);

        setTimeout(() => {
        setSuccessMessage(response.data.message);

        setTimeout(() => {
          setSuccessMessage('')
        },5000);

        },1000);
      }catch(err){

            console.error(err);
            setTimeout(() => {
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
         }},1000);
        
    }finally{
      setTimeout(() =>{
        setLoading(false);
      },1000);
    }
}

    return (

        <div className="containerProfLnd" id="fadeInPage">

        <h1 id="profLndH1">CAKTO LËNDËT DHE PROFESORËT</h1>

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
        width:'100%'
      },
    }}

      getOptionLabel={(option) => `Prof. ${option.Emri} ${option.Mbiemri} - ${option.Titulli_Akademik}`}
      value={selectedProfesori || null}
      onChange={(event, newValue) => {
        setSelectedProfesori(newValue);
        setProfesoriID(newValue ? newValue.ProfesoriID : '');
       
        if(newValue) {
          fetchAssignedLendet(newValue.ProfesoriID);
          setLendaID(''); 
        } else {
          setAssignedLendet([]);
          setLendaID('');
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
              options={fakultetiOptions || []}
              sx={{
                fontFamily: "Montserrat",
                ".MuiInputBase-root": {
                  borderRadius: "10px",
                  fontFamily: "Montserrat",
                },
              }}
              
              value={selectedFakulteti || null}
              onChange={(event, newValue) => {
                setSelectedFakulteti(newValue || '');
                setLendaID(null); 
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Zgjedh Fakultetin"
                  variant="outlined"
                  required
                  error={skaFakultet ? "Profesori duhet të jetë të paktën në një fakultet!" : ''}
                  helperText={skaFakultet ? "Profesori duhet të jetë të paktën në një fakultet!" : ''}
                  sx={{
                    fontFamily: "Montserrat",
                    '& .MuiInputBase-input::placeholder': { fontFamily: 'Montserrat' },
                    '& .MuiInputLabel-root': { fontFamily: 'Montserrat' },
                  }}
                />
              )}
              disableClearable={false}
              clearOnEscape
              disabled={!selectedProfesori || skaFakultet}
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
            ? lendet.filter(lnd => lnd.Fakulteti === selectedFakulteti)
          : []
      }
        getOptionLabel={(option) => `${option.Emri_Lendes} - Semestri ${option.Semestri}`}
        value={lendet.find(lnd => lnd.LendaID === LendaID) || null}
        onChange={(event, newValue) => {
          setLendaID(newValue ? newValue.LendaID : '');
        }}
        renderOption={(props, option) => {
          const isAssigned = assignedLendet.some(assigned => assigned.LendaID === option.LendaID);

          
          return (
            <MenuItem {...props} key={option.LendaID} 
            style={{ 
            fontFamily: 'Montserrat',
            color: isAssigned ? 'red' : 'inherit',
            position:'relative',
            width: '150%',
            
            }} 
            disabled={isAssigned}>
             
              {option.Emri_Lendes} - Semestri {option.Semestri} {isAssigned ? "(Ligjëron tashmë)" : ""}
           
            </MenuItem>
             
        );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Zgjedh Lëndën"
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
        disabled={!selectedFakulteti}
        disableClearable={false}
        isOptionEqualToValue={(option, value) => option.LendaID === value.LendaID}
        clearOnEscape
      />
    </FormControl>

</div>

    <div className="input-labelProfLnd">
        <Button variant="contained" id="primaryBtnProfLenda" sx={{textTransform:'none', fontFamily:'Montserrat'}}
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loading} type="submit">Cakto</Button>
        <Button variant="contained" sx={{textTransform:'none', fontFamily:'Montserrat',}}
        id="resetBtnProfLenda" type='button' onClick={handleReset}>Reset</Button>
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

export default CaktoLendetProf; 