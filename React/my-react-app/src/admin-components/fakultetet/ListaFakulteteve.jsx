import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./assets/Fakultetet.css";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';

function ListaFakulteteve() {

    const [fakultetet, setFakultetet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchFakulteti, setSearchFakulteti] = useState('');
    const [dataMessage, setDataMessage] = useState('');

    const API_URL = "http://localhost:3000/";

    const fetchFakultetet = async () => {

        try{

            const response = await axios.get(`${API_URL}admin/fakultetet/all`, {withCredentials:true});
            console.log(response.data);
            setFakultetet(response.data);
        }catch(err){
            console.error("Error fetching fakultetet:", err);

        }
    }
    const deleteFakultet = async (FakultetiID) => {

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

                const response = await axios.delete(`${API_URL}admin/fakultetet/delete/${FakultetiID}`,
                     {withCredentials:true});
                
                const message = response.data.message;
                setFakultetet(prev => prev.filter(fakultet => fakultet.FakultetiID !==  FakultetiID));
                setSuccessMessage(message);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);   
                
            }catch(err){
                console.error("Error deleting fakultetin:", err);
            }
        }
    }

    const handleReset = () =>{
        setSearchFakulteti('');
    }

    const handleSearch = async() =>{

        if(!searchFakulteti){

            setDataMessage('Ju lutem shënoni Fakultetin!');

            setTimeout(() =>{ setDataMessage('')},3000);

            return;
        }
        try{

            const response = await axios.get(`${API_URL}admin/fakultetet/fakulteti/search?Emri=${searchFakulteti}`,
                 {withCredentials:true});

            console.log(response.data);
            setFakultetet(response.data);
        } 
        catch(err){
            console.error(err);
            setDataMessage(err.response.data.message);

            setTimeout(() => { setDataMessage('')},3000);
        }
    }

useEffect (() => {

    if(searchFakulteti){

        return;
    }
    fetchFakultetet();

    const interval = setInterval(() => {
        fetchFakultetet();
    }, 5000);

    return () => clearInterval(interval)
}, [searchFakulteti]);

    return(

        <div className="fade-in" id="container">

            <h1>LISTA E FAKULTETEVE</h1>

            {successMessage && (
        <div id="successMessageFkt" className="fade-in" role="alert">
          <Alert severity="success">{successMessage}</Alert>
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
              placeholder="Kërko fakultetin..."
              value={searchFakulteti}
              onChange={(e) => setSearchFakulteti(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="form-control mb-3"
            />

            <Button onClick={handleSearch} variant="contained" color="primary" className="mb-3" >
                <Search></Search> Kërko</Button>
            <Button onClick={handleReset} variant="contained" id="resetSearchLnd" className="mb-3">Reset</Button> 
      
        </div>
            <table border="1">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Fakulteti</th>
                    <th>Niveli</th>
                    <th>Lokacioni</th>
                    <th>Kodi Fakultetit</th>
                    <th>Data e Regjistrimit</th>
                    <th>Përditëso</th>
                    <th>Fshij</th>
                </tr>
                </thead>
                    <tbody>

                    {fakultetet.map((fakulteti, index) =>(

                        <tr key={fakulteti.FakultetiID}>
                        <td>{index + 1}</td>
                        <td>{fakulteti.Emri}</td>
                        <td>{fakulteti.Niveli}</td>
                        <td>{fakulteti.Lokacioni}</td>
                        <td>{fakulteti.Kodi_Fakultetit}</td> 
                        <td>{fakulteti.uKrijua ? new Date(fakulteti.uKrijua).toLocaleString() : ''}</td> 

                        {console.log(fakulteti.uKrijua)}
                    <td>
                        <Link to={`/edit/fakulteti/${fakulteti.FakultetiID}`}>
                        <Button id="editBtn" color="success" variant="contained"
                        startIcon={<Edit sx={{color:"white"}}/>}>Edit</Button>
                        </Link>
                    </td> 
                     <td>
                        
              <Button color='error' variant='contained' startIcon={<Delete sx={{color:"white"}}/>}
               onClick={ () => deleteFakultet(fakulteti.FakultetiID)}>Delete</Button>
              </td>
                    </tr>
                    ))}
                </tbody>            
            </table>
        </div>
    )
}
export default ListaFakulteteve;