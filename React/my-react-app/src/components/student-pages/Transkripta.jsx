import React, {useState, useEffect, useMemo} from "react";
import './assets/ProvimetEParaqitura.css';
import axiosInstance from "../../services/axiosInstance";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";

function Transkripta() {

    const [transkriptaNotave, setTranskriptaNotave] = useState([]);
    const [mesatarjaENotave, setMesatarjaENotave] = useState([]);

    useEffect (() =>{
        
      fetchNotat();
      fetchMesatarenENotave();
      
}, []);

    const fetchNotat = async() =>{

      try{

        const response = await axiosInstance.get("student/transkripta/notat");

        console.log(response.data);
        setTranskriptaNotave(response.data);

    }
      catch(err){
        console.error(err.response.data);
      }
    }

    const fetchMesatarenENotave = async() =>{

      try{

        const response = await axiosInstance.get("student/mesatarja/notat");

        console.log(response.data);
        setMesatarjaENotave(response.data);

    }
      catch(err){
        console.error(err.response.data);
      }
    }

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Kodi_Lendes',headerName:'Kodi', width:140},
    {field:'Emri_Lendes',headerName:'Lënda', width:350},
    {field:'ECTS',headerName:'Kredit(ECTS)', width:110},
    {field:'NrSemestrit',headerName:'Semestri', width:140},
    
    {field:'NOTA',headerName:'Nota', width:110},

  ]

  const rows = useMemo(() => transkriptaNotave.map((transk, index)  => ({
    id:index + 1,  
     ...transk, 
     NrSemestrit: "Semestri " + transk.NrSemestrit,
  
  })), [transkriptaNotave]);
    return (

        <div className="containerStdProvimetEParaqitura" id="fadeInPage">

        <h1 id="paraqituraH1">TRANSKRIPTA</h1>

      <div className="assignedExams" >

           <DataGrid
           disableColumnResize
          showColumnVerticalBorder
          showCellVerticalBorder
                
                rows={rows}
                density="compact"
                columns={columns}
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

            "& .MuiDataGrid-cell:focus": {
               outline: "none",
                    },
             "& .MuiDataGrid-cell:focus-within": {
               outline: "none",
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
            
                disableRowSelectionOnClick
                />
            {mesatarjaENotave.length > 0 && (
              <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '18px' }}>
                <strong>Mesatarja e Notave:</strong>{" "}
                {parseFloat(mesatarjaENotave[0].mesatarja_notave).toFixed(2)} <br />
                <strong>Gjithsej Kredite:</strong> {mesatarjaENotave[0].gjithsej_kredi} <br />
              </div>
            )}
        </div>
        
        
</div>
    )
}

export default Transkripta; 