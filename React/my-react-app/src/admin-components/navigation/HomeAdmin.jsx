import React, {useEffect, useState} from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "../../assets/Home.css";
import Swal from "sweetalert2";
import "./assets/HomeAdmin.css";


function Home(){    

    const API_URL = 'http://localhost:3000/';

    const [admin, setAdmin] = useState(null);
        
        useEffect(() =>{

        fetchAdmini();

        const interval = setInterval(fetchAdmini,2000);

        return () => clearInterval(interval);
    },[])
    const fetchAdmini = async () =>{

        try{

            const response = await axios.get(`${API_URL}admin/admin`,{withCredentials: true});

            setAdmin(response.data);
            console.log(response.data);
        }catch(err){
            console.error(err);

        }
    }

    return(
           
        <div id="fadeInPage" className="container">
            
            <h1>PËRSHËNDETJE Admin - {admin ? admin[0].Emri_Adminit : 'Loading..' }</h1> 
            <h3 id="h3Info">INFORMATAT PERSONALE</h3>

        { admin ? (
        <form id="loginAdminData">
            
        <div className="input-label">
        <label htmlFor="">Emri</label>
        <input className="form-control" disabled type="text" placeholder="Emri" value={admin[0].Emri_Adminit} />
        </div>

        <div className="input-label">
        <label htmlFor="">Mbiemri</label>
        <input className="form-control" disabled type="text" placeholder="Mbiemri" value={admin[0].Mbiemri_Adminit} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email</label>
        <input className="form-control" disabled type="text" placeholder="Email" value={admin[0].Email} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti</label>
        <input className="form-control" disabled type="text" placeholder="Fakulteti" value={admin[0].Fakulteti} />
        </div>
        
        </form>
    ): (
        <p>Loading admin data..</p>
    )}
        </div>
    )
}
export default Home;