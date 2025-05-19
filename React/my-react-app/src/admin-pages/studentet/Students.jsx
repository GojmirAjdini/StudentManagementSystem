import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom";

import "./assets/Students.css";
import Swal from "sweetalert2";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axiosInstance from "../../services/axiosInstance";

function Students() {
 
  const [studentet , setStudentet] = useState([]);
  const [successMessage, setSuccessMessage ] = useState('');

  const fetchStudentet = async () =>{
    try{

    const response = await axiosInstance.get(`admin/studentet/all`);
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
      text: "Ky veprim është i pakthyeshëm!",
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
      
      const response = await axiosInstance.delete(`studentet/delete/${ID}`);

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
          <Button id="editBtn" color="primary" variant="contained"
          startIcon={<EditIcon sx={{color:"white"}}/>}>Edit</Button>
          </Link>
        )
      },

      {

        field: 'Delete',
        headerName:'Fshij',
        width:120,
        renderCell: (params) =>(
          <Button color='error' sx={{width:'100%'}} 
          variant='contained' startIcon={<DeleteIcon sx={{color:"white"}}/>}
          onClick={ () => deleteStudent(params.row.ID)}>Delete</Button>

        )
      }
      ,]

    const rows = useMemo(() => studentet.map((student, index) =>({

      id: index + 1,
      ...student,
      uKrijua: new Date(student.uKrijua).toLocaleString(),
    })),
    [studentet]);

  return (

    <div className="fadeInPage" id="container">
      <h1>LISTA E STUDENTËVE</h1>

      {successMessage && (
        <div id="successMessage" className="fade-in" role="alert">
          <Alert severity="success">{successMessage} </Alert>
        </div>
      )}
          
        <div className="dataGridStd" >
       <DataGrid
       disableColumnResize
       showCellVerticalBorder
       showColumnVerticalBorder
       
       rows={rows}
       columns={columns}
       scrollbarSize={0}
       initialState={{
       pagination: {
       paginationModel: {
              pageSize:25,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 250 },
            sx: {
       '& .MuiButton-startIcon svg': {
         color: 'blue',
         
       },
       '& .MuiButton-root': {
         color: 'blue', 
         fontFamily:'Montserrat'
       },
     },
    },
      }}
      
        pageSizeOptions={[25, 50, 100]}
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
      disableRowSelectionOnClick
                
        />
      </div>
      </div>
  );
}

export default Students
