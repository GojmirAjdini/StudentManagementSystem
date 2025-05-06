import {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './assets/Lendet.css';
import {Link} from "react-router-dom";
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';


function Lendet() {

    const API_URL = "http://localhost:3000/";
    const [lendet, setLendet] = useState([]);
    const [orgLendet, setOrgLendet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [dataMessage, setDataMessage] = useState('');
    const [searchLenda, setSearchLenda] = useState('');

    
    const fetchLendet = async () =>{

        try{
            const response = await axios.get(`${API_URL}lendet/all`);
            console.log(response.data);

            setLendet(response.data);
            setOrgLendet(response.data);

        } catch(err){
            console.error("Error fetching lendet", err); 
        }
    }

    const handleReset = () =>{
        setSearchLenda('');
    }

    const handleSearch = async () =>{

        if(!searchLenda){
            setDataMessage('Ju lutem shënoni lëndën!');

            setTimeout(() => {setDataMessage('')},3000);
            return;
        }
        try{

            const response = await axios.get(`${API_URL}lendet/lenda/search?Emri_Lendes=${searchLenda}`);
            
            console.log(response.data);
            setLendet(response.data);
        }catch(err){
            console.error(err);
            setDataMessage(err.response.data.message);

            setTimeout(() => { setDataMessage('')},3000);
        }

    }

    const deleteLenda = async (LendaID) => {

        const result = await Swal.fire({
            background:"#F5F5F5",
            position: "center",
            title: "Dëshironi t'i fshini të dhënat?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',      
            confirmButtonText: 'Po, fshij!',
            cancelButtonText: 'Jo, anulo',
            timer:5000,
            customClass: {
                confirmButton:'swal-confirmBtn',
                cancelButton: 'swal-confirmBtn',
                popup:'popupDesign',
                title:'titleSwal'
            }
        });

        if(result.isConfirmed){

            try{
                const response = await axios.delete(`${API_URL}lendet/delete/${LendaID}`);
                const message = response.data.message;
                setLendet(prev => prev.filter(lenda => lenda.LendaID !==  LendaID));
                setSuccessMessage(message);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);   

            } catch(err){
                console.error("Error deleting lenda", err); 
            }
        }
    }

    useEffect(() => {

        if(searchLenda){

            return; 
        }

        fetchLendet();

        const interval = setInterval (() =>{
            fetchLendet()}, 5000);

        return () => clearInterval(interval);

    },[searchLenda]);

    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E LËNDËVE</h1>

            {successMessage && (    
                <div id="successMessageLendet" className="fade-in" role="alert">
                    <Alert severity="success">  {successMessage}</Alert>
                </div>
            )}

        {dataMessage && (
                <div id="dataMsgLendet" className="fade-in" role="alert">
                  <Alert severity="info">  {dataMessage}</Alert>
                </div>
            )}   
        
        <div id="searchBtnHolder">
            
            <input id="searchLendaInput"
              type="text"
              placeholder="Kërko lëndën..."
              value={searchLenda}
              onChange={(e) => setSearchLenda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="form-control mb-3"
            />

            <Button onClick={handleSearch} variant="contained" color="primary" className="mb-3" >
                <Search></Search> Kërko</Button>
            <Button onClick={handleReset} variant="contained" id="resetSearchLnd" className="mb-3">Reset</Button>

            </div>
            <table id="tableLendet" border="1">

                <thead>
                <tr>
                    <th>#</th>
                    <th>Lënda</th>
                    <th>Fakulteti</th>
                    <th>ECTS</th>
                    <th>Kodi i Lëndës</th>
                    <th>Semestri</th>
                    <th>Data e Regjistrimit</th>
                    <th>Përditëso</th>
                    <th>Fshij</th>
                </tr>
                </thead>
                    <tbody>
                    {lendet.map((lenda, index) => (
                    <tr key={lenda.LendaID}>
                    <td>{index + 1}</td>
                    <td>{lenda.Emri_Lendes}</td>
                    <td>{lenda.Fakulteti}</td>
                    <td>{lenda.ECTS}</td>
                    <td>{lenda.Kodi_Lendes}</td>
                    <td>{lenda.Semestri}</td>
                    <td>{lenda.uKrijua ? new Date(lenda.uKrijua).toLocaleString() : ''}</td>
                        
                        <td><Link to={`/edit/lenda/${lenda.LendaID}`}> 
                        <Button id="editBtn" color="success" variant="contained"
                        startIcon={<Edit sx={{color:"white"}}/>}>Edit</Button></Link></td>
                        
                        <td> <Button color="error" variant="contained" startIcon={<Delete sx={{color:"white"}}/>}
                        onClick={() => deleteLenda(lenda.LendaID)} className="btn btn-danger">Delete
                            
                            </Button></td>
                        </tr>
                    ))}

                    </tbody>

            </table>
        </div>
    )
}

export default Lendet;