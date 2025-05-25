import {useState, useEffect} from 'react';
import axiosInstance from '../../services/axiosInstance';
import CircularProgress from '@mui/material/CircularProgress';
import './assets/Dashboard.css';

function Dashboard(){
    
    
    const [studenti, setStudenti] = useState({
    Emri: '',
    Mbiemri: '',
    Gjinia: '',
    EmailStudentor: '',
    EmailPrivat: '',
    Vendlindja: '',
    Data_Lindjes: '',
    Adresa: '',
    Nr_Tel: '',
    Drejtimi: '',
    Niveli:'',
    Statusi: '',
    StudentiID: '',
    viti_akademik: '',
    uKrijua:'',

    });


    useEffect(() =>{

        fetchStudenti();
    },[])

    const fetchStudenti = async() =>{

        try{

            const response = await axiosInstance.get("student/dashboard");

            console.log(response.data[0])
            setStudenti(response.data[0]);

        } catch(err){
            console.error(err);
        }
    }

    return(
   
        <div id="fadeInPage" className="dashboardPageContainer">
            
            <h1 id='dashboardH1'>PROFILI IM</h1>


        <div id="containerFormDashboard">            
        <h3 id="h3StudentiInfo">Informatat Personale</h3>

        { studenti ? (
        <form id="loginStudentDashboardData">
        
        <div className="input-label">
        <label htmlFor="">Emri</label>
        <input className="form-control" disabled type="text"
        placeholder="Emri" value={studenti.Emri} />
        </div>

        <div className="input-label">
        <label htmlFor="">Mbiemri</label>
        <input className="form-control" disabled
         type="text" value={studenti.Mbiemri} />
        </div>

        <div className="input-label">
        <label htmlFor="">Gjinia</label>
        <input className="form-control" disabled 
        type="text" value={studenti.Gjinia} />
        </div>

         <div className="input-label">
        <label htmlFor="">Data e Lindjes</label>
        <input className="form-control" disabled 
        type="text" value={studenti.Data_Lindjes ? 
        new Date(studenti.Data_Lindjes).toLocaleDateString() : ''} />
        </div>

         <div className="input-label">
        <label htmlFor="">Vendlindja</label>
        <input className="form-control" disabled 
        type="text" value={studenti.Vendlindja} />
        </div>

         <div className="input-label">
        <label htmlFor="">Adresa</label>
        <input className="form-control" disabled 
        type="text" value={studenti.Adresa} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email Privat</label>
        <input className="form-control" disabled type="text"
        value={studenti.EmailPrivat} />
        </div>

        <div className="input-label">
        <label htmlFor="">Kontakt</label>
        <input className="form-control" disabled type="text"
         value={studenti.Nr_Tel} />
        </div>
        
        <div className="input-label">
        <label htmlFor="">Statusi</label>
        <input className="form-control" disabled type="text"
        value={studenti.Statusi} />
        </div>
        
        </form>
        
        
    ): (
        <CircularProgress></CircularProgress>
    )}
    
    <h3 id="h3StudentiInfo2">Informatat Akademike</h3>

        { studenti ? (
        <form id="loginStudentDashboardData">

         <div className="input-label">
        <label htmlFor="">ID e Studentit</label>
        <input className="form-control" disabled 
        type="text" value={studenti.StudentiID} />
        </div>

        <div className="input-label">
        <label htmlFor="">Email Studentor</label>
        <input className="form-control" disabled type="text"
        value={studenti.EmailStudentor} />
        </div>

        <div className="input-label">
        <label htmlFor="">Fakulteti</label>
        <input className="form-control" disabled 
        type="text" value={studenti.Drejtimi ? studenti.Drejtimi : ''} />
        </div>

        <div className="input-label">
        <label htmlFor="">Niveli</label>
        <input className="form-control" disabled 
        type="text" value={studenti.Niveli} />
        </div>

         <div className="input-label">
        <label htmlFor="">Gjenerata</label>
        <input className="form-control" disabled 
        type="text" value={studenti.viti_akademik} />
        </div>

        <div className="input-label">
        <label htmlFor="">Data e Regjistrimit</label>
        <input className="form-control"  
        disabled type="text" 
        value={studenti.uKrijua ? new Date(studenti.uKrijua).toLocaleDateString() : ''} />
        </div>
        
        </form>
        
        
    ): (
        <CircularProgress></CircularProgress>
    )}
    </div>
        </div>
    )
}
export default Dashboard;