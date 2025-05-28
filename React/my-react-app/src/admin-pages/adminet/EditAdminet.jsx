import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';
import "./assets/RegjistroAdmin.css";
import { FaArrowLeft } from "react-icons/fa";

function EditAdminet() {

    const { AdminID } = useParams();
    const [orgAdmini, setOrgAdmini] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [fakultetet, setFakulteti] = useState([]);
    const [admini, setAdmini] = useState({});

    useEffect(() => {

        fetchAdmini();

        fetchFakulteti();
    },[]);

    const fetchFakulteti = async () => {
        try{
            const response = await axiosInstance.get(`admin/fakultetet/all`);
            console.log("Fakulteti data:", response.data);  
            setFakulteti(response.data);
        }catch(err){
            console.error("Error fetching fakulteti", err);
        }
    }

    const fetchAdmini = async () => {

        try{
            const response = await axiosInstance.get(`admin/admin/${AdminID}`);
            console.log("Admini data:", response.data);  
            setAdmini(response.data[0]);
            setOrgAdmini(response.data[0]);
        }catch(err){
            console.error("Error fetching admini", err);
        }
    }

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setAdmini((prevAdmini) => ({
            ...prevAdmini,
            [name]: value,
        }));
    }

    const isEqual = (obj1, obj2) =>{
        return JSON.stringify(obj1) === JSON.stringify(obj2);   
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(isEqual(admini, orgAdmini)){
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

        try{
            const response = await axiosInstance.patch(`admin/edit/${AdminID}`, admini);
            
            console.log("Admini updated:", response.data);
            setSuccessMessage(response.data.message);   

            setTimeout(() => {
                setSuccessMessage('');
            },3000);

        }catch(err){
            console.error("Error updating admini", err);
            setSuccessMessage(err.response.data.message);
        }
    }

    return (

    <div className="container" id="fadeInPage">

    <h1 id="adminH1">PËRDITËSO ADMIN</h1>

        <form onSubmit={handleSubmit} autoComplete="off" >

        <div className="input-label">
        <label>Emri <span>*</span></label>
        <input className="form-control" name="Emri_Adminit" required 
        type="text" placeholder="Emri" value={admini.Emri_Adminit} onChange={handleChange} />
        </div> 
       
        <div className="input-label">
        <label htmlFor="">Mbiemri <span>*</span></label>
        <input className="form-control" required type="text" name="Mbiemri_Adminit"
        placeholder="Mbiemri" value={admini.Mbiemri_Adminit} onChange={handleChange} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email <span>*</span></label>
        <input className="form-control" required type="email" name="Email"
        placeholder="Email" value={admini.Email} onChange={handleChange} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti <span>*</span></label>

        <select id="select" className="form-select" value={admini.FakultetID}
         onChange={handleChange} name="FakultetID" required aria-label="Default select example">
          <option disabled value="">Zgjedh Fakultetin</option>
          {fakultetet.map((fk) => (
            <option key={fk.FakultetiID} value={fk.FakultetiID}>
              {fk.Emri}
            </option>
          ))}
        </select>
        </div>

        <div className="input-label">
        <label htmlFor="">Role<span> *</span></label>
        <select className="form-select" value={admini.role} name="role" 
        onChange={handleChange} aria-label="Default select example">
        <option disabled value="">Role</option>
        <option value="admin">admin</option>
        <option value="superadmin">superadmin</option>
        </select>
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Regjistrimit <span>*</span></label>
        <input className="form-control" disabled type="text" name="uKrijua"
        placeholder="Regjistruar" value={admini.uKrijua ? new Date(admini.uKrijua).toLocaleString() : ''}  />
        </div>

         <div className="input-labelAdmBtnUpd">
          
          <Link className="kthehuLinkAdmins" to={`/adminet`}>  
          <Button variant='contained' sx={{color:'black'}} color='inherit'><FaArrowLeft className="leftArrow"/>Kthehu</Button>  </Link>                    
           <Button id="updateBtnAdm" variant="contained" type="submit">Përditëso</Button>
           </div>

          <div className="input-label">
          
           
        </div>

          </form>
          {successMessage && (
          <div id="successMsg" className="fade-in" role="alert">
            <Alert severity="success">{successMessage} </Alert>
          </div>  
        )} 

    </div>
)
}

export default EditAdminet;