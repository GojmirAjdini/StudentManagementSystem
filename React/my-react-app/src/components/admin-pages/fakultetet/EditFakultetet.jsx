import {useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {FaArrowLeft}  from "react-icons/fa";
import Swal from "sweetalert2";
import './assets/FakultetiRegister.css';
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import axiosInstance from "../../../services/axiosInstance";

function EditFakultetet() {

    const { FakultetiID } = useParams();
    
    const [orgFakulteti, setOrgFakulteti] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [fakulteti, setFakulteti] = useState({
        
        Emri: '',
        Niveli: '',
        Lokacioni: '',
        Kodi_Fakultetit: ''
    });

    useEffect(() => {
        fetchFakulteti();
    }
    , []);

    const fetchFakulteti = async () => {

        try{
            const response = await axiosInstance.get(`admin/fakultetet/${FakultetiID}`);
            console.log("Fakulteti data:", response.data);  

            setFakulteti(response.data);
            setOrgFakulteti(response.data);
            

        }catch(err){
            console.error("Error fetching fakulteti", err);
            setSuccessMessage('Ka ndodhur një gabim gjatë ngarkimit të të dhënave.');
        }
    }   
    const handleChange = (e) =>{

        const { name, value } = e.target;
        setFakulteti((prevFakulteti) => ({
            ...prevFakulteti,
            [name]: value,
        }));
    }
    
    const isEqual = (obj1, obj2) =>{
        return JSON.stringify(obj1) === JSON.stringify(obj2);   
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(isEqual(fakulteti, orgFakulteti)){
        
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
            
        try{

            const response = await axiosInstance.patch(`admin/fakultetet/edit/${FakultetiID}`, fakulteti);
            
            console.log("Fakulteti updated:", response.data);
            console.log(response.data.message);

            setSuccessMessage(response.data.message);
            
            setTimeout(() => {
               setSuccessMessage('')}, 3000);
            }
            catch(err){
                console.error("Error updating fakulteti", err);
                setSuccessMessage(err.response.data.message);
            }
        }
    }

    return(
        <div id="fadeInPage" className="container">

            <h1 id="fakultetiH1">PËRDITËSO FAKULTETIN</h1>

            {successMessage && (
        <div id="successMsgFakulteti" className="fade-in" role="alert">
          <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 
             
            <form id="formFakulteti" onSubmit={handleSubmit} >

            <div className="input-label">
            <label htmlFor="">Emri <span>*</span></label>
            <input className="form-control" name="Emri" required type="text" placeholder="Emri i Fakultetit" value={fakulteti.Emri || ''} onChange={handleChange} />
            </div> 

                <div className="input-label">
                 <label htmlFor="">Niveli<span> *</span></label>
                <select className="form-select" name="Niveli" required value={fakulteti.Niveli || ''} onChange={handleChange} aria-label="Default select example">
                <option disabled value="">Niveli</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">PhD</option>
                </select>
                    </div>

                <div className="input-label">
            <label htmlFor="">Lokacioni <span>*</span></label>
            <input className="form-control" required name="Lokacioni" 
            type="text" placeholder="Lokacioni" value={fakulteti.Lokacioni || ''} onChange={handleChange} />
             </div>

                <div className="input-label">
                    <label htmlFor="kodi">Kodi i Fakultetit <span> *</span></label>
                    <input type="text" id="kodi" className="form-control" placeholder="Kodi i Fakultetit" name="Kodi_Fakultetit" 
                    value={fakulteti.Kodi_Fakultetit || ''} onChange={handleChange} required />
                </div>

                <div className="input">
                <Button id="updateBtnFkt" variant="contained" type="submit">Ruaj Ndryshimet</Button>
    
                </div>
                <div className="input-label">

                <Link className="kthehuLinkFkt" to={`/fakultetet`}>  
                <Button variant='contained' color='inherit'><FaArrowLeft className="leftArrow"/>Kthehu</Button>  </Link>                    
                    </div>
            </form>
        </div>
    )
}
export default EditFakultetet;