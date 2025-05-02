import {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./assets/Fakultetet.css";
import Swal from "sweetalert2";

function ListaFakulteteve() {

    const [fakultetet, setFakultetet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const API_URL = "http://localhost:3000/";

    const fetchFakultetet = async () => {

        try{

            const response = await axios.get(`${API_URL}fakultetet/all`);
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

                const response = await axios.delete(`${API_URL}fakultetet/delete/${FakultetiID}`);
                
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

useEffect (() => {
    fetchFakultetet();

    const interval = setInterval(() => {
        fetchFakultetet();
    }, 5000);

    return () => setInterval(interval)
}, []);

    return(

        <div className="fade-in" id="container">

            <h1>LISTA E FAKULTETEVE</h1>

            {successMessage && (
        <div id="successMessageFkt" className="alert alert-success fade-in" role="alert">
          {successMessage}
        </div>
      )}

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
                    <button id="editBtn" className="btn btn-success">Edit</button>
                        </Link>
                    </td> 
                     <td>
                        
              <button className="btn btn-danger" 
               onClick={ () => deleteFakultet(fakulteti.FakultetiID)}>Delete</button>
              </td>
                    </tr>
                    ))}
                </tbody>            
            </table>
        </div>
    )
}
export default ListaFakulteteve;