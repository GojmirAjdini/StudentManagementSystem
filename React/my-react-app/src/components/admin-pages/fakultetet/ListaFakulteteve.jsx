import {useState, useEffect, useMemo} from "react";
import { Link } from "react-router-dom";

import "./assets/Fakultetet.css";
import Swal from "sweetalert2";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axiosInstance from "../../../services/axiosInstance";

import CircularProgress from "@mui/material/CircularProgress";

function ListaFakulteteve() {

    const [fakultetet, setFakultetet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(null);

    const fetchFakultetet = async () => {

        try{

            const response = await axiosInstance.get(`admin/fakultetet/all`);
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

          setLoading(FakultetiID);
            try{

                const response = await axiosInstance.delete(`admin/fakultetet/delete/${FakultetiID}`);
                
                 setTimeout(() => {
            setSuccessMessage(response.data.message);
            setFakultetet(prev => prev.filter(fkt => fkt.FakultetiID !== FakultetiID));

          setTimeout(() => {
          setSuccessMessage('')
        },3000);

        },1000);  
                
            }catch(err){
                console.error("Error deleting fakultetin:", err);
            }finally{
              setTimeout(() =>{
                setLoading(null);
              },1000);
            }
        }
    }

   
useEffect (() => {

    fetchFakultetet();

    const interval = setInterval(() => {
        fetchFakultetet();
    }, 60000);

    return () => clearInterval(interval)
}, []);

    const columns = [

        {field:'id', headerName:'#', width:70},
        {field: 'Emri', headerName:'Fakulteti', width:200},
        {field: 'Niveli', headerName:'Niveli', width:120},
        {field: 'Lokacioni', headerName:'Lokacioni', width:120},
        {field: 'Kodi_Fakultetit', headerName:'Kodi i Fakultetit', width:150},
        {field: 'uKrijua', headerName:'Data e Regjistrimit', width:180},
    
        {
            field:'Edit',
            headerName:'Përditëso',
            width:120,
            renderCell: (params) => {

               const [editLoading, setEditLoading] = useState(false);
              
              const handleEditClick = (e) => {
                  e.preventDefault();
                  setEditLoading(true);
                  setTimeout(() => {
                  setEditLoading(false);
              
                      window.location.href = `/edit/fakulteti/${params.row.FakultetiID}`;
                  }, 500);
              };
              return (
              
                <Button id="editBtn" color="primary" variant="contained"
                startIcon={<EditIcon sx={{color:"white"}}/>} 
                onClick={handleEditClick} sx={{textTransform:'none',fontFamily:'Montserrat'}}
                loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={editLoading}>Edit</Button>
                
              );
    }
  },
    {
         field:'Delete',
            headerName:'Fshij',
            width:120,
            renderCell : (params) => (
                <Button 
                color="error" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loading === params.row.FakultetiID}
                variant="contained" sx={{width:'100%', textTransform:'none', 
                fontFamily:'Montserrat'}}
                startIcon={<DeleteIcon sx={{color:'white'}}/>}
                onClick={() => deleteFakultet(params.row.FakultetiID)}>
                Delete
                </Button>
            )
        }
    ]

    const rows = useMemo(() => fakultetet.map((fakultet, index) => ({

        id:index + 1,
        ...fakultet,
        uKrijua: new Date(fakultet.uKrijua).toLocaleString()
    })),
    [fakultetet] );

    return(

        <div className="fade-in" id="container">

            <h1>LISTA E FAKULTETEVE</h1>

            {successMessage && (
        <div id="successMessageFkt" className="fade-in" role="alert">
          <Alert severity="success">{successMessage}</Alert>
        </div>
      )}

            <div className="dataGridFakultet" >
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
    )
}
export default ListaFakulteteve;