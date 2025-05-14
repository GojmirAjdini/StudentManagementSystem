import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom";
import axios from "axios";
import "./assets/Students.css";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";

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


   const columns = [

        {field: 'id', headerName:'#', width:20},
        {field: 'StudentiID', headerName:'Student ID', width:120},
        {field: 'Emri', headerName:'Emri', width:100},
        {field: 'Mbiemri', headerName:'Mbiemri', width:100},
        {field: 'EmailStudentor', headerName:'Email Studentor', width:190},
        {field: 'Gjinia', headerName:'Gjinia', width:70},
        {field: 'Vendlindja', headerName:'Vendlindja', width:120},
        {field: 'Drejtimi', headerName:'Fakulteti', width:200},
        {field: 'Niveli', headerName:'Niveli', width:100},
        {field: 'Gjenerata', headerName:'Gjenerata', width:100},
     
      {

        field: 'Edit',
        headerName:'Përditëso',
        width:120,
        renderCell: (params) =>(
          <Link to={`/edit/studenti/${params.row.ID}`}>
          <Button id="editBtn" color="success" variant="contained"
          startIcon={<Edit sx={{color:"white"}}/>}>Edit</Button>
          </Link>
        )
      },

      {

        field: 'Delete',
        headerName:'Fshij',
        width:120,
        renderCell: (params) =>(
          <Button color='error' sx={{width:'100%'}} 
          variant='contained' startIcon={<Delete sx={{color:"white"}}/>}
          onClick={ () => deleteStudent(params.row.ID)}>Delete</Button>

        )
      }
      ,]

    const rows = studentet.map((student, index) =>({

      id: index + 1,
      ...student,
      uKrijua: new Date(student.uKrijua).toLocaleString(),
    }))

  return (

    <div className="fadeInPage" id="container">
      <h1>LISTA E STUDENTËVE</h1>

      {successMessage && (
        <div id="successMessage" className="fade-in" role="alert">
          <Alert severity="success">{successMessage} </Alert>
        </div>
      )}

      {dataMessage && (
                <div id="dataMsgStd" className="fade-in" role="alert">
                  <Alert severity="info">  {dataMessage}</Alert>
                </div>
            )}   

        <div id="searchBtnHolderStd">
            
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
            <Button onClick={handleReset} variant="contained" id="resetSearchStd" className="mb-3">Reset</Button> 
      </div>

        <div className="dataGridStd" >
       <DataGrid
       disableColumnResize
       showCellVerticalBorder
       showColumnVerticalBorder
       
       rows={rows}
       columns={columns}
       scrollbarSize={{}}
       initialState={{
       pagination: {
       paginationModel: {
              pageSize:100,
            },
          },
        }}
      
      sx={{
            
      "& .MuiDataGrid-cell:focus": {
           outline: "none",
                },
       "& .MuiDataGrid-cell:focus-within": {
           outline: "none",
       },
      
        "& .MuiDataGrid-columnHeader":{
            backgroundColor:'#f5f5f5',
         },
    
       "& .MuiDataGrid-columnHeader:focus": {
           outline: "none",
        },
        "& .MuiDataGrid-columnHeader:focus-within": {
           outline: "none",
       },
         }}
      checkboxSelection
      disableRowSelectionOnClick
                
        />
      </div>
      </div>
  );
}

export default Students
