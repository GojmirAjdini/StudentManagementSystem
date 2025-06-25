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


function ListaPeriudhave() {

    const [periudhat, setPeriudhat] = useState([]);
    const [orgLendet, setOrgLendet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(null);

    const fetchPeriudhat = async () =>{

        try{
            const response = await axiosInstance.get(`admin/periudhat-provimeve`);
            
            setPeriudhat(response.data);
        
        } catch(err){
            console.error("Error fetching periudhat", err); 
        }
    }

    useEffect(() => {

        fetchPeriudhat();

        const interval = setInterval (() =>{
            fetchLendet()}, 60000);

        return () => clearInterval(interval);

    },[]);

    const columns =  [
        
        {field: 'id', headerName:'#', width:20}, 
        {field: 'EmriPeriudhes', headerName:'Periudha', width:150},       
        {field: 'afatiPeriudhes', headerName:'Afati', width:120},
        {field: 'Data_Fillimit', headerName:'Data e fillimit', width:150},
        {field: 'Data_Perfundimit', headerName:'Data e përfundimit', width:180},
        {field: 'Data_Perfundimit_Notave', headerName:'Data e fundit për regjistrimin e notave', width:300},
       
    ]   

    const rows = useMemo(() => periudhat.map((prd, index) => ({

        id:index + 1,
        ...prd,   
        Data_Fillimit: prd.Data_Fillimit ? new Date(prd.Data_Fillimit).toLocaleDateString('en-GB') : 'N/A',
        Data_Perfundimit: prd.Data_Perfundimit ? new Date(prd.Data_Perfundimit).toLocaleDateString('en-GB') : 'N/A',
        Data_Perfundimit_Notave: prd.Data_Perfundimit_Notave ? new Date(prd.Data_Perfundimit_Notave).toLocaleDateString('en-GB') : 'N/A',
        afatiPeriudhes: "i " + prd.afatiPeriudhes,
    }))
    , [periudhat]); 

    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E PERIUDHAVE TË PROVIMEVE</h1>

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

export default ListaPeriudhave;