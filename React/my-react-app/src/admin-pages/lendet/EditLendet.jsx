import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './assets/LendaRegister.css'; 
import { FaArrowLeft } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../services/axiosInstance";  

function EditLendet() {
  const { LendaID } = useParams();

  const [lenda, setLenda] = useState({
    Emri_Lendes: '',
    FakultetiID: '',
    ECTS: '',
    Kodi_Lendes: '',
    SemestriID: ''
  });

  const [orgLenda, setOrgLenda] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [semestrat, setSemestrat] = useState([]);
  const [fakultetet, setFakultetet] = useState([]); 

  useEffect(() => {
    fetchLenda();
    fetchSemestrat();
    fakultetetDisponueshme();
  }, []);

  const fetchLenda = async () => {
    try {
      const response = await axiosInstance.get(`admin/lendet/${LendaID}`);
      setLenda(response.data[0]);
      setOrgLenda(response.data[0]);
    } catch (err) {
      console.error("Gabim gjatë marrjes së lëndës", err);
      setSuccessMessage('Gabim gjatë ngarkimit të të dhënave.');
    }
  };

  const fakultetetDisponueshme = async() =>{

    try{
        const response = await axiosInstance.get(`admin/fakultetet/all`);
        setFakultetet(response.data);
        console.log(response.data);

    }catch(err){
        console.error("Error fetching fakultetet",err); 
    }
}

  const fetchSemestrat = async() =>{
    try{
        const response = await axiosInstance.get(`admin/semestri/all`);
        setSemestrat(response.data); 
        console.log(response.data);
    }
    catch(err){
        console.error("Error fetching semestrat",err);  
    }
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLenda(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEqual(lenda, orgLenda)) {
      await Swal.fire({
        title: 'Nuk ka ndryshime!',
        text: 'Asnjë e dhënë nuk është ndryshuar.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          confirmButton: 'swal-confirmBtn',
          popup: 'popupDesign',
          htmlContainer: 'textSwal',
        }
      });
      return;
    }

    const result = await Swal.fire({
      background: "#F5F5F5",
      position: "center",
      title: "Dëshironi t'i ruani të dhënat?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Po, ruaj!',
      cancelButtonText: 'Jo, anulo',
      timer: 5000,
      customClass: {
        confirmButton: 'swal-confirmBtn',
        cancelButton: 'swal-confirmBtn',
        popup: 'popupDesign'
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.patch(`admin/lendet/edit/${LendaID}`, lenda);
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error("Gabim gjatë përditësimit të lëndës", err);
        setSuccessMessage(err.response?.data?.message || 'Gabim gjatë përditësimit.');
      }
    }
  };

  return (
    <div id="fadeInPage" className="container">
      <h1 id="lendaH1">PËRDITËSO LËNDËN</h1>

      {successMessage && (
        <div id="successMsgLenda" className="fade-in" role="alert">
        <Alert severity="success">{successMessage}</Alert> 
        </div>
      )}

      <form id="formLenda" onSubmit={handleSubmit}>
        <div className="input-label">
          <label htmlFor="">Emri i Lëndës <span>*</span></label>
          <input className="form-control" name="Emri_Lendes" required type="text" placeholder="Emri i Lëndës" value={lenda.Emri_Lendes || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti <span>*</span></label>

        <select id="select" className="form-select" name="FakultetiID" value={lenda.FakultetiID || ''} onChange={handleChange}>
          <option disabled value="">Zgjedh Fakultetin</option>
          {fakultetet.map((fk) => (
            <option key={fk.FakultetiID} value={fk.FakultetiID}>
              {fk.Emri}
            </option>
          ))}
        </select>
        </div>

        <div className="input-label">
          <label htmlFor="">ECTS <span>*</span></label>
          <input className="form-control" name="ECTS" required type="number" placeholder="ECTS" value={lenda.ECTS || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
          <label htmlFor="">Kodi i Lëndës <span>*</span></label>
          <input className="form-control" name="Kodi_Lendes" required type="text" placeholder="Kodi" value={lenda.Kodi_Lendes || ''} onChange={handleChange} />
        </div>

        <div className="input-label">
        <label htmlFor="">Semestri <span>*</span></label>

        <select id="select" name="SemestriID" className="form-select" value={lenda.SemestriID || ''} onChange={handleChange}>
          <option disabled value="">Zgjedh Semestrin</option>
          {semestrat.map((sms) => (
            <option key={sms.Semestri_ID} value={sms.Semestri_ID}>
              {sms.NrSemestrit + " - " + sms.Afati_Semestrit}
            </option>
          ))}
        </select>
        </div>

        <div className="inputLenda">
          <Button variant="contained" id="updateBtnLenda" type="submit">Ruaj Ndryshimet</Button>
        </div>

        <div className="input-label">
          <Link className="kthehuLinkLenda" to={`/lendet`}>
          <Button variant='contained' color='inherit'><FaArrowLeft className="leftArrow"/>Kthehu</Button>           

          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditLendet;
