import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './assets/ListoProfesoret.css';

function ListaProfesoreve() {

    const API_URL = 'http://localhost:3000/'

    const [profesoret, setProfesoret] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');


    const fetchProfesoret = async () =>{

        try{

            const response = await axios.get(`${API_URL}profesoret/all`);

            setProfesoret(response.data);
            console.log(response.data);
        }catch(err){
            console.error(err);
        }
    }

    const deleteProfesorById = async (ID) => {
        
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

            const response = await axios.delete(`${API_URL}profesoret/delete/${ID}`);

            setProfesoret(prev => prev.filter(prof => prof.ProfesoriID !== ID));

            setSuccessMessage(response.data.message);

            setTimeout(() => { 
                setSuccessMessage ('')}, 5000);

        }catch(err){
            console.error(err);
        }
    }
    }

    useEffect(() =>{

        fetchProfesoret();

        const interval = setInterval(() => {

            fetchProfesoret
        },5000);

        return () => clearInterval(interval);

    },[])


    return (
        <div id='container' className='fadeInPage'>

            <h1>LISTA E PROFESORËVE</h1>
        
      {successMessage && (
        <div id="successMessageProf" className="alert alert-success fade-in" role="alert">
          {successMessage}
        </div>
      )}
      
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Emri</th>
            <th>Mbiemri</th>
            <th>Gjinia</th>
            <th>Email</th>
            <th>Fakulteti</th>
            <th>Kontakt</th>
            <th>Data e Punësimit</th>
            <th>Statusi</th>
            <th>Titulli Akademik</th>
            <th>Data e Regjistrimit</th>
            <th>Përditëso</th>
            <th>Fshij</th>
          </tr>
        </thead>
        <tbody>
          {profesoret.map((prof, index) => (
            <tr key={prof.ProfesoriID}>
              <td>{index + 1}</td>
              <td>{prof.Emri}</td>
              <td>{prof.Mbiemri}</td>
              <td>{prof.Gjinia}</td>
              <td>{prof.Email}</td>
              <td>{prof.Fakulteti}</td>
              <td>{prof.NrTel}</td>
              <td>{prof.Data_Punesimit ? new Date(prof.Data_Punesimit).toLocaleDateString() : ''}</td>
              <td>{prof.Statusi}</td>
              <td>{prof.Titulli_Akademik}</td>
              <td>{prof.uKrijua ? new Date(prof.uKrijua).toLocaleString()  : ''}</td>
              <td>
                
              <Link to={`/edit/profesori/${prof.ProfesoriID}`}>
          <button id="editBtn" className="btn btn-success">Edit</button>
              </Link>
              </td> 
              <td>

              <button className="btn btn-danger" 
                onClick={ () => deleteProfesorById(prof.ProfesoriID)}>Delete</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table> 
      </div>
    )
}

export default ListaProfesoreve;