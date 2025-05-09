import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom";
import axios from "axios";
import "./assets/Students.css";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';

function Students() {
 
  const [studentet , setStudentet] = useState([]);
  const [successMessage, setSuccessMessage ] = useState('');
  const [searchStudenti, setSearchStudenti ] = useState('');
  const [dataMessage, setDataMessage ] = useState('');

  const API_URL = "http://localhost:3000/";

  const fetchStudentet = async () =>{
    try{

    const response = await axios.get(`${API_URL}admin/studentet/all`, {withCredentials:true});
    console.log(response.data);
    
    setStudentet(response.data);
  } catch(err){
    console.error("Error fetching studentet:", err);
  }
};

  const handleReset = () =>{

    setSearchStudenti('');
  }

  const handleSearch = async () =>{

    if(!searchStudenti){

      setDataMessage('Ju lutem shënoni Studentin!');

      setTimeout(() => { setDataMessage('')},3000);

      return;
    }

    try{

      const response = await axios.get(`${API_URL}admin/studentet/studenti/search?Emri=${searchStudenti}`, {withCredentials:true});

      console.log(response.data);
      setStudentet(response.data);
    
    }catch(err){
      console.error(err);
        setDataMessage(err.response.data.message);

        setTimeout(() => { setDataMessage('')},3000);
    }
  }  

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
        popup:'popupDesign',
        title:'titleSwal'
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

    if(searchStudenti){
      return;
    }

    fetchStudentet();

    const interval = setInterval(() => {
      fetchStudentet();
    }, 5000);

    return () => clearInterval(interval);

  },[searchStudenti]);

  return (

    <div className="fadeInPage" id="container">
      <h1>LISTA E STUDENTËVE</h1>

      {successMessage && (
        <div id="successMessage" className="fade-in" role="alert">
          <Alert severity="success">{successMessage} </Alert>
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
              placeholder="Kërko studentin..."
              value={searchStudenti}
              onChange={(e) => setSearchStudenti(e.target.value)}
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
                
              <Link to={`/edit/studenti/${student.ID}`}> 
          <Button id="editBtn" color="success" variant="contained"
          startIcon={<Edit sx={{color:"white"}}/>}>Edit</Button>
              </Link>
              </td> 
              <td>

              <Button color='error' variant='contained' startIcon={<Delete sx={{color:"white"}}/>}
                onClick={ () => deleteStudent(student.ID)}>Delete</Button>

              </td>
            </tr>
          ))}
        </tbody>
      </table> 
      </div>
  );
}

export default Students
