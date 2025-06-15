import {useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom";

import "./assets/Students.css";
import Swal from "sweetalert2";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GradingIcon from '@mui/icons-material/Grading';

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axiosInstance from "../../../services/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";

function Students() {
 
  const [studentet , setStudentet] = useState([]);
  const [successMessage, setSuccessMessage ] = useState('');
  const [loading, setLoading] = useState(null);

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

      setLoading(ID);
    try{
      
      const response = await axiosInstance.delete(`studentet/delete/${ID}`);

      setTimeout(() => {
      
      setStudentet(prev => prev.filter(student => student.ID !==  ID));
      setSuccessMessage(response.data.message);
      
      setTimeout(() => setSuccessMessage (''),3000);
      },1000)

    } catch(err){
      console.error("Gabim gjate fshirjes!", err);
    }
    finally{
      setTimeout(() =>{
        setLoading(null);
      })
    }
  }
  }
  
  useEffect(() =>{

    fetchStudentet();

    const interval = setInterval(() => {
      fetchStudentet();
    }, 60000);

    return () => clearInterval(interval);

  },[]);


   const columns = [

        {field: 'id', headerName:'#', width:20},
        {field: 'StudentiID', headerName:'Student ID', width:120},
        {field: 'Emri', headerName:'Emri', width:100},
        {field: 'Mbiemri', headerName:'Mbiemri', width:100},
        {field: 'EmailStudentor', headerName:'Email Studentor', width:190},
        {field: 'Gjinia', headerName:'Gjinia', width:70},
        {field: 'Drejtimi', headerName:'Fakulteti', width:200},
        {field: 'Niveli', headerName:'Niveli', width:100},
        {field: 'Gjenerata', headerName:'Gjenerata', width:100},
     
        {

        field: 'Notat',
        headerName:'Lexo notat',
        width:120,
        renderCell: (params) => {

          const [editLoading, setEditLoading] = useState(false);
          
          const handleEditClick = (e) => {
              e.preventDefault();
              setEditLoading(true);
             
              setTimeout(() => {
              setEditLoading(false);
              window.location.href = `/notat/studenti/${params.row.ID}`;
              }, 500);
          };

         return(
          <Button id="editBtn" color="success"
          loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>}
          loading={editLoading} sx={{textTransform:'none', fontFamily:'Montserrat', }}
          variant="contained"
          onClick={handleEditClick} 
          startIcon={<GradingIcon sx={{color:"white"}}/>}>Notat</Button>
          
         )
      }
    },
      {

        field: 'Edit',
        headerName:'Përditëso',
        width:120,
        renderCell: (params) => {

          const [editLoading, setEditLoading] = useState(false);
          
          const handleEditClick = (e) => {
              e.preventDefault();
              setEditLoading(true);
             
              setTimeout(() => {
              setEditLoading(false);
              window.location.href = `/edit/studenti/${params.row.ID}`;
              }, 500);
          };

         return(
          <Button id="editBtn" color="primary" 
          loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>}
          loading={editLoading} sx={{textTransform:'none', fontFamily:'Montserrat', }}
          variant="contained"
          onClick={handleEditClick} 
          startIcon={<EditIcon sx={{color:"white"}}/>}>Edit</Button>
          
         )
      }
    },

      {

        field: 'Delete',
        headerName:'Fshij',
        width:120,
        renderCell: (params) =>(
          <Button color='error' sx={{width:'100%', textTransform:'none', fontFamily:'Montserrat'}} 
          variant='contained' loadingIndicator={<CircularProgress sx={{color:'white', marginLeft:'5px'}} size={25}/>} 
          loading={loading === params.row.ID} startIcon={<DeleteIcon sx={{color:"white"}}/>}
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
       '& .MuiInputBase-root': {
          fontFamily: 'Montserrat', 
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
