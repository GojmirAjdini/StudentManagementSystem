import React, {useEffect, useState} from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "../assets/Students.css";
import Swal from "sweetalert2";

function Students() {
 
  const [studentet , setStudentet] = useState([]);
  const [successMessage, setSuccessMessage ] = useState('');

  const API_URL = "http://localhost:3000/";

  const fetchStudentet = async () =>{
    try{

    const response = await axios.get(`${API_URL}studentet/all`);
    console.log(response.data);
    
    setStudentet(response.data);
  } catch(err){
    console.error("Error fetching studentet:", err);
  }
};

  const deleteStudent = async(ID) =>{

    
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
        popup:'popupDesign'
      }
    });

    if(result.isConfirmed){


    try{
      
      const response = await axios.delete(`${API_URL}studentet/delete/${ID}`);

      const message = response.data.message;

      setStudentet(prev => prev.filter(student => student.ID !==  ID));
      setSuccessMessage(message);
      console.log(message);
      setTimeout(() => setSuccessMessage (''),4000);
    } catch(err){
      console.error("Gabim gjate fshirjes!", err);
    }
  }
  }
  
  useEffect(() =>{
    fetchStudentet();

    const interval = setInterval(() => {
      fetchStudentet();
    }, 5000);

    return () => clearInterval(interval);

  },[]);

  return (

    <div className="fadeInPage" id="container">
      <h1>LISTA E STUDENTËVE</h1>

      {successMessage && (
        <div id="successMessage" className="alert alert-success fade-in" role="alert">
          {successMessage}
        </div>
      )}
      
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>StudentiID</th>
            <th>Emri</th>
            <th>Mbiemri</th>
            <th>Email Studentor</th>
            <th>Gjinia</th>
            <th>Vendlindja</th>
            <th>Fakulteti</th>
            <th>Niveli</th>
            <th>Statusi</th>
            <th>Kontakt</th>
            <th>Gjenerata</th>
            <th>Data e Regjistrimit</th>
            <th>Përditëso</th>
            <th>Fshij</th>
            
          </tr>
        </thead>
        <tbody>
          {studentet.map((student, index) => (
            <tr key={student.StudentiID}>
              <td>{index + 1}</td>
              <td>{student.StudentiID}</td>
              <td>{student.Emri}</td>
              <td>{student.Mbiemri}</td>
              <td>{student.EmailStudentor}</td>
              <td>{student.Gjinia}</td>
              <td>{student.Vendlindja}</td>
              <td>{student.Drejtimi}</td>
              <td>{student.Niveli}</td>
              <td>{student.Statusi}</td>
              <td>{student.Nr_Tel}</td>
              <td>{student.Gjenerata}</td>
              <td>{student.uKrijua ? new Date(student.uKrijua).toLocaleString()  : ''}</td>
              <td>
                
              <Link to={`/edit/${student.ID}`}>
          <button className="btn btn-success">Edit</button>
              </Link>
              </td> 
              <td>

              <button className="btn btn-danger" 
                onClick={ () => deleteStudent(student.ID)}>Delete</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table> 
      </div>
  );
}

export default Students
