import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../services/axiosInstance";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './assets/LendetEMija.css';

function LendetSipasProfit(){

    const [lendet, setLendet] = useState([]);

    const fetchLendet = async () => {
        try {
            const response = await axiosInstance.get(`profesor/MY/lendet`);
            console.log(response.data);
            setLendet(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLendet();
    
        const interval = setInterval(() => {
            fetchLendet();
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const columns = [
        
        { field: "id", headerName: "#", width: 20 },
        { field: "Emri_Lendes", headerName: "Emri Lëndës", width:330 },
        { field: "Fakulteti", headerName: "Fakulteti", width: 220},
        { field: "Kodi_Lendes", headerName: "Kodi", width: 120 },
        { field: "NrSemestrit", headerName: "Semestri", width: 100 },

    ]

    const rows = useMemo(() => lendet.map((lenda, index) => ({
        id: index + 1,
        ...lenda,
    })),
    [lendet]);

    return (
        <div className="containerLendeteMija" id="fadeInPage">

            <h1 id="h1Lendve">LISTA E LËNDËVE QË LIGJËROJË</h1>

         <div className="dataGridLendaIme" >
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
                    fontFamily: 'Montserrat',
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

export default LendetSipasProfit;