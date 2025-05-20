import {useEffect, useState} from "react"
import "../../../assets/Home.css";
import axiosInstance from "../../../services/axiosInstance";
import "./assets/HomeAdmin.css";
import CircularProgress from "@mui/material/CircularProgress"
import Edit from "@mui/icons-material/Edit";
import WavingHand from "@mui/icons-material/WavingHand";

function Home(){    

    const [admin, setAdmin] = useState({

        Emri_Adminit:'',
        Mbiemri_Adminit:'',
        Email: '',
        Fakulteti: '',
        role:''

    });
       
    const fetchAdmini = async () =>{

        try{

            const response = await axiosInstance.get(`admin/getAdminByEmail`);

            setAdmin(response.data[0]);
            console.log("Admin data:", response.data[0]);
        } catch (err) {
            console.error(err.response.data);
    
  }
}

  const handleChange = (e) =>{
        const { name, value } = e.target;
        setAdmin((prevAdmini) => ({
            ...prevAdmini,
            [name]: value,
        }));
    }
    
    useEffect(() =>{

        fetchAdmini();

    },[])

    return(
           
        <div id="fadeInPage" className="homePagecontainer">
            
            <h1 id="homeAdminH1">PËRSHËNDETJE <WavingHand sx={{marginLeft:'0px', height:'30px', marginBottom:'2px'}}/>  {admin ? admin.role : ''} -  
            {admin ? admin.Emri_Adminit : ''}</h1> 
            
            <h3 id="h3Info">Informatat Personale</h3>

        { admin ? (
        <form id="loginAdminData">
        
        
        <div className="input-label">
        <label htmlFor="">Emri<Edit sx={{height:'15px', marginBottom:'5px'}}></Edit></label>
        <input className="form-control" type="text" onChange={handleChange} placeholder="Emri" value={admin.Emri_Adminit} />
        </div>

        <div className="input-label">
        <label htmlFor="">Mbiemri<Edit sx={{height:'15px', marginBottom:'5px'}}></Edit></label>
        <input className="form-control" readOnly type="text" placeholder="Mbiemri" value={admin.Mbiemri_Adminit} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email<Edit sx={{height:'15px', marginBottom:'5px'}}></Edit></label>
        <input className="form-control" readOnly type="text" placeholder="Email" value={admin.Email} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti<Edit sx={{height:'15px', marginBottom:'5px'}}></Edit></label>
        <input className="form-control" readOnly type="text" placeholder="Fakulteti" value={admin.Fakulteti} />
        </div>

        <div className="input-label">
          <label>Roli<Edit sx={{height:'15px', marginBottom:'5px'}}></Edit></label>
          <select className="form-select" readOnly name="Role" value={admin.role || ''}>
            <option disabled>Role</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Regjistrimit</label>
        <input className="form-control" 
        disabled type="text" placeholder="createdAt" 
        value={admin.uKrijua ? new Date(admin.uKrijua).toLocaleString() : ''} />
        </div>
        
        </form>
    ): (
        <CircularProgress></CircularProgress>
    )}
        </div>
    )
}
export default Home;