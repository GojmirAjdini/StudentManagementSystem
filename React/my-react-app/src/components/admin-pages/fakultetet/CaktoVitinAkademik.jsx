import React, {useState, useEffect, useMemo} from "react";
import './assets/CaktoSemestrin.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../../services/axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";

function CaktoVitinAkademik() {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [viti_Fillimit, setViti_Fillimit] = useState('');
    const [viti_Mbarimit, setViti_Mbarimit] = useState('');
    const [vitetAkademike, setVitetAkademike] = useState([]);
    const [uRegjistra, setURegjistrua] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleReset = () => {

      setViti_Fillimit('');
      setViti_Mbarimit('');
       
    }

    useEffect(() => {

        fetchVitetAkademike();

    },[uRegjistra])

    const isValidNumber = (value) => {
  return /^\d{4}$/.test(value); 
};

    const fetchVitetAkademike = async() =>{

        try{
            const response = await axiosInstance.get("admin/vitet/akademike/all");

            setVitetAkademike(response.data);
            console.log(response.data);

        }catch(err){
            console.error(err);
        }
    }

    const fshijVitinAkademik = async (vitiAkademikID) => {
    
     setLoadingDelete(vitiAkademikID);
       try{
        const response = await axiosInstance.delete(`admin/fshij/vitin-akademik/${vitiAkademikID}`);
           
       setTimeout(() => {
     
       Swal.fire({
       title: "Viti akademik u ç'regjistrua!",
       text: response.data.message,
       icon: 'success',
       confirmButtonText: 'OK',
       confirmButtonColor:'#3085d6',
       timer:3000,
       customClass: {
           confirmButton: 'swal-confirmBtn',
           popup: 'popupDesign',
           htmlContainer: 'textSwal',
            }
        });
    
      setVitetAkademike(prev => prev.filter(vit => vit.VitiAkademikID !== vitiAkademikID));
       },1000);
       }
       catch(err){
           console.error("Error deleting semester:", err);
       }
       finally{
         setTimeout(() =>{
           setLoadingDelete(null);
         },1000);
        }
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        
        if(!isValidNumber(viti_Fillimit) || !isValidNumber(viti_Mbarimit)){

            await Swal.fire ({
            title: 'Fushat gabim!',
               text: 'Ju lutem plotësoni të gjithë fushat. ',
               icon: 'info',
               confirmButtonText: 'OK',
               confirmButtonColor:'#3085d6',
               timer:5000,
               customClass: {
               confirmButton: 'swal-confirmBtn',
               popup: 'popupDesign',
               htmlContainer: 'textSwal',
            }
        })
    return;
}     setLoading(true);
        try{
            const response = await axiosInstance.post(`admin/cakto/vitin-akademik`,{
                
                Viti_Fillimit: viti_Fillimit,
                Viti_Mbarimit: viti_Mbarimit,

                });
        
        setTimeout(() => {
     
        setSuccessMessage(response.data.message);
        setURegjistrua(true);

        setTimeout(() => {setSuccessMessage('')
        
        },5000);
        
      }, 1000);

        }catch(err){

            console.error(err);
            if  (err.response && err.response.data && err.response.data.message) {
            
            setTimeout(()  =>{

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
    }
    finally{
      setTimeout(() => {
          setLoading(false);
      }, 1000);
    }
}


  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'VitiAkademik',headerName:'Viti akademik', width:180},
    {field:'Viti_Fillimit',headerName:'Viti i fillimit', width:150},
    {field:'Viti_Mbarimit',headerName:'Viti i mbarimit', width:150},
    {
      field:'Delete',
      headerName:"Ç'regjistro vitin akademik",
      width:220,
      renderCell : (params) => (
    
        <Button
        color="error" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loadingDelete === params.row.VitiAkademikID}
        variant="contained" sx={{width:'100%', textTransform:'none', fontFamily:'Montserrat'}}
        onClick={() => fshijVitinAkademik(params.row.VitiAkademikID)}>
        Ç'regjistro
          </Button>
      )
    }
  ]

  const rows = useMemo(() => vitetAkademike.map((vak, index) => ({
    id:index + 1,
    ...vak,
    
  
  })), [vitetAkademike]);

    return (

        <div className="containerSemestri" id="fadeInPage">

        <h1 id="semesterH1">CAKTO VITIN AKADEMIK</h1>

        <form className="formSemestri" onSubmit={handleSubmit}>

    <div className="input-label">
        <label >Viti fillimit <span>*</span></label>
        <input className="form-control" required type="text" placeholder="YYYY" value={viti_Fillimit} 
        onChange={(e) => setViti_Fillimit(e.target.value)} />
        </div> 

    <div className="input-label">
    <label >Viti mbarimit <span>*</span></label>
    <input className="form-control" required type="text" placeholder="YYYY" value={viti_Mbarimit} 
    onChange={(e) => setViti_Mbarimit(e.target.value)} />
    </div> 
       

    <div className="input-labelSemestri">
        <Button variant="contained" id="primaryBtnSemestri" 
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loading} disabled={loading} sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        type="submit">Cakto</Button>
        <Button sx={{textTransform:'none', fontFamily:'Montserrat'}}
        variant="contained" id="resetBtnSemestri"  type='button' onClick={handleReset}>Reset</Button>
        </div>
        </form>

        {successMessage && (
        <div id="successMsgLndProf" className="fade-in" role="alert">
         <Alert severity="success">{successMessage} </Alert>
        </div>  
      )} 

      <div className="registeredVitetAkademike" >
  <h4 id="h4Sems">LISTA E VITEVE AKADEMIKE</h4>
     <DataGrid
     disableColumnResize
    showColumnVerticalBorder
    showCellVerticalBorder
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
          backgroundColor:'rgb(101, 64, 235)',
          color:'white',
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

export default CaktoVitinAkademik; 