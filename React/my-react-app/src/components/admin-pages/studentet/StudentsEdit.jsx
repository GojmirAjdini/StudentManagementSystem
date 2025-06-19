import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./assets/Register.css";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import axiosInstance from "../../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import InputLabel  from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";  
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

function StudentsEdit() {
  const { ID } = useParams();

  const [originalStudenti, setOriginalStudenti] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [gjeneratatAkademike, setGjeneratatAkademike] = useState([]);
  const [studenti, setStudenti] = useState({
    Emri: '',
    Mbiemri: '',
    Gjinia: '',
    EmailPrivat: '',
    Vendlindja: '',
    Data_Lindjes: '',
    Adresa: '',
    Nr_Tel: '',
    FakultetiID: '',
    Niveli: '',
    Statusi: '',
    GjenerataID: '',
  });

  useEffect(() => {
    
    fetchStudenti();
    fetchGjeneratatFakultetet();

}, []);

  const fetchStudenti = async () => {
    try {
      const res = await axiosInstance.get(`admin/studentet/${ID}`)
      console.log("Studenti data:", res.data);
      setStudenti(
        res.data[0]
      )
      setOriginalStudenti(res.data[0]);
    } catch (err) {
      console.error("Error fetching studenti", err);
    }
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

  
const handleChange = (e) => {
    const { name, value } = e.target;
    setStudenti((prevStudenti) => ({
      ...prevStudenti,
      [name]: value,
    }));
  };

  const formatLocalDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEqual(studenti, originalStudenti)) {
      
      await Swal.fire({
        title: 'Nuk ka ndryshime!',
        text: 'Asnjë e dhënë nuk është ndryshuar.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor:'#3085d6',
        customClass: {
          confirmButton: 'swal-confirmBtn',
          popup: 'popupDesign',
          htmlContainer: 'textSwal',
        }
      });
      return; 
    }
   
    const result = await Swal.fire({
      
      background:"rgb(245, 245, 245)",
      position: "center",
      title: "Dëshironi t'i ruani të dhënat?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',      
      confirmButtonText: 'Po, ruaj!',
      cancelButtonText: 'Jo, anulo',
      timer:5000,
      customClass: {
        confirmButton:'swal-confirmBtn',
        cancelButton: 'swal-confirmBtn',
        popup:"popupDesign"
      }
    });

    if(result.isConfirmed){
setLoading(true);
    try {

      const response  = await axiosInstance.patch(`admin/studentet/edit/${ID}`, studenti);

      setTimeout(() => {
      setSuccessMessage(response.data.message);
      setOriginalStudenti(studenti);

      setTimeout(() => setSuccessMessage(''), 3000);
      },1000);
    } catch (err) {
      console.error("Error updating studenti", err);
    }finally{
      setTimeout(() => {
        setLoading(false);
      },1000);
    }
  };
  }
  return (

    
    <div id="fadeInPage" className="container">
      <h1 id="studentH1">PËRDITËSO STUDENTIN</h1>

      {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
         <Alert severity="success"> {successMessage}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        <div className="input-label">
          <label>Emri <span>*</span></label>
          <input className="form-control" type="text" name="Emri" value={studenti.Emri || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <label>Mbiemri <span>*</span></label>
          <input className="form-control" type="text" name="Mbiemri" value={studenti.Mbiemri || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Gjinia <span>*</span></label>

          <div id="gjinia" className="form-check">
            <label form="flexRadioDefault1" className="form-check-label">
              <input className="form-check-input" type="radio" name="Gjinia" value="M" checked={studenti.Gjinia === "M" || ''} onChange={handleChange} />
              Mashkull
            </label>
            
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              <input className="form-check-input" type="radio" name="Gjinia" value="F" checked={studenti.Gjinia === "F" || ''} onChange={handleChange} />
              Femër
            </label>
          </div>
        </div>

        <div className="input-label">
          <label>Email Privat <span>*</span></label>
          <input className="form-control" type="email" name="EmailPrivat" value={studenti.EmailPrivat || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Vendlindja <span>*</span></label>
          <input className="form-control" type="text" name="Vendlindja" value={studenti.Vendlindja || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Data e Lindjes <span>*</span></label>
          <input className="form-control" placeholder="YYYY-MM-DD" type="date" name="Data_Lindjes" 
          value={studenti.Data_Lindjes ? formatLocalDate(studenti.Data_Lindjes) : ''} 
          onChange = {handleChange}required />
          
        </div>
        <div className="input-label">
          <label>Adresa <span>*</span></label>
          <input className="form-control" type="text" name="Adresa" value={studenti.Adresa || ''} onChange={handleChange} required />
        </div>

        <div className="input-label">
          <label>Kontakt</label>
          <input className="form-control" type="text" name="Nr_Tel" value={studenti.Nr_Tel || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <br />

        <Autocomplete
          style={{fontFamily:"Montserrat"}}
          fullWidth
          
          options={gjeneratatAkademike}
          getOptionLabel={(gjen) =>
            `${gjen.Fakulteti} - ${gjen.NiveliStudimit} - ${gjen.Viti_Gjenerates}`
          }
          sx={{
            fontFamily: "Montserrat",
            ".MuiInputBase-root": {
              borderRadius: "10px",
              height:"40px",
              fontFamily: "Montserrat",
              width:'500px',
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
              label="Zgjedh Fakultetin"
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
          value={gjeneratatAkademike.find((g) => g.GjenerataID === studenti.GjenerataID) || null}
          onChange={(e, newValue) => {

            handleChange ({
              target:{
                name: "GjenerataID",
                value: newValue ? newValue.GjenerataID : '',
              },
            });
          }}
          isOptionEqualToValue={(option, value) => option.GjenerataID === value.GjenerataID}
        />

        </div>

        <div className="input-label">
          <br />
        
         <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
          <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh Statusin </InputLabel>
          <Select

            name="Statusi"
            labelId="StatusiStudent-label"
            id="select-StatusiStudent"
            value={studenti.Statusi || ''}
            label="Zgjedh Statusi"
            sx={{
             fontFamily:"Montserrat", 
             borderRadius:'10px', 
             height:'75%', 
            }}
            
            onChange={handleChange}
    
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
              <MenuItem value="Aktiv" sx={{fontFamily:'Montserrat'}} >
              Aktiv 
              </MenuItem>
              <MenuItem  value="Deaktiv" sx={{fontFamily:'Montserrat'}} >
              Deaktiv 
              </MenuItem>
          </Select>
        </FormControl>
        </div>   

        <div className="input-labelBtnStdEdit">
          
          <Button variant="contained"
           loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} loading={loading}
           id="updateBtn" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
           type="submit">Ruaj Ndryshimet</Button>
          
          <Link className="kthehuLinkStd" to={`/studentet`}>  
          <Button variant="contained" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
          color="inherit"> <FaArrowLeft className="leftArrow"/>Kthehu</Button> </Link>          
         
        </div>

      </form>
    </div>
  );
}

export default StudentsEdit;
