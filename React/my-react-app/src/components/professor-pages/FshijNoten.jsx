import React, {useState, useEffect, useMemo} from "react";
import './assets/FshijNoten.css';
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import axiosInstance from "../../services/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";


function FshijNoten() {
   
    const [loading, setLoading] = useState(null);
    const [provimetStudentet, setProvimetStudentet] = useState([]);


    useEffect (() =>{
        
      fetchProvimetEMija();
      
}, []);

    const fetchProvimetEMija = async() =>{

      try{

        const response = await axiosInstance.get("profesor/notat/regjistruara");

        console.log(response.data);
        setProvimetStudentet(response.data);
        

    }
      catch(err){
        console.error(err.response.data);       
      }
    }

    const handleDelete = async(rezultatiID) =>{

        setLoading(rezultatiID);
        try{
            const response = await axiosInstance.delete(`profesor/notat-regjistruara/delete/${rezultatiID}`)
        
        setTimeout(() =>{
        
          Swal.fire({
            title: 'Sukses!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor:'#3085d6',
            customClass: {
                confirmButton: 'swal-confirmBtn',
                popup: 'popupDesign',
                htmlContainer: 'textSwal',
                 }
             });
        setProvimetStudentet(prev => prev.filter(pep => pep.RezultatiID !== rezultatiID))
        setTimeout(() => {setSuccessMessage('')
        
        },3000);
        
      },1000)
        }catch(err){

            console.error(err);
            if  (err.response && err.response.data && err.response.data.message) {
            
            setTimeout(() => {
            Swal.fire({
            title: 'Gabim!',
            text: err.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor:'#d33',
            customClass: {
                confirmButton: 'swal-confirmBtn',
                popup: 'popupDesign',
                htmlContainer: 'textSwal',
                 }
             });
            },1000);
          }
    }setTimeout(() =>{
        setLoading(null);
      },1000);
}

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Emri',headerName:'Emri', width:130},
    {field:'Mbiemri',headerName:'Mbiemri', width:130},
    {field:'EmailStudentor',headerName:'Email', width:200},
    {field:'Emri_Lendes',headerName:'Emri lëndës', width:200},
    {field:'Kodi_Lendes',headerName:'Kodi', width:120},
    {field:'NOTA',headerName:'Nota e regjistruar', width:150},

     {
    field:'Fshij',
       headerName:'Fshij notën',
       width:180,
       renderCell : (params) => (
           <Button 
           color="error" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
           loading={loading === params.row.RezultatiID}
           variant="contained" sx={{width:'100%', textTransform:'none', 
           fontFamily:'Montserrat', marginTop:'5px', marginBottom:'5px',}}
           onClick={ () => handleDelete(params.row.RezultatiID)}
            >  
           Ç'regjistro notën
           </Button>
       )
        },
  ]

  const rows = useMemo(() => provimetStudentet.map((prv, index) => ({
    id:index + 1,
     ...prv,
  
  })), [provimetStudentet]);
    return (

        <div className="containerParaqitProvimin" id="fadeInPage">

        <h1 id="notatERegjistruar">LISTA E NOTAVE TË REGJISTRUAR</h1>

      <div className="registeredGrades" >

           <DataGrid
           disableColumnResize
          showColumnVerticalBorder
          showCellVerticalBorder

                rows={rows}
                columns={columns}
                getRowHeight={() => 'auto'}
                scrollbarSize={0}
                initialState={{
                pagination: {
                paginationModel: {
                  pageSize:25,
                },
              },
            }}
        
       pageSizeOptions={[25, 50, 100]}
             sx={{
              fontFamily:'Montserrat',

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
                color:'black',
             },
             
             '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
             
               },        
             "& .MuiDataGrid-columnHeader:focus": {
               outline: "none",
                    },
             "& .MuiDataGrid-columnHeader:focus-within": {
               outline: "none",
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
                disableRowSelectionOnClick
                />
                </div>

        </div>

    )
}

export default FshijNoten; 