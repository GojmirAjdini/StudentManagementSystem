import React, {useState, useEffect, useMemo} from "react";
import './assets/ProvimetEParaqitura.css';
import axiosInstance from "../../services/axiosInstance";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

function ProvimetEParaqitura() {

      
    const [loadingAnuloID, setLoadingAnuloID] = useState(false);
    const [loadingRefuzoID, setLoadingRefuzoID] = useState(false);

    const [provimetEParaqitura, setProvimetEParaqitura] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect (() =>{
        
      fetchProvimetEParaqitura();
      
}, []);

    const fetchProvimetEParaqitura = async() =>{

      try{

        const response = await axiosInstance.get("student/provimet/paraqitura/student");

        console.log(response.data);
        setProvimetEParaqitura(response.data);

    }
      catch(err){
        console.error(err.response.data);
      }
    }

    const anuloParaqitjen = async(RegjistrimiProvimitID) =>{

        setLoadingAnuloID(RegjistrimiProvimitID);

        try{
            const response = await axiosInstance.delete(`student/anulo-paraqitjen/provimet-paraqitura/
                ${RegjistrimiProvimitID}`);

            setTimeout(() => {
            setSuccessMessage(response.data.message);
            setProvimetEParaqitura(prev => prev.filter(pep => pep.RegjistrimiProvimitID !== RegjistrimiProvimitID));

          setTimeout(() => {
          setSuccessMessage('')
        },3000);

        },1000);  
                
            }catch(err){
                console.error(err);
            }finally{
              setTimeout(() =>{
                setLoadingAnuloID(null);
              },1000);
            }
    }

    const refuzoProvimin = async(RezultatiID) =>{

        setLoadingRefuzoID(RezultatiID);

        try{
            const response = await axiosInstance.delete(`student/refuzo-noten/provimet-paraqitura/
                ${RezultatiID}`);

            setTimeout(() => {
            setSuccessMessage(response.data.message);
            setProvimetEParaqitura(prev => prev.filter(pep => pep.RezultatiID !== RezultatiID));

          setTimeout(() => {
          setSuccessMessage('')
        },3000);

        },1000);  
                
            }catch(err){
                console.error(err);
            }finally{
              setTimeout(() =>{
                setLoadingRefuzoID(null);
              },1000);
            }
    }

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Kodi_Lendes',headerName:'Kodi', width:120},
    {field:'Emri_Lendes',headerName:'Lënda', width:220},
    {field:'Date_Paraqitjes',headerName:'Data e paraqitjes së provimit', width:240},
    {field:'NOTA',headerName:'Nota', width:110},
    {field:'Data_Vendosjes_Notes',headerName:'Data e vendosjes së notës', width:220},

    {
         field:'Anulo',
            headerName:'Anulo paraqitjen',
            width:140,
            renderCell : (params) => (
                <Button 
                color="primary" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loadingAnuloID === params.row.RegjistrimiProvimitID}
                variant="contained" sx={{width:'100%', textTransform:'none', 
                fontFamily:'Montserrat', marginTop:'5px', marginBottom:'5px',}}
                disabled={!!params.row.NOTA} 
                onClick={() => anuloParaqitjen(params.row.RegjistrimiProvimitID)}>
                    
                Anulo
                </Button>
            )
    }, {
    
        field:'Refuzo',
            headerName:'Refuzo notën',
            width:120,
            renderCell : (params) => (
               
                <Button 
                color="primary" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loadingRefuzoID === params.row.RezultatiID}
                variant="contained" sx={{width:'100%', textTransform:'none', 
                fontFamily:'Montserrat',  marginTop:'5px', marginBottom:'5px',}}

                disabled={!params.row.NOTA}
                onClick={() => refuzoProvimin(params.row.RezultatiID) && anuloParaqitjen(params.row.RegjistrimiProvimitID)}>
                Refuzo
                </Button>
            )
        
        }
  ]

  const rows = useMemo(() => provimetEParaqitura.map((pep, index) => ({
    id:index + 1,  
     ...pep,
    Date_Paraqitjes: new Date(pep.Date_Paraqitjes).toLocaleString(),
    Data_Vendosjes_Notes: pep.Data_Vendosjes_Notes ? new Date(pep.Data_Vendosjes_Notes).toLocaleString() : '', 
  
  })), [provimetEParaqitura]);
    return (

        <div className="containerStdProvimetEParaqitura" id="fadeInPage">

        <h1 id="paraqituraH1">PROVIMET E PARAQITURA</h1>

         {successMessage && (
          <div id="successMsgAssignedExams" className="fade-in" role="alert">
           <Alert severity="success">{successMessage} </Alert>
          </div>  
        )}  

      <div className="assignedExams" >

           <DataGrid
           disableColumnResize
          showColumnVerticalBorder
          showCellVerticalBorder
                getRowHeight={() => "auto"}
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
                </div>

        </div>

    )
}

export default ProvimetEParaqitura; 