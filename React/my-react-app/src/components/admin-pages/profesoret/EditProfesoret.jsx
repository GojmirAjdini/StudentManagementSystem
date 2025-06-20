import {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import FaArrowLeft  from "@mui/icons-material/ArrowBack";
import Swal from 'sweetalert2';
import './assets/RegisterProfesoret.css';
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from '../../../services/axiosInstance';
import CircularProgress from '@mui/material/CircularProgress';


function EditProfesoret() {

    const {ProfesoriID} = useParams();
    
    const [successMessage,setSuccessMessage] = useState('');
    const [orgProfesori, setOrgProfesori] = useState({});
    const [fakultet, setFakultetet] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profesori, setProfesori] = useState({

        Emri : '',
        Mbiemri: '',
        FakultetiID: '',
        Gjinia: '',
        EmailPrivat: '',
        NrTel: '',
        Data_Punesimit: '',
        Statusi: '',
        Titulli_Akademik: '',
    });

    useEffect(() =>{
        
        fetchProfesoriById();
        fetchFakultetet();

    }, [])

    const fetchProfesoriById = async () => {

        try{

            const response = await axiosInstance.get(`admin/profesoret/${ProfesoriID}`);

            console.log(response.data);

            setProfesori(response.data[0]);
            setOrgProfesori(response.data[0]);

        }catch(err){
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

    const isEqual = (obj1, obj2) => {

        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    const handleChange = (e) =>{

        const {name, value} = e.target;
        setProfesori((prevProfesori) => ({
            ...prevProfesori,
            [name]: value,
        }));
    }

    const formatLocalDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
      };

    const handleSubmit = async(e) =>{

        e.preventDefault();

        if(isEqual(profesori, orgProfesori)){

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
            try{

                const response = await axiosInstance.patch(`admin/profesoret/edit/${ProfesoriID}`,profesori,);
            
                setTimeout(() => {
                setSuccessMessage(response.data.message);
                setOrgProfesori(profesori);

                setTimeout(() => { setSuccessMessage('')},5000);
                },1000);

            }catch(err){

                console.error(err);
                console.log(err.response.data.message);
            }
            finally{
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
        }
    
    }

    return (

    <div className='container' id="fadeInPage">

    <h1 id='profH1'>PËRDITËSO PROFESORIN</h1>

    {successMessage && (
        <div id="successMsg" className="fade-in" role="alert">
          <Alert severity='success'>{successMessage} </Alert>
        </div>  
      )} 

    <form onSubmit={handleSubmit}>

    <div className="input-label">
    <label htmlFor="">Emri <span>*</span></label>
    <input className="form-control" required type="text" name='Emri' placeholder="Emri" value={profesori.Emri || ''} onChange={handleChange} />
    </div> 
    
    <div className="input-label">
    <label htmlFor="">Mbiemri <span>*</span></label>
    <input className="form-control" required type="text" name='Mbiemri' placeholder="Mbiemri" value={profesori.Mbiemri || ''} onChange={handleChange} />
    </div>

    <div className="input-label">
    <label htmlFor="">Gjinia <span>*</span></label>
    
    <div id="gjinia" className="form-check ">
    <label className="form-check-label" htmlFor="flexRadioDefault1">
    <input required
    className="form-check-input"
    type="radio"
    name="Gjinia"
    value="M"
    checked={profesori.Gjinia === "M" || ''}
    onChange={handleChange}
    id="flexRadioDefault1"
    />
    Mashkull
    </label>
    
    <label className="form-check-label" htmlFor="flexRadioDefault2">
    <input required
    className="form-check-input"
    type="radio"
    name="Gjinia"
    value="F"
    checked={profesori.Gjinia === "F" || ''}
    onChange={handleChange}
    id="flexRadioDefault2"
        />
        Femër
      </label>
      </div>
    </div>

    <div className="input-label">
    <label htmlFor="">Email Privat <span>*</span></label>
    <input className="form-control" required type="email" name='EmailPrivat' placeholder="Email Privat" value={profesori.EmailPrivat || ''} onChange={handleChange}/>
    </div>
    
    <div className="input-label">
    <label htmlFor="">Kontakt</label>
    <input className="form-control" required type="text" placeholder="04X-XXX-XXX" name="NrTel" value={profesori.NrTel || ''} onChange={handleChange}/>
    </div>

    <div className="input-label">
    <label htmlFor="">Data e Punësimit <span>*</span></label>
    <input className="form-control" required type="date" name='Data_Punesimit' placeholder="Data e Punesimit" value={profesori.Data_Punesimit ? formatLocalDate(profesori.Data_Punesimit) : ''} onChange={handleChange} />
    </div>

    <div className="input-label">
    <label htmlFor="">Statusi <span>*</span></label>
    <select id="select" required className="form-select" name='Statusi' value={profesori.Statusi || ''} onChange={handleChange}>
      <option disabled value="">Zgjedh Statusin</option>
      <option value="Aktiv">Aktiv</option>
      <option value="Deaktiv">Deaktiv</option>
    </select>
    </div>

    <div className="input-label">
    <label htmlFor="">Titulli Akademik <span>*</span></label>
    <select id="select" required className="form-select" name='Titulli_Akademik' value={profesori.Titulli_Akademik || ''} onChange={handleChange}>
      <option disabled value="">Zgjedh Titullin</option>
      <option value="BSc">Bachelor</option>
      <option value="cand.MSc">cand.Master</option>
      <option value="MSc">Master</option>
      <option value="cand.PhD">cand.PhD</option>
      <option value="PhD">PhD</option>
    </select>
    </div>

    <div className="input-label">
        <label htmlFor="">Data e Regjistrimit <span>*</span></label>
        <input className="form-control" disabled type="text" name="uKrijua"
        placeholder="Regjistruar" value={profesori.uKrijua ? new Date(profesori.uKrijua).toLocaleString() : ''}  />
        </div>

    <div className="inputProf">
        
        <Link className="kthehuLinkProf" to={`/profesoret`}>  
          <Button variant='contained' sx={{textTransform:'none', fontFamily:'Montserrat',}} 
          color='inherit'><FaArrowLeft className="leftArrow"/>Kthehu</Button>  </Link>
          
          <Button variant='contained' 
          loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>}
          loading={loading} id="updateBtnProf" sx={{textTransform:'none', fontFamily:'Montserrat',}}
          type="submit">Ruaj Ndryshimet</Button>         
        </div>
        </form>
    </div>
    )
}

export default EditProfesoret;