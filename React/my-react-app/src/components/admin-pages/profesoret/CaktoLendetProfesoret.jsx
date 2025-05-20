import React, {useState, useEffect} from "react";
import './assets/CaktoLendetProfesoret.css';
import './assets/RegisterProfesoret.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import InputLabel  from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cancel from "@mui/icons-material/Cancel";

function CaktoLendetProf() {
    
  
  const text =<p><span style={{marginLeft:'5px'
  }}>
    Vërejtje! </span> Së pari duhet të zgjedhni Profesorin.</p>

    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState(text);

    const [lendet, setLendet] = useState([]);
    const [profesoret, setProfesoret] = useState([]);
    const [LendaID, setLendaID] = useState('');
    const [ProfesoriID, setProfesoriID] = useState('');
    const [selectedProfesori, setSelectedProfesori] = useState('');
    const [assignedLendet, setAssignedLendet] = useState([]);

    const handleReset = () => {

        setLendaID('');
        setProfesoriID('');
        setAssignedLendet([]);
    }
    const handleClose = () => {
        setInfoMessage('');
    }

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
}
        try{
            const response = await axiosInstance.post(`admin/profesoret/assign`,{
                LendaID: LendaID,
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

        <h1 id="profLndH1">CAKTO LËNDËT DHE PROFESORËT</h1>

        <form className="formProfLnd" onSubmit={handleSubmit}>

<div className="selectForProfesoretLendet">

    
    <FormControl fullWidth required>
  <InputLabel sx={{fontFamily:"Montserrat"}} id="profesori-label">Zgjedh Profesorin </InputLabel>
  <Select
    labelId="profesori-label"
    id="select-profesori"
    value={ProfesoriID}
    label="Zgjedh Profesori *"
    sx={{fontFamily:"Montserrat"}}
    onChange={(e) => {

      const selectedID = e.target.value;
      const profesori = profesoret.find(prof => prof.ProfesoriID === selectedID);
      setProfesoriID(e.target.value);
      fetchAssignedLendet(e.target.value);
      setSelectedProfesori(profesori);
      
    }}
    MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 200,
          overflowY: 'auto'
        },
      },
    }}
  >
    <MenuItem sx={{fontFamily:"Montserrat"}} disabled value="">
      Zgjedh Profesorin
    </MenuItem>
    {profesoret.map((prof) => (
      <MenuItem  sx={{fontFamily:'Montserrat'}} key={prof.ProfesoriID} value={prof.ProfesoriID}>
        {"Prof. " + prof.Emri + " " + prof.Mbiemri + " - " + prof.Titulli_Akademik + " - " + prof.Fakulteti}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<FormControl fullWidth  required>
  <InputLabel sx={{fontFamily:"Montserrat"}} id="lenda-label">Zgjedh Lëndën</InputLabel>
  <Select
  sx={{fontFamily:"Montserrat"}}
    labelId="lenda-label"
    id="select-lenda"
    value={LendaID}
    label="Zgjedh Lëndën"
    
    onChange={(e) => setLendaID(e.target.value)}
    MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 300,
          overflowY: 'auto',
        },
      },
    }}
  >
    <MenuItem sx={{fontFamily:"Montserrat"}} disabled value="">
      Zgjedh Lëndën 
    </MenuItem>
     {lendet
    .filter(lnd => selectedProfesori && lnd.Fakulteti === selectedProfesori.Fakulteti)
    .map((lnd) => {

      const isAssigned = assignedLendet.some(
        (assigned) => assigned.LendaID === lnd.LendaID
      );

      return (
        <MenuItem  key={lnd.LendaID} sx={{fontFamily:"Montserrat"}} 
        value={lnd.LendaID}
        disabled={isAssigned}>
          {`${lnd.Emri_Lendes} - Semestri ${lnd.Semestri}`}
          {isAssigned && (
            <span style={{ color: 'red', marginLeft: '10px' }} >
              (Ligjëron tashmë)
            </span>
          )}
          
        </MenuItem>
      );
    })}
  </Select>
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

export default CaktoLendetProf; 