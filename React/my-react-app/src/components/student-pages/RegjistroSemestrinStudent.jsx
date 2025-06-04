import React, {useState, useEffect, useMemo} from "react";
import './assets/RegjistroSemestrin.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel  from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/RemoveCircle";

function RegjistroSemestrinStudent() {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [semestrat, setSemestrat] = useState([]);
    const [semestriID, setSemestriID] = useState('');
    const [semestratERegjistruar, setSemestratERegjistruar] = useState([]);
    const [uRegjistra, setURegjistrua] = useState(false);


    const handleReset = () => {

        setSemestriID(''); 
    }

    useEffect (() =>{
        
         fetchSemestrat();
         fetchSemestratERegjistruar();
        
    },[uRegjistra]);

    const fetchSemestratERegjistruar = async() =>{

      try{

        const response = await axiosInstance.get("student/lista-semestrave/registered");

        console.log(response.data);
        setSemestratERegjistruar(response.data);
      }
      catch(err){
        console.error(err.response.data);
      }
    }
    
 const fetchSemestrat = async () =>{

      try{
        const response = await axiosInstance.get("student/semestrat");

        console.log(response.data);
        setSemestrat(response.data);
      }catch(err){

        console.error(err);
      }
    }

  
    const deleteSemester = async (ID) => {

         const result = await Swal.fire({
                    
              background:"#F5F5F5",
              position: "center",
              title: "Dëshironi të ç'regjistroni semesterin?",
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
                popup:'popupDesign',
                title:'titleSwal'
              }
            });

        if(result.isConfirmed){

          setLoading(ID);
            try{

                const response = await axiosInstance.delete(`student/semestrat/delete/${ID}`);
                
            setTimeout(() => {

            
          
            Swal.fire({
            title: "Semestri u ç'regjistrua!",
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
            
           setSemestratERegjistruar(prev => prev.filter(sms => sms.ID !== ID));
            },1000);
                
            }catch(err){
                console.error("Error deleting semester:", err);
            }finally{
              setTimeout(() =>{
                setLoading(null);
              },1000);
            }
        }
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!semestriID ){

            await Swal.fire ({
            title: 'Fushat e zbrazura!',
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
}     setSubmitLoading(true);
        try{
            const response = await axiosInstance.post(`student/register/semester`,{
                
                Semestri_ID: semestriID

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
          setSubmitLoading(false);
      }, 1000);
    }
}

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Afati_Semestrit',headerName:'Afati i semestrit', width:350},
    {field:'NrSemestrit',headerName:'Semestri', width:120},
    {field:'VitiAkademik',headerName:'Viti akademik', width:150},
    {field:'uKrijua',headerName:'Data e regjistrimit', width:250},
    {
      field:'Delete',
      headerName:"Ç'regjistro semestrin",
      width:180,
      renderCell : (params) => (
          <Button 
          color="error" loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
          loading={loading === params.row.ID}
          variant="contained" sx={{width:'100%', textTransform:'none', fontFamily:'Montserrat'}}
          startIcon={<DeleteIcon sx={{color:'white'}}/>}
          onClick={() => deleteSemester(params.row.ID)}>
          Ç'regjistro
          </Button>
      )
    }
  ]

  const rows = useMemo(() => semestratERegjistruar.map((sms, index) => ({
    id:index + 1,
    ...sms,
    Afati_Semestrit: "Regjistrimi i " + sms.Afati_Semestrit.split(' ')[0] + 't ' + 
    sms.Afati_Semestrit.split(' ')[1] + " - " + sms.Niveli,
    uKrijua: sms.uKrijua ? new Date(sms.uKrijua).toLocaleString() : '',
    
  
  })), [semestratERegjistruar]);
    return (

        <div className="containerStdSemesters" id="fadeInPage">

        <h1 id="semesterH1">REGJISTRO SEMESTRIN</h1>

        <form className="formRegisterSemestri" onSubmit={handleSubmit}>

    <div className="input-label">
        <br />

        <FormControl sx={{paddingTop:'5px', marginTop:'-5px'}} fullWidth required>
         <InputLabel sx={{fontFamily:"Montserrat"}} id="statusi-label">Zgjedh Semestrin</InputLabel>
         <Select
      
           labelId="StatusiStudent-label"
           id="select-SemestriStudent"
           value={semestriID}
           
           label="Zgjedh Semestrin"
           sx={{
            fontFamily:"Montserrat", 
            borderRadius:'10px', 
            height:'45px', 
           }}
           onChange={(e) => setSemestriID(e.target.value)}
    
           MenuProps={{
             PaperProps: {
               style: {
                 maxHeight: 200,
                 overflowY: 'auto'
               },
             },
           }}
         >
           <MenuItem sx={{fontFamily:"Montserrat"}} disabled valu=""  >
            Zgjedh Semestrin
           </MenuItem>

           {semestrat.map((sms) =>(
            <MenuItem
            key={sms.Semestri_ID}
            value={sms.Semestri_ID}
            sx={{fontFamily:'Montserrat'}}
            >
              {`Semestri ${sms.NrSemestrit} - ${sms.Afati_Semestrit}`}

            </MenuItem>
           ))}
             
         </Select>
       </FormControl>
       </div>   


    <div className="input-labelSemestriStd">
        <Button variant="contained" id="primaryBtnSemestriStd" 
        loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={submitLoading} sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        type="submit">Regjistro</Button>
        
        <Button variant="contained" sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        id="resetBtnSemestriStd"  type='button' onClick={handleReset}>Reset</Button>
        
        </div>
        </form>

        {successMessage && (
        <div id="successMsgSemesterReg" className="fade-in" role="alert">
         <Alert severity="success">{successMessage} </Alert>
        </div>  
      )}  

      <div className="registeredSems" >
        <h4 id="h4Sems">LISTA E REGJISTRIMEVE TË SEMESTRAVE</h4>

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

export default RegjistroSemestrinStudent; 