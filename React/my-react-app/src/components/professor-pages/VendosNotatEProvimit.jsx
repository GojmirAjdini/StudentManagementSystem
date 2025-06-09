import React, {useState, useEffect, useMemo} from "react";
import './assets/VendosNoten.css';
import Swal from "sweetalert2";
import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import axiosInstance from "../../services/axiosInstance";
import FormControl from '@mui/material/FormControl';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";


function VendosNotatEProvimit() {
    
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(null);
    const [provimetStudentet, setProvimetStudentet] = useState([]);
    const [notaMap, setNotaMap] = useState({});


    useEffect (() =>{
        
      fetchProvimetEMija();
      
}, []);


const handleNotaChange = (provimiID, notaValue) => {
    setNotaMap((prev) => ({
      ...prev,
      [provimiID]: notaValue
    }));
  };

    const fetchProvimetEMija = async() =>{

      try{

        const response = await axiosInstance.get("profesor/MY/provimet");

        console.log(response.data);
        setProvimetStudentet(response.data);
        

    }
      catch(err){
        console.error(err.response.data);       
      }
    }

    const handleSubmit = async(provimiID, notaValue) =>{

        setLoading(provimiID);
        try{
            const response = await axiosInstance.post(`profesor/provimet/cakto-noten`,{
                
                Nota: notaValue,
                ProvimiID: provimiID

                });
        
        setTimeout(() =>{
        
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
        
      },1000)
        }catch(err){

            console.error(err);
            if  (err.response && err.response.data && err.response.data.message) {
            
            setTimeout(() => {
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
    }setTimeout(() =>{
        setLoading(null);
      },1000);
}

  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Emri',headerName:'Emri', width:130},
    {field:'Mbiemri',headerName:'Mbiemri', width:130},
    {field:'EmailStudentor',headerName:'Email', width:200},
    {field:'Emri_Lendes',headerName:'Emri lëndës', width:200},
    {field:'Kodi_Lendes',headerName:'Kodi lëndës', width:120},

    {
    field:'VendosNoten',
    headerName:'Vendos notën',
    width:180,
    renderCell: (params) => {
     
      const notaValue = notaMap[params.row.ProvimiID] || '';

      return (
        <FormControl fullWidth>
          <Select
            value={notaValue}
            onChange={(e) => handleNotaChange(params.row.ProvimiID, e.target.value)}
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
              Vendos notën
            </MenuItem >
              <MenuItem value="jo prezent" sx={{fontFamily:"Montserrat"}} type="text">
                jo prezent
              </MenuItem>
              <MenuItem value="5" type="text" sx={{fontFamily:"Montserrat"}} >
               5
              </MenuItem>
              <MenuItem value="6" type="text" sx={{fontFamily:"Montserrat"}} >
                6
              </MenuItem>
              <MenuItem value="7" type="text" sx={{fontFamily:"Montserrat"}} >
                7
              </MenuItem>
              <MenuItem value="8" type="text" sx={{fontFamily:"Montserrat"}} >
                8
              </MenuItem>
              <MenuItem value="9" type="text" sx={{fontFamily:"Montserrat"}} >
                9
              </MenuItem>

              <MenuItem value="10" type="text" sx={{fontFamily:"Montserrat"}} >
                10
              </MenuItem>
          </Select>
        </FormControl>
      );
    }
  },
    {
       field: 'CaktoNoten',
      headerName: "Cakto Notën",
      width: 150,
      renderCell: (params) => {
        const notaValue = notaMap[params.row.ProvimiID];
        return (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!notaValue}
            loadingIndicator={ <CircularProgress sx={{ color: 'white' }} size={25}/>}
            loading={loading === params.row.ProvimiID}
            onClick={() => handleSubmit(params.row.ProvimiID, notaValue)}
            sx={{
              height: '35px',
              textTransform: 'none',
              fontFamily: 'Montserrat',
              marginTop:'5px',
              marginBottom:'5px'
            }}
          >
            Cakto notën
          </Button>
        );
      }
    }
  ]

  const rows = useMemo(() => provimetStudentet.map((prv, index) => ({
    id:index + 1,
     ...prv,
   

    
  
  })), [provimetStudentet]);
    return (

        <div className="containerParaqitProvimin" id="fadeInPage">

        <h1 id="paraqitjaProvimeveH1">LISTA E PROVIMEVE/STUDENTËVE</h1>

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
              fontFamily:'Montserrat',

            "& .MuiDataGrid-cell:focus": {
               outline: "none",
                    },
             "& .MuiDataGrid-cell:focus-within": {
               outline: "none",
             },

             '& .MuiInputBase-root': {
              fontFamily: 'Montserrat', 
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

             slots={{ toolbar: GridToolbar }}
             slotProps={{
             toolbar: {
             showQuickFilter: true,
             quickFilterProps: { debounceMs: 250 },
        
             sx: {
        '& .MuiButton-startIcon svg': {
          color: 'blue',
          
        },
        '& .MuiButton-root': {
          color: 'blue', 
          fontFamily:'Montserrat'
        },
      },
           },
         }}
                disableRowSelectionOnClick
                />
                </div>

        </div>

    )
}

export default VendosNotatEProvimit; 