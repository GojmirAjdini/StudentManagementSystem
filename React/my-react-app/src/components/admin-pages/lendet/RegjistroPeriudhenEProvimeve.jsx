import {useState, useEffect} from "react";
import Swal from "sweetalert2";
import './assets/LendaRegister.css';
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl  from "@mui/material/FormControl";


function RegjistroPeriudhenEProvimeve() {

    const [vitiAkademikID, setVitiAkademikID] = useState('');
    const [data_Fillimit, setData_Fillimit] = useState('');
    const [data_Perfundimit, setData_Perfundimit] = useState('');
    const [data_Perfundimit_Notave, setData_Perfundimit_Notave] = useState('');
    const [emriPeriudhes, setEmriPeriudhes] = useState('');
    const [afatiPeriudhes, setAfatiPeriudhes] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const [vitetAkademike, setVitetAkademike] = useState([]);

    const handleReset = () => {
        setVitiAkademikID('');
        setData_Fillimit('');
        setData_Perfundimit('');
        setData_Perfundimit_Notave('');
        setEmriPeriudhes('');
        setAfatiPeriudhes('');

    }

    const fetchVitetAkademike = async() =>{
        try{
            const response = await axiosInstance.get(`admin/vitet/akademike/all`);
            setVitetAkademike(response.data); 
            console.log(response.data);
        }
        catch(err){
            console.error("Error fetching semestrat",err);  
        }
    }
    const handleSubmit = async(e) =>{    

        e.preventDefault();

        if(!vitiAkademikID || !data_Fillimit || !data_Perfundimit || 
          !data_Perfundimit_Notave || !emriPeriudhes || !afatiPeriudhes){
            
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
            const response = await axiosInstance.post(`admin/periudhat-provimeve/regjistro`,{
                
                EmriPeriudhes : emriPeriudhes,
                VitiAkademikID: vitiAkademikID,
                Data_Fillimit: data_Fillimit,
                Data_Perfundimit: data_Perfundimit,
                Data_Perfundimit_Notave: data_Perfundimit_Notave,
                afatiPeriudhes: afatiPeriudhes,
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
            console.error("Error krijimi i periudhes", err);
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
        
        fetchVitetAkademike();
        
    }
    ,[]);

    return(
        <div id="fadeInPage" className="container">

            <h1 id="lendaH1">REGJISTRO PERIUDHËN PËR PROVIME</h1>

            <form id="formLenda" onSubmit={handleSubmit} className="form-container">

       <div className="input-label">
        <br />
        <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
        <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh periudhën </InputLabel>
        <Select
     
          labelId="StatusiStudent-label"
          id="select-StatusiStudent"
          value={emriPeriudhes}
          label="Zgjedh periudhën"
          sx={{
           fontFamily:"Montserrat", 
           borderRadius:'10px', 
           height:'75%', 
          }}
          onChange={(e) => setEmriPeriudhes(e.target.value)}
    
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
            Zgjedh Periudhën
          </MenuItem>
            <MenuItem  value="Afati i provimeve SHKURT/MARS" sx={{fontFamily:'Montserrat'}} >
            Afati i provimeve SHKURT/MARS
            </MenuItem>

            <MenuItem  value="Afati i provimeve PRILL" sx={{fontFamily:'Montserrat'}} >
            Afati i provimeve PRILL 
            </MenuItem>

            <MenuItem  value="Afati i provimeve QERSHOR/KORRIK" sx={{fontFamily:'Montserrat'}} >
            Afati i provimeve QERSHOR/KORRIK
            </MenuItem>

            <MenuItem  value="Afati i provimeve SHTATOR" sx={{fontFamily:'Montserrat'}} >
            Afati i provimeve SHTATOR
            </MenuItem>

            <MenuItem  value="Afati i provimeve NËNTOR" 
            sx={{fontFamily:'Montserrat'}} >
            Afati i provimeve NËNTOR
            </MenuItem>
        </Select>
        </FormControl>
      </div>

      <div className="input-label">
        <br />
        <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
        <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh afatin për periudhën </InputLabel>
        <Select
     
          labelId="StatusiStudent-label"
          id="select-StatusiStudent"
          value={afatiPeriudhes}
          label="Zgjedh afatin per periudhen"
          sx={{
           fontFamily:"Montserrat", 
           borderRadius:'10px', 
           height:'75%', 
          }}
          onChange={(e) => setAfatiPeriudhes(e.target.value)}
    
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
            Zgjedh afatin
          </MenuItem>
            <MenuItem value="rregullt" sx={{fontFamily:'Montserrat'}} >
            rregullt
            </MenuItem>

            <MenuItem value="plotesues" sx={{fontFamily:'Montserrat'}} >
            plotesues 
            </MenuItem>

        </Select>
        </FormControl>
      </div>     
       
        <div className="input-label">
        <label htmlFor="">Data e fillimit të regjistrimeve të provimeve <span>*</span></label>
        <input className="form-control" required type="date" placeholder="Data e fillimit" value={data_Fillimit} onChange={(e) => setData_Fillimit(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e përfundimit të regjistrimeve të provimeve <span>*</span></label>
        <input className="form-control" required type="date" placeholder="Data e përfundimit" value={data_Perfundimit} onChange={(e) => setData_Perfundimit(e.target.value)} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e fundit e regjistrimit të notave për provim <span>*</span></label>
        <input className="form-control" required type="date" placeholder="Data e fundit për notimin e provimeve" value={data_Perfundimit_Notave} onChange={(e) => setData_Perfundimit_Notave(e.target.value)} />
        </div>

      <div className="input-label">
        <br />

        <Autocomplete
        style={{fontFamily:"Montserrat"}}
        fullWidth
        options={vitetAkademike}
        getOptionLabel={(vitet) =>
          `${vitet.VitiAkademik}`
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
            label="Zgjedh Vitin akademik"
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
        value={vitetAkademike.find((s) => s.VitiAkademikID === vitiAkademikID) || null}
        onChange={(e, newValue) => {
          setVitiAkademikID(newValue ? newValue.VitiAkademikID : '');
        }}
        isOptionEqualToValue={(option, value) => option.VitiAkademikID === value.vitiAkademikID}
      />
      </div>
        <div className="input-labelCaktoPeriudhen">
        <Button variant="contained" loading={loading} 
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25} />}
        id="primaryBtnLnt" className="btn btn-primary" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        type="submit">Regjistro</Button>
        
        <Button variant="contained" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        id="resetBtnLnt" className="btn btn-secondary" type="button" onClick={handleReset}>Reset</Button>
        </div>

        </form>
    
        {(successMessage) && (
        <div id="successMsgLenda" className="fade-in" role="alert">
         <Alert severity={successMessage ? "success" : 'warning'}>{successMessage || warningMessage}</Alert> 
            </div>
        )}
        </div>
    )
}

export default RegjistroPeriudhenEProvimeve;