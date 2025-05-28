import React, {useState, useEffect} from "react";
import './assets/CaktoSemestrin.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel  from "@mui/material/InputLabel";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";

function CaktoSemestrin() {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [afatiSemestrit, setAfatiSemestri] = useState('');
    const [loading, setLoading] = useState(false);
    const [nr_Semestrit, setNrSemestrit] = useState('');
    const [vitiAkademikID, setVitiAkademikID] = useState('');
    const [gjenerataID, setGjenerataID] = useState('');
    const [vitetAkademike, setVitetAkademike] = useState([]);
    const [gjeneratatFakultetet, setGjeneratatFakultetet] = useState([]);
    const [selectedVitiAkademik, setSelectedVitiAkademik] = useState(null);
    const [selectedGjenerata, setSelectedGjenerata] = useState(null);


    const handleReset = () => {

      setAfatiSemestri('');
      setGjenerataID('');
      setVitiAkademikID('');
      setGjenerataID('');
      setSelectedGjenerata(null);
      setSelectedVitiAkademik(null);
      setNrSemestrit('');
       
    }

    useEffect (() =>{
        
        fetchVitetAkademike();
        fetchGjeneratatFakultetet();
        
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

    const fetchGjeneratatFakultetet = async () =>{

      try{
        const response = await axiosInstance.get("admin/gjeneratat");

        console.log(response.data.gjenerata);
        setGjeneratatFakultetet(response.data.gjenerata);
      }catch(err){

        console.error(err);
      }
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!afatiSemestrit || !nr_Semestrit || !vitiAkademikID || !gjenerataID ){

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
            const response = await axiosInstance.post(`admin/semestri/register`,{
                
                Afati_Semestrit: afatiSemestrit,
                Nr_Semestrit: nr_Semestrit,
                VitiAkademikID: vitiAkademikID,
                GjenerataID: gjenerataID

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

        <h1 id="semesterH1">CAKTO SEMESTRIN</h1>

        <form className="formSemestri" onSubmit={handleSubmit}>

    <div className="input-label">
        <br />

        <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
         <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh Numrin e Semestrit</InputLabel>
         <Select
      
           labelId="StatusiStudent-label"
           id="select-StatusiStudent"
           value={nr_Semestrit}
           label="Zgjedh Numrin e Semestrit"
           sx={{
            fontFamily:"Montserrat", 
            borderRadius:'10px', 
            height:'45px', 
           }}
           onChange={(e) => setNrSemestrit(e.target.value)}
    
           MenuProps={{
             PaperProps: {
               style: {
                 maxHeight: 200,
                 overflowY: 'auto'
               },
             },
           }}
         >
           <MenuItem sx={{fontFamily:"Montserrat"}} disabled>
             Zgjedh Semestrin
           </MenuItem>
             <MenuItem  value={1} sx={{fontFamily:'Montserrat'}} >
             Semestri 1 
             </MenuItem>
             <MenuItem  value={2} sx={{fontFamily:'Montserrat'}} >
             Semestri 2 
             </MenuItem>
             <MenuItem  value={3} sx={{fontFamily:'Montserrat'}} >
             Semestri 3 
             </MenuItem>
             <MenuItem  value={4} sx={{fontFamily:'Montserrat'}} >
             Semestri 4 
             </MenuItem>
             <MenuItem  value={5} sx={{fontFamily:'Montserrat'}} >
             Semestri 5 
             </MenuItem>
             <MenuItem  value={6} sx={{fontFamily:'Montserrat'}} >
             Semestri 6 
             </MenuItem>
             <MenuItem  value={7} sx={{fontFamily:'Montserrat'}} >
             Semestri 7 
             </MenuItem>
             <MenuItem  value={8} sx={{fontFamily:'Montserrat'}} >
             Semestri 8 
             </MenuItem>
             
         </Select>
       </FormControl>
       </div>   

     <div className="input-label">
        <br />

        <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
         <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh Afatin</InputLabel>
         <Select
      
           labelId="StatusiStudent-label"
           id="select-StatusiStudent"
           value={afatiSemestrit}
           label="Zgjedh Afati"
           sx={{
            fontFamily:"Montserrat", 
            borderRadius:'10px', 
            height:'45px', 
           }}
           onChange={(e) => setAfatiSemestri(e.target.value)}
    
           MenuProps={{
             PaperProps: {
               style: {
                 maxHeight: 200,
                 overflowY: 'auto'
               },
             },
           }}
         >
           <MenuItem sx={{fontFamily:"Montserrat"}} disabled>
             Zgjedh Afatin
           </MenuItem>
             <MenuItem  value="Semestri dimeror" sx={{fontFamily:'Montserrat'}} >
             Semestri dimeror 
             </MenuItem>
             <MenuItem  value="Semestri veror" sx={{fontFamily:'Montserrat'}} >
             Semestri veror 
             </MenuItem>
         </Select>
       </FormControl>
       </div>  

       <div className="input-label">
     <br />
  <Autocomplete
   sx={{
      fontFamily: "Montserrat",
      ".MuiInputBase-root": {
        borderRadius: "10px",
        fontFamily: "Montserrat",
      },
    }}
    value={selectedVitiAkademik}
    options={vitetAkademike}
    getOptionLabel={(option) => option.VitiAkademik || ''} 
    onChange={(event, newValue) => {
      setVitiAkademikID(newValue ? newValue.VitiAkademikID : '');
      setSelectedVitiAkademik(newValue); 
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
      ".MuiInputBase-root": {
        borderRadius: "10px",
        fontFamily: "Montserrat",
      },
    }}
    value={selectedGjenerata}
    options={gjeneratatFakultetet}
    getOptionLabel={(option) => 
      option.Fakulteti + ' - ' + option.NiveliStudimit + ' - ' + 
      'Gjenerata - ' +  option.Viti_Gjenerates || ''} 
    onChange={(event, newValue) => {
      setGjenerataID(newValue ? newValue.GjenerataID : ''); 
      setSelectedGjenerata(newValue); 
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        
        label="Zgjedh Fakultetin/Gjeneratën"
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
      isOptionEqualToValue={(option, value) => option.GjenerataID === value.gjenerataID}
      clearOnEscape
  />
</div>


    <div className="input-labelSemestri">
        <Button variant="contained" id="primaryBtnSemestri" 
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loading} type="submit">Cakto</Button>
        <Button variant="contained" id="resetBtnSemestri"  type='button' onClick={handleReset}>Reset</Button>
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

export default CaktoSemestrin; 