import {useState, useEffect, useMemo} from "react";
import Swal from "sweetalert2";
import './assets/Lendet.css';
import {Link} from "react-router-dom";

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DataGrid, GridToolbar} from '@mui/x-data-grid/';
import axiosInstance from "../../../services/axiosInstance";
import CircularProgress  from "@mui/material/CircularProgress";


function ListaProvimeve() {

    const [provimet, setProvimet] = useState([]);
    const [orgLendet, setOrgLendet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(null);

    const fetchProvimet = async () =>{

        try{
            const response = await axiosInstance.get(`admin/provimet/sipas-afatit`);
            
            setProvimet(response.data);
            setOrgLendet(response.data);
        
        } catch(err){
            console.error("Error fetching lendet", err); 
        }
    }

    const deleteProvimet = async (ProvimiID) => {

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

            setLoading(ProvimiID);
            try{
                const response = await axiosInstance.delete(`admin/provimet/delete/${ProvimiID}`);
                
                setTimeout(() => {
                setSuccessMessage(response.data.message);
                setProvimet(prev => prev.filter(prv => prv.ProvimiID !== ProvimiID));

              setTimeout(() => {
              setSuccessMessage('')
            },3000);

            },1000);   

            } catch(err){
                console.error("Error deleting provimi", err); 
            }finally{
                setTimeout(() =>{
                    setLoading(null);
                },1000);
            }
        }
    }

    useEffect(() => {

       fetchProvimet();
    },[]);

    const columns =  [
        
        {field: 'id', headerName:'#', width:20},
        {field: 'Emri_Lendes', headerName:'Lënda', width:250},
        {field: 'Kodi_Lendes', headerName:'Kodi i Lëndës', width:140},
        {field: 'ECTS', headerName:'ECTS', width:100},
        {field: 'Emri', headerName:'Fakulteti', width:220},
        {field: 'Niveli', headerName:'Niveli', width:140},
        {field: 'Semestri', headerName:'Semestri', width:120},
        {field: 'data_mbajtjes_provimit', headerName:'Data e provimit', width:170},
        {

            field:'Delete',
            headerName:'Fshij provimin',
            width:130,
            renderCell : (params) => (
                <Button 
                color="error"
                variant="contained" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loading === params.row.ProvimiID} 
                sx={{width:'100%', marginTop:'5px', marginBottom:'5px', 
                textTransform:'none', fontFamily:'Montserrat'}}
                startIcon={<DeleteIcon sx={{color:'white'}}/>}
                onClick={() => deleteProvimet(params.row.ProvimiID)}>
                Fshij
                </Button>
            )
        }
    ]   

    const rows = useMemo(() => provimet.map((provimet, index) => ({

        id:index + 1,
        ...provimet,
        Semestri: "Semestri " + provimet.Semestri,   
        data_mbajtjes_provimit: 
        new Date(provimet.data_mbajtjes_provimit).toLocaleDateString('en-GB'),

})), [provimet]); 

    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E PROVIMEVE</h1>

            {successMessage && (    
                <div id="successMessageLendet" className="fade-in" role="alert">
                    <Alert severity="success">  {successMessage}</Alert>
                </div>
            )}
            
            <div id="dataGridLendet">
              <DataGrid
                disableColumnResize
                showCellVerticalBorder
                getRowHeight={() => 'auto'}
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
             '& .MuiInputBase-root': {
              fontFamily: 'Montserrat', 
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

export default ListaProvimeve;