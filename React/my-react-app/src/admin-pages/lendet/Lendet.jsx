import {useState, useEffect, useMemo} from "react";
import Swal from "sweetalert2";
import './assets/Lendet.css';
import {Link} from "react-router-dom";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import axiosInstance from "../../services/axiosInstance";


function Lendet() {

    const [lendet, setLendet] = useState([]);
    const [orgLendet, setOrgLendet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchLenda, setSearchLenda] = useState('');

    const fetchLendet = async () =>{

        try{
            const response = await axiosInstance.get(`admin/lendet/all`);
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
                const response = await axiosInstance.delete(`admin/lendet/delete/${LendaID}`);
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
            fetchLendet()}, 60000);

        return () => clearInterval(interval);

    },[]);

    const columns =  [
        
        {field: 'id', headerName:'#', width:20},
        {field: 'Emri_Lendes', headerName:'Lënda', width:200},
        {field: 'Fakulteti', headerName:'Fakulteti', width:180},
        {field: 'ECTS', headerName:'ECTS', width:80},
        {field: 'Kodi_Lendes', headerName:'Kodi i Lëndës', width:120},
        {field: 'Semestri', headerName:'Semestri', width:100},
        {field: 'uKrijua',headerName:'Data e Regjistrimit', width:180},
        {

            field:'Edit',
            headerName:'Përditëso',
            width:120,
            renderCell : (params) => (
                <Link to={`/edit/lenda/${params.row.LendaID}`}>
                <Button id="editBtnLenda" color="primary" variant="contained"
                startIcon={<EditIcon sx={{color:"white"}}/>}>Edit</Button>
                </Link>
            )
        },

        {

            field:'Delete',
            headerName:'Fshij',
            width:120,
            renderCell : (params) => (
                <Button 
                color="error"
                variant="contained" sx={{width:'100%'}}
                startIcon={<DeleteIcon sx={{color:'white'}}/>}
                onClick={() => deleteLenda(params.row.LendaID)}>
                Delete
                </Button>
            )
        }
    ]

    const rows = useMemo(() => lendet.map((lenda, index) => ({

        id:index + 1,
        ...lenda,   
        uKrijua: new Date(lenda.uKrijua).toLocaleString()
        
    }))
    , [lendet]); 

    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E LËNDËVE</h1>

            {successMessage && (    
                <div id="successMessageLendet" className="fade-in" role="alert">
                    <Alert severity="success">  {successMessage}</Alert>
                </div>
            )}
            
            <div id="dataGridLendet">
              <DataGrid
                disableColumnResize
                showCellVerticalBorder
                showColumnVerticalBorder
                rows={rows}
                columns={columns}
                scrollbarSize={0}
                initialState={{
                pagination: {
                paginationModel:{
                pageSize:25,
                }
                }
            } }

            
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
    )
}

export default Lendet;