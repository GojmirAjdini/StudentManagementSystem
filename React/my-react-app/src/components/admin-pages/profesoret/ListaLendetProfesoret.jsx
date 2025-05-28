import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './assets/ListaLendeveProfeve.css';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Swal from "sweetalert2"; 
import CircularProgress  from "@mui/material/CircularProgress";

function LendetProfesoret(){

    const [lendetProfesoret, setLendetProfesoret] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(null);

    const fetchLendetProfesoret = async () => {
        try {
            const response = await axiosInstance.get(`admin/profesoret-lendet/all`);
            console.log(response.data);
            setLendetProfesoret(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteLendetProfesoret = async (LendaID, ProfesoriID) => {
        
        const result = await Swal.fire({
                    
              background:"#F5F5F5",
              position: "center",
              title: "Dëshironi të heqni caktimin?",
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
                popup:'popupDesignProfLenda',
                title:'titleSwal'
              }
            });
            if(result.isConfirmed){
        setLoading({ LendaID, ProfesoriID });
        try {
            const response = await axiosInstance.delete(`admin/profesoret-lendet/delete/${LendaID}/${ProfesoriID}`);
            
            setTimeout(() => {
            setLendetProfesoret(prev => 
            prev.filter(lenda => !(lenda.LendaID === LendaID && lenda.ProfesoriID === ProfesoriID)));
            
            setSuccessMessage(response.data.message);

            setTimeout(() => {
                setSuccessMessage("");  
            }, 3000);
          },1000);
        } catch (err) {
            console.error(err);
        }finally{
          setTimeout(() =>{
            setLoading(null);
          },1000);
        }
    };
}
    useEffect(() => {
        fetchLendetProfesoret();
    
        const interval = setInterval(() => {
            fetchLendetProfesoret();
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const columns = [
        { field: "id", headerName: "#", width: 20 },
        { field: "Emri", headerName: "Emri", width: 120 },
        { field: "Mbiemri", headerName: "Mbiemri", width: 120 },
        { field: "Email", headerName: "Email", width: 210 },
        { field: "Titulli_Akademik", headerName: "Titulli", width: 70 },
        { field: "Fakulteti", headerName: "Fakulteti", width: 200},
        { field: "Emri_Lendes", headerName: "Emri Lëndës", width:220 },
        { field: "Kodi_Lendes", headerName: "Kodi Lëndës", width: 110 },
        { field: "NrSemestrit", headerName: "Semestri", width: 85 },
        { field: "VitiAkademik", headerName:"Viti Akademik", width:120},

        {
            field: "Delete",
            headerName: "Largo caktimin",
            width: 125,
            renderCell: (params) => (
                <Button variant="contained" color="error"
                    className="deleteBtn" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                    loading={loading && loading.LendaID === params.row.LendaID && loading.ProfesoriID === params.row.ProfesoriID} 
                    sx={{width:'100%'}}
                    onClick={() => deleteLendetProfesoret(params.row.LendaID, params.row.ProfesoriID)}
                >
                    Remove
                </Button>
            ),
        }
    ]

    const rows = useMemo(() => lendetProfesoret.map((lenda, index) => ({
        id: index + 1,
        ...lenda,
    })),
    [lendetProfesoret]);

    return (
        <div className="containerLendetProfet" id="fadeInPage">

            <h1 id="h1ProfeveLendve">LISTA E PROFESORËVE DHE LËNDËVE</h1>

            {successMessage && (
        <div id="successMessageProfLenda" className="fade-in" role="alert">
          <Alert severity="success">  {successMessage}</Alert>
        </div>
      )}   
        

         <div className="dataGridProfLenda" >
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

export default LendetProfesoret;