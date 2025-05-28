import React, { useState, useEffect, useMemo } from "react";
import './assets/ListoAdminet.css';
import Swal from "sweetalert2"; 

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axiosInstance from "../../services/axiosInstance";

function ListoAdminet() {

    const [adminet, setAdminet] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
    fetchAdminet();

    const interval = setInterval(() => {
        fetchAdminet();
    }, 60000); 

    return () => clearInterval(interval);   
}, []);

    const fetchAdminet = async () => {
        try {
            const response = await axiosInstance.get(`admin/all`);
            
            setAdminet(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (AdminID) => {   
        
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
        })
        if(result.isConfirmed){
      
        try {
            const response = await axiosInstance.delete(`admin/delete/${AdminID}`);
            console.log(response.data);
            setAdminet((prevAdminet) => prevAdminet.filter((admin) => admin.AdminID !== AdminID));
            setSuccessMessage(response.data.message);
            setTimeout(() => { setSuccessMessage('') }, 3000);
            fetchAdminet();
        } catch (err) {
            console.error(err);
            setDataMessage(err.response.data.message);
        }
      }
    }
    const columns = [

        {field:'id', headerName:'#', width: 20},
        {field:'Emri_Adminit', headerName:'Emri', width: 150},
        {field:'Mbiemri_Adminit', headerName:'Mbiemri', width: 150},
        {field:'Email', headerName:'Email', width: 200},
        {field:'Fakulteti', headerName:'Fakulteti', width: 200},
        {field:'role', headerName:'Roli', width: 110},
        {field:'uKrijua', headerName:'Data e Regjistrimit', width: 180},

        {
        field: 'Edit',
        headerName:'Përditëso',
        width:120,
        renderCell: (params) =>(
          <Link to={`/edit/admin/${params.row.AdminID}`}>
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
                <Button id="deleteBtn" color="error" variant="contained"
                startIcon={<DeleteIcon sx={{color:"white"}}/>}
                onClick={() => handleDelete(params.row.AdminID)}>Fshij</Button>
            )
        }        
    ];

    const rows = useMemo(() => adminet.map((admin, index) => ({
        id: index + 1,
        ...admin,
        uKrijua: new Date(admin.uKrijua).toLocaleString(),

    })),[adminet]);

    return (

        <div id='container' className='fadeInPage'>

            <h1>LISTA E ADMINËVE</h1>
        
      {successMessage && (
        <div id="successMessageAdm" className="fade-in" role="alert">
          <Alert severity="success">  {successMessage}</Alert>
        </div>
      )}
     
          <div className="dataGridAdm" >
         <DataGrid
         
         disableColumnResize
         showCellVerticalBorder
         showColumnVerticalBorder
         scrollbarSize={0}
         initialState={{
                pagination: {
                paginationModel: {
                  pageSize:25,
                },
              },
            }}
         rows={rows}
         columns={columns}
         
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
           components={{ Toolbar: GridToolbar }}
          
          />
        </div>
      </div>
    )
}

export default ListoAdminet;
