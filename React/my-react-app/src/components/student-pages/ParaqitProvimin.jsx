import React, {useState, useEffect, useMemo} from "react";
import './assets/ParaqitProvimin.css';
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
import Cancel from "@mui/icons-material/Cancel";

function ParaqitProvimin() {

    
    const text = <p  style={{marginLeft:'5px'
    }}>
      <strong>Vërejtje!</strong> Para se të paraqitni provimin, 
      është e domodoshme të zgjedhni profesorin tek i cili keni dëgjuar lëndën!</p>  
      
      
    const [infoMessage, setInfoMessage] = useState(text);
    
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [provimiID, setProvimiID] = useState('');
    const [provimetPerParaqitje, setProvimetPerParaqitje] = useState([]);
    const [uRegjistra, setURegjistrua] = useState(false);
    const [selectedProfessors, setSelectedProfessors] = useState({});
    const [profesoretMap, setProfesoretMap] = useState({});

    const handleClose = () => {
        setInfoMessage('');
    }

    const handleProfessorChange = (provimiID, profesoriID) => {
     setSelectedProfessors(prev => ({
    ...prev,
    [provimiID]: { ProfesoriID: profesoriID, ProvimiID: provimiID }
   }));
  };


    useEffect (() =>{
        
      fetchProvimetPerParaqitje();
      
}, []);

   const profesoretSipasProvimi = async (provimet) => {
    const map = {};

      for (const provimi of provimet) {
         try {
          const response = await axiosInstance.get(`student/profesoret/provimi/${provimi.ProvimiID}`);
          map[provimi.ProvimiID] = response.data;
  
        } catch (err) {
            console.error(err);
          }
        }
      
        setProfesoretMap(map);
      };


    const fetchProvimetPerParaqitje = async() =>{

      try{

        const response = await axiosInstance.get("student/lista/provimeve");

        console.log(response.data);
        setProvimetPerParaqitje(response.data);
        await profesoretSipasProvimi(response.data);

    }
      catch(err){
        console.error(err.response.data);
      }
    }

    const handleSubmit = async(id) =>{
        
        setSubmitLoading(true);
        try{
            const response = await axiosInstance.post(`student/paraqit-provimin`,{
                
                ProvimiID: id

                });
     
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
     

        setTimeout(() => {setSuccessMessage('')
        
        },3000);
        

        }catch(err){

            console.error(err);
            if  (err.response && err.response.data && err.response.data.message) {
            
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
          }
    }
}

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Kodi_Lendes',headerName:'Kodi', width:150},
    {field:'Emri_Lendes',headerName:'Lënda', width:220},
    {field:'ECTS',headerName:'Kredit (ECTS)', width:150},
    {field:'NrSemestrit',headerName:'Semestri', width:120},

    {
    field:'professorSelect',
    headerName:'Zgjedh profesorin',
    width:250,
    renderCell: (params) => {
     
      const selectedProfessorID = selectedProfessors[params.row.ProvimiID]?.ProfesoriID || '';

      const profesoret = profesoretMap[params.row.ProvimiID] || [];

      return (
        <FormControl fullWidth>
          <Select
            value={selectedProfessorID}
            onChange={(e) => handleProfessorChange(params.row.ProvimiID, e.target.value)}
            displayEmpty
            size="small"
            color="primary"
            sx={{fontFamily:"Montserrat", 
              border:'none',
              height:'35px',
              marginTop:'5px', 
              marginBottom:'5px',
              fontSize:'14px'}}
          >
            <MenuItem value="" sx={{fontFamily:"Montserrat", border:'none'}} disabled>
              Zgjedh profesorin
            </MenuItem >
            {profesoret.map((prof) => (
              <MenuItem sx={{fontFamily:"Montserrat", border:'none'}} key={prof.ProfesoriID} value={prof.ProfesoriID}>
                {`${prof.Emri} ${prof.Mbiemri}`}
                
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
  },
    {
      field:'Paraqit',
      headerName:"Paraqite provimin",
      width:180,
      renderCell : (params) => (
          <Button 
          color="primary" loadingIndicator={<CircularProgress sx={{color:'white', }} size={25}/>} 
          loading={loading === params.row.ProvimiID}
          variant="contained" sx={{width:'100%', height:'auto', marginTop:'5px', 
            marginBottom:'5px', fontFamily:'Montserrat', padding:'5px',textTransform:'none'}}
          onClick={async() => {
            const selected = selectedProfessors[params.row.ProvimiID];

            if(!selected || !selected.ProvimiID){
              await Swal.fire({
                 title: 'Profesor i pa zgjedhur!',
                 text: 'Ju lutem zgjidhni profesorin për këtë lëndë para se të vazhdoni.',
                 icon: 'warning',
                 confirmButtonText: 'OK',
                 confirmButtonColor: '#3085d6',
                 customClass: {
                   confirmButton: 'swal-confirmBtn',
                   popup: 'popupDesign',
                   htmlContainer: 'textSwal',
                 }
               });
               return;
            }
           
            setLoading(params.row.ProvimiID);

            await new Promise(resolve => setTimeout(resolve, 1000));

            await handleSubmit(selected.ProvimiID);
            
            setLoading(null);   
          }}
          >
          Paraqite provimin
          </Button>
      )
    }
  ]

  const rows = useMemo(() => provimetPerParaqitje.map((fps, index) => ({
    id:index + 1,
     ...fps,
    NrSemestrit: "Semestri " + fps.NrSemestrit,
   

    
  
  })), [provimetPerParaqitje]);
    return (

        <div className="containerParaqitProvimin" id="fadeInPage">

        <h1 id="paraqitjaProvimeveH1">PARAQITJA E PROVIMEVE</h1>

         {infoMessage && (
        <div id="infoMessageProvimet" role="alert">
          <Cancel color="action" sx={{position:'absolute', right:'0px', top:'2px', 
            height:'18px', ":hover":{color:'black', cursor:'pointer'}}} onClick={handleClose}/>
         <Alert sx={{paddingTop:'12px', paddingRight:'40px', paddingBottom:'0px',fontSize:'14px' }} severity="info">{infoMessage} </Alert>
        
            </div>
        )}

         {successMessage && (
                <div id="successMsgSemesterReg" className="fade-in" role="alert">
                 <Alert severity="success">{successMessage} </Alert>
                </div>  
              )}  

      <div className="assignExams" >

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

export default ParaqitProvimin; 