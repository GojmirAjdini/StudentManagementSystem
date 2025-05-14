import {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import './assets/Lendet.css';
import {Link} from "react-router-dom";
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';
import { DataGrid, } from '@mui/x-data-grid';


function Lendet() {

    const API_URL = "http://localhost:3000/";
    const [lendet, setLendet] = useState([]);
    const [orgLendet, setOrgLendet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [dataMessage, setDataMessage] = useState('');
    const [searchLenda, setSearchLenda] = useState('');

    
    const fetchLendet = async () =>{

        try{
            const response = await axios.get(`${API_URL}admin/lendet/all`, {withCredentials:true});
            console.log(response.data);

            setLendet(response.data);
            setOrgLendet(response.data);

        } catch(err){
            console.error("Error fetching lendet", err); 
        }
    }

    const handleReset = () =>{
        setSearchLenda('');
    }

    const handleSearch = async () =>{

        if(!searchLenda){
            setDataMessage('Ju lutem shënoni lëndën!');

            setTimeout(() => {setDataMessage('')},3000);
            return;
        }
        try{

            const response = await axios.get(`${API_URL}admin/lendet/lenda/search?Emri_Lendes=${searchLenda}`, 
                {withCredentials:true});
            
            console.log(response.data);
            setLendet(response.data);
        }catch(err){
            console.error(err);
            setDataMessage(err.response.data.message);

            setTimeout(() => { setDataMessage('')},3000);
        }

    }

    const deleteLenda = async (LendaID) => {

        const result = await Swal.fire({
            background:"#F5F5F5",
            position: "center",
            title: "Dëshironi t'i fshini të dhënat?",
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

            try{
                const response = await axios.delete(`${API_URL}admin/lendet/delete/${LendaID}`,{withCredentials:true});
                const message = response.data.message;
                setLendet(prev => prev.filter(lenda => lenda.LendaID !==  LendaID));
                setSuccessMessage(message);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);   

            } catch(err){
                console.error("Error deleting lenda", err); 
            }
        }
    }

    useEffect(() => {

        if(searchLenda){

            return; 
        }

        fetchLendet();

        const interval = setInterval (() =>{
            fetchLendet()}, 5000);

        return () => clearInterval(interval);

    },[searchLenda]);

    const columns =  [
        
        {field: 'id', headerName:'#', width:20},
        {field: 'Emri_Lendes', headerName:'Lënda', width:200},
        {field: 'Fakulteti', headerName:'Fakulteti', width:180},
        {field: 'ECTS', headerName:'ECTS', width:80},
        {field: 'Kodi_Lendes', headerName:'Kodi i Lëndës', width:120},
        {field: 'Semestri', headerName:'Semestri', width:100},
        {field: 'uKrijua',headerName:'Data e Regjistrimit', width:180},
        {

            field:'Edit',
            headerName:'Përditëso',
            width:120,
            renderCell : (params) => (
                <Link to={`/edit/lenda/${params.row.LendaID}`}>
                <Button id="editBtnLenda" color="success" variant="contained"
                startIcon={<Edit sx={{color:"white"}}/>}>Edit</Button>
                </Link>
            )
        },

        {

            field:'Delete',
            headerName:'Fshij',
            width:120,
            renderCell : (params) => (
                <Button 
                color="error"
                variant="contained" sx={{width:'100%'}}
                startIcon={<Delete sx={{color:'white'}}/>}
                onClick={() => deleteLenda(params.row.LendaID)}>
                Delete
                </Button>
            )
        }
    ]

    const rows = lendet.map((lenda, index) => ({

        id:index + 1,
        ...lenda,   
        uKrijua: new Date(lenda.uKrijua).toLocaleString()
        
    }))

    return(
        <div className="fadeInPage" id="container">

            <h1>LISTA E LËNDËVE</h1>

            {successMessage && (    
                <div id="successMessageLendet" className="fade-in" role="alert">
                    <Alert severity="success">  {successMessage}</Alert>
                </div>
            )}

        {dataMessage && (
                <div id="dataMsgLendet" className="fade-in" role="alert">
                  <Alert severity="info">  {dataMessage}</Alert>
                </div>
            )}   
        
        <div id="searchBtnHolder">
            
            <input id="searchLendaInput"
              type="text"
              placeholder="Kërko lëndën..."
              value={searchLenda}
              onChange={(e) => setSearchLenda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="form-control mb-3"
            />

            <Button onClick={handleSearch} variant="contained" color="primary" className="mb-3" >
                <Search></Search> Kërko</Button>
            <Button onClick={handleReset} variant="contained" id="resetSearchLnd" className="mb-3">Reset</Button>

            </div>
            <div id="dataGridLendet">
              <DataGrid
                disableColumnResize
                showCellVerticalBorder
                showColumnVerticalBorder
                rows={rows}
                columns={columns}
                scrollbarSize={{}}
                initialState={{
                pagination: {
                paginationModel: {
                  pageSize:20,
                },
              },
            }}

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
                checkboxSelection
                disableRowSelectionOnClick
                    
                />
                
            </div>
        </div>
    )
}

export default Lendet;