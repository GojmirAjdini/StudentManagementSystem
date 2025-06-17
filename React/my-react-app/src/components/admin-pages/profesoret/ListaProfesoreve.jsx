import {useState, useEffect, useMemo} from 'react';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';
import './assets/ListoProfesoret.css';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Loading from '../login-register/utils/Loading';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import axiosInstance from '../../../services/axiosInstance';
import CircularProgress  from '@mui/material/CircularProgress';

function ListaProfesoreve() {

    const [profesoret, setProfesoret] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(null);

    const fetchProfesoret = async () =>{

        try{

            const response = await axiosInstance.get(`admin/profesoret/all`);
            
            console.log(response.data);
            setProfesoret(response.data);
            
        }catch(err){
            console.error(err);
        }
    }

    const deleteProfesorById = async (ID) => {
        
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

            const response = await axiosInstance.delete(`admin/profesoret/delete/${ID}`);

            setTimeout(() => {
            setSuccessMessage(response.data.message);
            setProfesoret(prev => prev.filter(prof => prof.ProfesoriID !== ID));

          setTimeout(() => {
          setSuccessMessage('')
        },5000);

        },1000);

        }catch(err){
            console.error(err);
        }finally{
          setTimeout(() =>{
            setLoading(false);
          },1000);
        }
      }
    }

    useEffect(() =>{


        fetchProfesoret();

    },[])

     const columns = [

        {field:'id', headerName:'#', width:20},
        {field: 'Emri', headerName:'Emri', width:100},
        {field: 'Mbiemri', headerName:'Mbiemri', width:100},
        {field: 'Gjinia', headerName:'Gjinia', width:70},
        {field: 'Fakulteti', headerName:'Fakulteti', width:200, renderCell: (params) => (
    <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.3, fontFamily: 'Montserrat', }}>
      {params.value}
    </div>
  )},
        
        {field: 'NrTel', headerName:'Kontakt', width:100},
        {field: 'Email', headerName:'Email Akademik', width:220},
        {field: 'Titulli_Akademik', headerName:'Titulli Akademik', width:140},
     
      {

        field: 'Edit',  
        headerName:'Përditëso',
        width:120,
        renderCell: (params) =>{

          const [editLoading, setEditLoading] = useState(false);
          
          const handleEditClick = (e) =>{
            e.preventDefault();
            setEditLoading(true);

            setTimeout(() =>{
              setEditLoading(false);
              window.location.href = `/edit/profesori/${params.row.ProfesoriID}`; 
            },500);
        }
          return (
          <Button id="editBtn" color="primary" variant="contained"
          sx={{textTransform:'none', fontFamily:'Montserrat'}}
          loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>}
          loading={editLoading}
          onClick={handleEditClick}
          startIcon={<EditIcon sx={{color:"white"}}/>}>
            Edit</Button>
          
        )
      }
    },

      {

        field: 'Delete',
        headerName:'Fshij',
        width:120,
        renderCell: (params) =>(
          <Button color='error' sx={{width:'100%', textTransform:'none', fontFamily:'Montserrat'}} 
          loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
          loading={loading === params.row.ProfesoriID}
          variant='contained' startIcon={<DeleteIcon sx={{color:"white"}}/>}
          onClick={ () => deleteProfesorById(params.row.ProfesoriID)}>Delete</Button>

        )
      }
      ]

    const rows = useMemo(() => profesoret.map((prof, index) => ({

      id:index + 1,
      ...prof,
      Fakulteti: prof.Fakulteti ? prof.Fakulteti : 'null',
      Data_Punesimit: new Date(prof.Data_Punesimit).toLocaleDateString(),

    }))
    , [profesoret]);


    return (
        <div id='container' className='fadeInPage'>

            <h1>LISTA E PROFESORËVE</h1>
        
      {loading && <Loading/>}  
      {successMessage && (
        <div id="successMessageProf" className="fade-in" role="alert">
          <Alert severity="success">  {successMessage}</Alert>
        </div>
      )}   
        
           <div className="dataGridProf">
         <DataGrid
         autoPageSize
         disableColumnResize
         showCellVerticalBorder
         getRowId={(row) => row.ProfesoriID}
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
          showToolbar
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
    )
}

export default ListaProfesoreve;