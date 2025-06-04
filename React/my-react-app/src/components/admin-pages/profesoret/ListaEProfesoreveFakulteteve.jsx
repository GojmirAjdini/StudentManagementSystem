import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import './assets/ListaLendeveProfeve.css';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Swal from "sweetalert2"; 
import CircularProgress from "@mui/material/CircularProgress";

function FakultetetProfesoret(){

    const [fakultetetProfesoret, setFakultetetProfesoret] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(null);

    const fetchFakultetetProfesoret = async () => {
        try {
            const response = await axiosInstance.get(`admin/profesoret-fakultetet/all`);
            console.log(response.data);
            setFakultetetProfesoret(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteFakultetetProfesoret = async (FakultetiID, ProfesoriID) => {
        
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
              setLoading({FakultetiID, ProfesoriID});
        try {
            const response = await axiosInstance.delete(`admin/profesoret-fakultetet/deletesipas/${FakultetiID}/${ProfesoriID}`);
            
            setTimeout(() =>{
            setFakultetetProfesoret(prev => 
            prev.filter(fkt => !(fkt.FakultetiID === FakultetiID && fkt.ProfesoriID === ProfesoriID)));
            
            setSuccessMessage("Caktimi u fshi me sukses!");

            setTimeout(() => {
                setSuccessMessage("");  
            }, 3000);
          },1000);

        } catch (err) {
            console.error(err);
        }finally{
          setTimeout(() => {
            setLoading(null);
          }, 1000);
        }
    };
}
    useEffect(() => {
        fetchFakultetetProfesoret();
    
        const interval = setInterval(() => {
            fetchFakultetetProfesoret();
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const columns = [
        { field: "id", headerName: "#", width: 20 },
        { field: "EmriProfit", headerName: "Emri", width: 120 },
        { field: "Mbiemri", headerName: "Mbiemri", width: 120 },
        { field: "Email", headerName: "Email", width: 220 },
        { field: "Gjinia", headerName: "Gjinia", width: 80 },
        { field: "Titulli_Akademik", headerName: "Titulli", width: 100 },
        { field: "Emri", headerName: "Fakulteti", width: 220 },
        { field: "NiveliStudimit", headerName: "Niveli", width: 100 },
        { field: "Lokacioni", headerName: "Lokacioni", width: 110 },
        { field: "Kodi_Fakultetit", headerName: "Kodi i Fakultetit", width: 140 },

        {
            field: "Delete",
            headerName: "Largo caktimin",
            width: 135,
            renderCell: (params) => (
                <Button variant="contained" color="error"
                loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loading && loading.FakultetiID === params.row.FakultetiID && loading.ProfesoriID === params.row.ProfesoriID}
                    className="deleteBtn" sx={{width:'100%', textTransform:'none', fontFamily:'Montserrat',}}
                    onClick={() => deleteFakultetetProfesoret(params.row.FakultetiID, params.row.ProfesoriID)}
                >
                    Remove
                </Button>
            ),
        }
    ]

    const rows = useMemo(() => fakultetetProfesoret.map((fakultet, index) => ({
        id: index + 1,
        ...fakultet,
    })),
    [fakultetetProfesoret]);

    return (
        <div className="containerLendetProfet" id="fadeInPage">

            <h1 id="h1ProfeveLendve">LISTA E PROFESORËVE DHE FAKULTETEVE</h1>

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

export default FakultetetProfesoret;