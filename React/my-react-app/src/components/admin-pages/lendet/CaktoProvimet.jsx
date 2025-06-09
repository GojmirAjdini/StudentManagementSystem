import React, {useState, useEffect} from "react";
import Swal from "sweetalert2";
import './assets/CaktoProvimet.css';
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import Cancel from "@mui/icons-material/Cancel";
import CircularProgress  from "@mui/material/CircularProgress";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function CaktoProvimet() {
    
  
  const text =<p style={{marginLeft:'5px'
  }}>
    <strong>Vërejtje!</strong>  Së pari duhet të zgjedhni Lëndën.</p>

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState(text);
    const [loading, setLoading] = useState(false);

    const [lendet, setLendet] = useState([]);
    const [lendaID, setLendaID] = useState('');
    const [periudhaProvimeveID, setPeriudhaProvimeveID] = useState('');
    const [periudhat, setPeriudhat] = useState([]);
    const [dataProvimit, setDataProvimit] = useState('');
    const [selectedLenda, setSelectedLenda] = useState(null);
    const [assignedExams, setAssignedExams] = useState([]);

   const handleReset = () => {
      
      setSelectedLenda(null);
      setLendaID('');
      setSuccessMessage('');
      setInfoMessage(text);
      setPeriudhaProvimeveID('');
  
    };
    
    const handleClose = () => {
        setInfoMessage('');
    }

    useEffect (() =>{
        
        fetchLendet();
        fetchPeriudhat();
        fetchAssignedExams();
        
    },[]);

    const fetchAssignedExams = async () =>{

      try{

        const response = await axiosInstance.get("admin/provimet/all");

        setAssignedExams(response.data.map(e => e.LendaID));
        console.log(assignedExams);
      }
      catch(err){
        console.error(err);
      }
    }

    const fetchLendet = async () =>{

        try{
            const response = await axiosInstance.get(`admin/lendet/all`);
            
            setLendet(response.data);
            console.log(response.data);
        
        } catch(err){
            console.error("Error fetching lendet", err); 
        }
    }

    
    const fetchPeriudhat = async () =>{

        try{
            const response = await axiosInstance.get(`admin/periudhat-provimeve`);
            
            setPeriudhat(response.data);
            console.log(response.data);
        
        } catch(err){
            console.error("Error fetching lendet", err); 
        }
    }
    
    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!lendaID){

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
}       setLoading(true);
        try{    
            const response = await axiosInstance.post(`admin/provimet/register`,{
                LendaID: lendaID,
                data_Provimit: dataProvimit,
                PeriudhaID: periudhaProvimeveID

                });

        setTimeout(() =>{
        setSuccessMessage(response.data.message);

        setTimeout(() => {setSuccessMessage('')},5000);
        },1000)
        }catch(err){

            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                  
             console.log(err.response.data.message);
            setTimeout(() =>{
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
         },1000)
      }
  }finally{
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }
}

    return (

        <div className="containerProfLnd" id="fadeInPage">

        <h1 id="profLndH1">CAKTO PROVIMET</h1>

        <form className="formProfLnd" onSubmit={handleSubmit}>

<div className="selectForProfesoretLendet">

<FormControl fullWidth required >
     <Autocomplete
      options={lendet}
      getOptionDisabled={(option) => assignedExams.includes(option.LendaID)}
    sx={{
      fontFamily: "Montserrat",
      ".MuiInputBase-root": {
        borderRadius: "10px",
        fontFamily: "Montserrat",
        height:'50px'
      },
    }} 

      getOptionLabel={(option) => `${option.Emri_Lendes} - ${option.Fakulteti} - Semestri ${option.Semestri}`}
      value={selectedLenda}
      onChange={(event, newValue) => {
        setSelectedLenda(newValue);
        setLendaID(newValue ? newValue.LendaID : '');
    
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
      disableClearable={false}
      isOptionEqualToValue={(option, value) => option.LendaID === value.LendaID}
      clearOnEscape
  />
  </FormControl>

</div>

<div className="selectForPeriudhaLendet">
<label htmlFor="">Zgjedh datën e provimit <span>*</span></label>

   <input type="date" value={dataProvimit} onChange={(e) => setDataProvimit(e.target.value)} 
   placeholder="Zgjedh datën" style={{height:'50px', padding:'10px', border:'1px solid rgb(201, 201, 201)'}} required/>

</div>

<div className="selectForPeriudhaLendet">
  <label htmlFor="periudha">Zgjedh periudhën <span>*</span></label>
  <select
    id="periudha" 
    value={periudhaProvimeveID}
    onChange={(e) => setPeriudhaProvimeveID(Number(e.target.value))}
    style={{ height: '50px', padding: '10px', borderRadius:'10px', border:'1px solid rgb(202, 202, 202)'}}
    required
  >
    <option disabled value="">Zgjedh një periudhë</option>
    {periudhat.map((p) => (
      <option key={p.PeriudhaID} value={p.PeriudhaID}>
        {p.EmriPeriudhes} ({p.VitiAkademik})
      </option>
    ))}
  </select>
</div>


    <div className="input-labelProvimiPeriudha">
        <Button variant="contained" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loading} id="primaryBtnProvimi" sx={{textTransform:'none', fontFamily:'Montserrat',}} 
        type="submit">Cakto</Button>
        <Button variant="contained" sx={{textTransform:'none', fontFamily:'Montserrat',}}
         id="resetBtnProvimi"  type='button' onClick={handleReset}>Reset</Button>
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

export default CaktoProvimet; 