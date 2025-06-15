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
    const [ekziston, setEkziston] = useState([]);
    const [afatiNotimit, setAfatiNotimit] = useState([]);
    const [refuzimiLejuar, setRefuzimiLejuar] = useState({});

    useEffect (() =>{
        
      fetchProvimetEParaqitura();
      afatiProvimeve();
      afatiFunditNotave();
  
}, []);

    const afatiProvimeve = async() =>{
    
          try{
    
            const response = await axiosInstance.get("student/ekziston/afati-provimeve");
    
          
            setEkziston(response.data);
    
        }
          catch(err){
            console.error(err.response.data);
          }
        }

        
    const afatiFunditNotave = async() =>{
    
          try{
    
            const response = await axiosInstance.get("student/ekziston/afati-perfundimit-notave");
    
          
            setAfatiNotimit(response.data);
    
        }
          catch(err){
            console.error(err.response.data);
          }
        }

     const kontrolloRefuzimin = async (RegjistrimiProvimitID) => {
  
      try {
    const response = await axiosInstance.get(
      `student/kontrollo-noten/provimit/${RegjistrimiProvimitID}`
    );

    const lejohetRefuzimi = response?.data[0]?.RefuzimiLejuar;
    
    setRefuzimiLejuar((prev) => ({
      ...prev,
      [RegjistrimiProvimitID]: lejohetRefuzimi,
    }));
  } catch (err) {
    console.error(err);
  }
};

   const fetchProvimetEParaqitura = async () => {
  try {
    const { data } = await axiosInstance.get("student/provimet/paraqitura/student");

    const tempRefuzimiLejuar = {};
    
   
    await Promise.all(data.map(async (row) => {
      if (row.RegjistrimiProvimitID) {
        const response = await axiosInstance.get(`student/kontrollo-noten/provimit/${row.RegjistrimiProvimitID}`);
        const lejohetRefuzimi = response?.data[0]?.RefuzimiLejuar;
        tempRefuzimiLejuar[row.RegjistrimiProvimitID] = lejohetRefuzimi;
      }
    }));

    setRefuzimiLejuar(tempRefuzimiLejuar);
    setProvimetEParaqitura(data);
    
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

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

  const refuzoDheAnulo = async (RezultatiID, RegjistrimiProvimitID) => {
  
  setLoadingRefuzoID(RezultatiID);
  
  try {
    const refuzoResponse = await axiosInstance.delete(`student/refuzo-noten/provimet-paraqitura/${RezultatiID}`);
    const anuloResponse = await axiosInstance.delete(`student/anulo-paraqitjen/provimet-paraqitura/${RegjistrimiProvimitID}`);

    setTimeout(() =>{
    setSuccessMessage(refuzoResponse.data.message);
    setProvimetEParaqitura(prev =>
      prev.filter(pep => pep.RezultatiID !== RezultatiID && pep.RegjistrimiProvimitID !== RegjistrimiProvimitID)
    );

    setTimeout(() => setSuccessMessage(''), 3000);
  },1000);

  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => {
      setLoadingRefuzoID(null);
      setLoadingAnuloID(null);
    }, 1000);
  }
};

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Kodi_Lendes',headerName:'Kodi', width:120},
    {field:'Emri_Lendes',headerName:'Lënda', width:220},
    {field:'Profesori',headerName:'Profesori', width:160},
    {field:'NOTA',headerName:'Nota', width:110},
    {field:'Data_Vendosjes_Notes',headerName:'Data e vendosjes së notës', width:220},

    {
         field:'Anulo',
            headerName:'Anulo paraqitjen e provimit',
            width:220,
            renderCell : (params) => (
                <Button 
                color="primary" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loadingAnuloID === params.row.RegjistrimiProvimitID}
                variant="contained" sx={{width:'100%', textTransform:'none', 
                fontFamily:'Montserrat', marginTop:'5px', marginBottom:'5px',}}
                disabled={ekziston.length === 0}
                
                onClick={() => anuloParaqitjen(params.row.RegjistrimiProvimitID)}>
                    
                Anulo paraqitjen
                </Button>
            )
    }, {
    
        field:'Refuzo',
            headerName:'Refuzo notën',
            width:160,
            renderCell : (params) => (
      
                <Button 
                color="primary" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
                loading={loadingRefuzoID === params.row.RezultatiID}
                variant="contained" sx={{width:'100%', textTransform:'none', 
                fontFamily:'Montserrat',  marginTop:'5px', marginBottom:'5px',}}

                disabled={!params.row.NOTA || refuzimiLejuar[params.row.RegjistrimiProvimitID] === 0}
                onClick={ () => refuzoDheAnulo(params.row.RezultatiID, params.row.RegjistrimiProvimitID)}
                > 
                Refuzo notën
                </Button>
                
            )
        
        }
  ]

  const rows = useMemo(() => { 
  
    return provimetEParaqitura
    .filter(pep => refuzimiLejuar[pep.RegjistrimiProvimitID] !== 0)
    .map((pep, index) => ({
    id:index + 1 || '',  
     ...pep,
    Date_Paraqitjes: new Date(pep.Date_Paraqitjes).toLocaleString(),
    Data_Vendosjes_Notes: pep.Data_Vendosjes_Notes ? new Date(pep.Data_Vendosjes_Notes).toLocaleString() : '', 
    Profesori: pep.Emri + " " + pep.Mbiemri
  }));
},
[provimetEParaqitura, refuzimiLejuar]);

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