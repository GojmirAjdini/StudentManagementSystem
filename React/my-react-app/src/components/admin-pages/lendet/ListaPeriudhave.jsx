import {useState, useEffect, useMemo} from "react";
import Swal from "sweetalert2";
import './assets/Lendet.css';

import Alert from '@mui/material/Alert';

import { DataGrid, GridToolbar} from '@mui/x-data-grid/';
import axiosInstance from "../../../services/axiosInstance";
import CircularProgress  from "@mui/material/CircularProgress";


function ListaPeriudhave() {

    const [infoMessage, setInfoMessage] = useState('Për të bërë ndryshime në datat e periudhave, ju lutem klikoni dy herë mbi datën që dëshironi të ndryshoni.');
    const [periudhat, setPeriudhat] = useState([]);
    const [orgPeriudhat, setOrgPeriudhat] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchPeriudhat = async () =>{

        try{
            const response = await axiosInstance.get(`admin/periudhat-provimeve`);
            
            setPeriudhat(response.data);
            console.log(periudhat);
        
        } catch(err){
            console.error("Error fetching periudhat", err); 
        }
    }

    const formatLocalDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

   const patchDatatEPeriudhave = async (updatedRow, originalRow) => {
 
    const datat = {
    Data_Fillimit: formatLocalDate(updatedRow.Data_Fillimit),
    Data_Perfundimit: formatLocalDate (updatedRow.Data_Perfundimit),
    Data_Perfundimit_Notave: formatLocalDate (updatedRow.Data_Perfundimit_Notave),
  };

  console.log("Patched:", datat);

  const isEqual =
    formatLocalDate(originalRow.Data_Fillimit) === datat.Data_Fillimit &&
    formatLocalDate(originalRow.Data_Perfundimit) === datat.Data_Perfundimit &&
    formatLocalDate(originalRow.Data_Perfundimit_Notave) === datat.Data_Perfundimit_Notave;

  if (isEqual) {
    setSuccessMessage('');
    return originalRow; 
  }

  try {
    const response = await axiosInstance.patch(
      `admin/periudhat-provimeve/patch/${updatedRow.PeriudhaID}`,
      datat
    );

    setSuccessMessage("Periudha e provimeve u përditësua me sukses!");

    setTimeout(() => {
      setSuccessMessage('');
    },3000);
    
    return updatedRow;
  } catch (err) {
    console.error("Error patching periudha:", err);
    return originalRow;
  }
};


    useEffect(() => {

        fetchPeriudhat();

        const interval = setInterval (() =>{
            fetchPeriudhat()}, 60000);

        return () => clearInterval(interval);

    },[]);

    const columns =  [
        
        {field: 'PeriudhaID', headerName:'#', width:20}, 
        {field: 'EmriPeriudhes', headerName:'Periudha', width:150},       
        {field: 'afatiPeriudhes', headerName:'Afati', width:120},
      {
        field: 'Data_Fillimit',
        headerName: 'Data e fillimit',
        width: 180,
        type: 'date',
        editable: true,
      },
      {
        field: 'Data_Perfundimit',
        headerName: 'Data e përfundimit',
        width: 200,
        type: 'date',
        editable: true,
      },
      {
        field: 'Data_Perfundimit_Notave',
        headerName: 'Data e fundit për regjistrimin e notave',
        width: 300,
        type: 'date',
        editable: true,
      },
      { field: 'VitiAkademik', headerName:'Viti akademik', width:140},

      ]   

    const rows = useMemo(() => periudhat.map((prd, index) => ({

    ...prd,
    Data_Fillimit: prd.Data_Fillimit ? new Date(formatLocalDate(prd.Data_Fillimit)) : null,
    Data_Perfundimit: prd.Data_Perfundimit ? new Date(formatLocalDate(prd.Data_Perfundimit)) : null,
    Data_Perfundimit_Notave: prd.Data_Perfundimit_Notave ? new Date(formatLocalDate(prd.Data_Perfundimit_Notave)) : null,
    afatiPeriudhes: "i " + prd.afatiPeriudhes,

})), [periudhat]);
    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E PERIUDHAVE TË PROVIMEVE</h1>

            
            {infoMessage && (    
                <div id="infoMsg" className="fade-in" style={{marginTop:'20px'}} role="alert">
                    <Alert severity="info">  {infoMessage}</Alert>
                </div>
            )}
              {successMessage && (    
                <div id="successMessageLendet" style={{top:'200px', left:'20%'}} className="fade-in" role="alert">
                    <Alert severity="success">  {successMessage}</Alert>
                </div>
            )}

            
            <div id="dataGridLendet">
              <DataGrid
                disableColumnResize
                showCellVerticalBorder
                getRowId={(rows) => rows.PeriudhaID}
                getRowHeight={() => 'auto'}
                showColumnVerticalBorder
                processRowUpdate={patchDatatEPeriudhave}
                experimentalFeatures={{ newEditingApi: true }}
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