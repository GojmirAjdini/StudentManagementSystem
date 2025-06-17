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
    {field:'Emri_Lendes',headerName:'Lënda', width:400},
    {field:'ECTS',headerName:'Kredit(ECTS)', width:110},
    {field:'NrSemestrit',headerName:'Semestri', width:140},
    {field:'NOTA',headerName:'Nota', width:110},
    {field:'NotaShkronje',headerName:'Nota shkronjë', width:140},
  ]

  const rows = useMemo(() => transkriptaNotave.map((transk, index)  => ({
    id:index + 1,  
     ...transk, 
     NrSemestrit: "Semestri " + transk.NrSemestrit,
    NotaShkronje: transk.NOTA === '10' ? 'A' : 
    (transk.NOTA === '9' ? 'B' : (transk.NOTA === '8' ? 'C' : 
    (transk.NOTA === '7' ? 'D' : (transk.NOTA === '6' ? 'E' : ''))) ),
  
  })), [transkriptaNotave]);
    return (

        <div className="containerStdProvimetEParaqitura" id="fadeInPage">

        <h1 id="paraqituraH1">TRANSKRIPTA E NOTAVE</h1>

      <div className="assignedExams" >

        
        <div className="stdData" style={{display:'flex', flexDirection:'column', 
          width:'100%', marginTop:'-30px',marginBottom:'20px', textAlign:'start'}}>    
                <h6>Studenti - {transkriptaNotave[0]?.Emri} {transkriptaNotave[0]?.Mbiemri}</h6>
                <h6>Drejtimi - {transkriptaNotave[0]?.Drejtimi}</h6>
                <h6>Niveli - {transkriptaNotave[0]?.Emri_Nivelit}</h6>
                <h6>Statusi - {transkriptaNotave[0]?.statusi} </h6>
             </div> 

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
                <strong>Mesatarja e notave:</strong>{" "}
                {parseFloat(mesatarjaENotave[0].mesatarja_notave).toFixed(2)} <br />
                <strong>Gjithsej kredite:</strong> {mesatarjaENotave[0].gjithsej_kredi} <br />
              </div>
            )}
        </div>
        
        
</div>
    )
}

export default Transkripta; 