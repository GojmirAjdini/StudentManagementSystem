import {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './assets/Lendet.css';
import { useParams, Link } from "react-router-dom";

function Lendet() {

    const API_URL = "http://localhost:3000/";
    const [lendet, setLendet] = useState([]);
    const [orgLendet, setOrgLendet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    
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
        fetchLendet();

        const interval = setInterval (() =>{
            fetchLendet()}, 5000);

        return () => clearInterval(interval);

    },[]);

    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E LËNDËVE</h1>

            {successMessage && (
                <div id="successMessageLendet" className="alert alert-success fade-in" role="alert">
                    {successMessage}
                </div>
            )}
            <table id="tableLendet" border="1">

                <thead>
                <tr>
                    <th>#</th>
                    <th>Lenda</th>
                    <th>Fakulteti</th>
                    <th>ECTS</th>
                    <th>Kodi i Lendes</th>
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
                            <button className="btn btn-success" id="btnEditLenda">
                            Edit </button></Link></td>
                        
                        <td> <button onClick={() => deleteLenda(lenda.LendaID)} className="btn btn-danger">Delete
                            
                            </button></td>
                        </tr>
                    ))}

                    </tbody>

            </table>
        </div>
    )
}

export default Lendet;