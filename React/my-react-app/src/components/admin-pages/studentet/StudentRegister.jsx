import React, {useEffect, useState} from "react";
import './assets/Register.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel  from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";  
import Autocomplete  from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Loading from "../login-register/utils/Loading";


import axiosInstance from "../../../services/axiosInstance";

function Register(){

    const [gjeneratatAkademike, setGjeneratatAkademike] = useState([]);

    const [successMessage, setSuccessMessage] = useState('');
    const [successEmail, setSuccessEmail] = useState('');
    const [emri, setEmri] = useState('');
    const [mbiemri, setMbiemri] = useState('');
    const [gjinia, setGjinia] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailprivat, setEmailPrivat] = useState('');
    const [vendlindja, setVendlindja] = useState('');
    const [data_lindjes, setData_Lindjes] = useState('');
    const [adresa, setAdresa] = useState('');
    const [nr_tel, setNr_Tel] = useState('');
    const [gjenerataID, setGjenerataID] = useState('');
    const [statusi, setStatusi] = useState('');

    const handleReset = () => {
        setEmri('');
        setMbiemri('');
        setGjinia('');
        setEmailPrivat('');
        setVendlindja('');
        setData_Lindjes('');
        setAdresa('');
        setNr_Tel('');
        setStatusi('');
        setGjenerataID('');
    };

    const fetchGjeneratatFakultetet = async () =>{

      try{
        const response = await axiosInstance.get("admin/gjeneratat");

        console.log(response.data.gjenerata);
        setGjeneratatAkademike(response.data.gjenerata);
      }catch(err){

        console.error(err);
      }
    }
    
    const submitStudenti = async(e) =>{

        e.preventDefault();

      if(!emri && !mbiemri && !gjinia && !emailprivat && 
        !vendlindja &&!data_lindjes && !adresa && !nr_tel && 
        !statusi && !niveli ){

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
  
    });

    return; 
    }
    setLoading(true);
    try{

        const response = await axiosInstance.post(`admin/studentet/register/`,{

            Emri: emri, Mbiemri: mbiemri, Gjinia: gjinia, EmailPrivat: emailprivat,
            Vendlindja: vendlindja, Data_Lindjes: data_lindjes, Adresa: adresa, Nr_Tel: nr_tel,
            GjenerataID : gjenerataID,
            Statusi: statusi 
        });

        
        setTimeout(() => {
            setSuccessMessage(response.data.message);
            setSuccessEmail(response.data.emailNotification);

        setTimeout(() => {
             setSuccessMessage('');
             setSuccessEmail('');
           
        },5000);

        },1000);

    } catch(err){
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
}finally{
  setTimeout(() =>{
    setLoading(false);
  },1000);
}
    }
    

useEffect(() =>{

    fetchGjeneratatFakultetet();

},[]);

return (

    <div className="container fade-in">

        <h1 id="studentH1">REGJISTRO STUDENTË</h1>

        <form onSubmit={submitStudenti} autoComplete='on' action="">

        <div className="input-label">
        <label >Emri <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Emri" value={emri} onChange={(e) => setEmri(e.target.value)} />
        </div> 
       
        <div className="input-label">
        <label htmlFor="">Mbiemri <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Mbiemri" value={mbiemri} onChange={(e) => setMbiemri(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Gjinia <span>*</span></label>
       
        <div id="gjinia" className="form-check ">
        <label className="form-check-label" htmlFor="flexRadioDefault1">
        <input
          className="form-check-input"
          type="radio"
          name="gjinia"
          value="M"
          checked={gjinia === "M"}
          onChange={(e) => setGjinia(e.target.value)}
          id="flexRadioDefault1"
        />
        Mashkull
        </label>

        <label className="form-check-label" htmlFor="flexRadioDefault2">
        <input
          className="form-check-input"
          type="radio"
          name="gjinia"
          value="F"
          checked={gjinia === "F"}
          onChange={(e) => setGjinia(e.target.value)}
          id="flexRadioDefault2"
        />
        Femër
      </label>
      </div>
    </div>

        <div className="input-label">
        <label htmlFor="">Email Privat <span>*</span></label>
        <input className="form-control" required type="email" placeholder="Email Privat" value={emailprivat} onChange={(e) => setEmailPrivat(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Vendlindja <span>*</span></label>
        <input className="form-control" required type="text" placeholder="Vendlindja" value={vendlindja} onChange={(e) => setVendlindja(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Lindjes <span>*</span></label>
        <input className="form-control" required type="date" placeholder="Data e Lindjes" value={data_lindjes} onChange={(e) => setData_Lindjes(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Adresa <span>*</span></label>
        <input  className="form-control" required type="text" placeholder="Adresa" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
        </div>
        
        <div className="input-label">
        <label htmlFor="">Kontakt</label>
        <input className="form-control" type="text" placeholder="04X-XXX-XXX" name="Nr_Tel" value={nr_tel} onChange={(e) => setNr_Tel(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti <span>*</span></label>

        <Autocomplete
          style={{fontFamily:"Montserrat"}}
          fullWidth
          options={gjeneratatAkademike}
          getOptionLabel={(gjen) =>
            `${gjen.Fakulteti} - ${gjen.NiveliStudimit} - ${gjen.viti_akademik}`
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
              label="Zgjedh Fakultetin/Gjeneratën"
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
          value={gjeneratatAkademike.find((g) => g.GjenerataID === gjenerataID) || null}
          onChange={(e, newValue) => {
            setGjenerataID(newValue ? newValue.GjenerataID : '');
          }}
          isOptionEqualToValue={(option, value) => option.GjenerataID === value.GjenerataID}
        />
       </div>   

        <div className="input-label">
        <label htmlFor="">Statusi <span>*</span></label>

        <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
         <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh Statusin </InputLabel>
         <Select
      
           labelId="StatusiStudent-label"
           id="select-StatusiStudent"
           value={statusi}
           label="Zgjedh Statusi"
           sx={{
            fontFamily:"Montserrat", 
            borderRadius:'10px', 
            height:'75%', 
           }}
           onChange={(e) => setStatusi(e.target.value)}
    
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
             Zgjedh Statusin
           </MenuItem>
             <MenuItem  value="Aktiv" sx={{fontFamily:'Montserrat'}} >
             Aktiv 
             </MenuItem>
             <MenuItem  value="Deaktiv" sx={{fontFamily:'Montserrat'}} >
             Deaktiv 
             </MenuItem>
         </Select>
       </FormControl>
       </div>   

        <div className="input-labelBtnStd">
        <Button id="primaryBtn" variant="contained" disabled={loading} type="submit">Regjistro</Button>
        <Button id="resetBtn" variant="contained" disable={loading} type="button" onClick={handleReset}>Reset</Button>
        </div>
        </form>
        {loading && <Loading/>}
        {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
          <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 

      {successEmail && (
        <div id="successEmailStd" className="fade-in" role="alert">
          <Alert severity="success">{successEmail} </Alert>
        </div>  
      )}  

</div>
);
}

export default Register;