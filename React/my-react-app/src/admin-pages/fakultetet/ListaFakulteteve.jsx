import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./assets/Fakultetet.css";
import Swal from "sweetalert2";
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';
import { render } from "ejs";
import { DataGrid } from "@mui/x-data-grid";

function ListaFakulteteve() {

    const [fakultetet, setFakultetet] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchFakulteti, setSearchFakulteti] = useState('');
    const [dataMessage, setDataMessage] = useState('');

    const API_URL = "http://localhost:3000/";

    const fetchFakultetet = async () => {

        try{

            const response = await axios.get(`${API_URL}admin/fakultetet/all`, {withCredentials:true});
            console.log(response.data);
            setFakultetet(response.data);
        }catch(err){
            console.error("Error fetching fakultetet:", err);

        }
    }
    const deleteFakultet = async (FakultetiID) => {

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

                const response = await axios.delete(`${API_URL}admin/fakultetet/delete/${FakultetiID}`,
                     {withCredentials:true});
                
                const message = response.data.message;
                setFakultetet(prev => prev.filter(fakultet => fakultet.FakultetiID !==  FakultetiID));
                setSuccessMessage(message);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);   
                
            }catch(err){
                console.error("Error deleting fakultetin:", err);
            }
        }
    }

    const handleReset = () =>{
        setSearchFakulteti('');
    }

    const handleSearch = async() =>{

        if(!searchFakulteti){

            setDataMessage('Ju lutem shënoni Fakultetin!');

            setTimeout(() =>{ setDataMessage('')},3000);

            return;
        }
        try{

            const response = await axios.get(`${API_URL}admin/fakultetet/fakulteti/search?Emri=${searchFakulteti}`,
                 {withCredentials:true});

            console.log(response.data);
            setFakultetet(response.data);
        } 
        catch(err){
            console.error(err);
            setDataMessage(err.response.data.message);

            setTimeout(() => { setDataMessage('')},3000);
        }
    }

useEffect (() => {

    if(searchFakulteti){

        return;
    }
    fetchFakultetet();

    const interval = setInterval(() => {
        fetchFakultetet();
    }, 5000);

    return () => clearInterval(interval)
}, [searchFakulteti]);

    const columns = [

        {field:'id', headerName:'#', width:70},
        {field: 'Emri', headerName:'Fakulteti', width:200},
        {field: 'Niveli', headerName:'Niveli', width:120},
        {field: 'Lokacioni', headerName:'Lokacioni', width:120},
        {field: 'Kodi_Fakultetit', headerName:'Kodi i Fakultetit', width:150},
        {field: 'uKrijua', headerName:'Data e Regjistrimit', width:180},
    
        {
            field:'Edit',
            headerName:'Përditëso',
            width:120,
            renderCell: (params) =>(
                <Link to={`/edit/fakulteti/${params.row.FakultetiID}`}>
                <Button id="editBtn" color="success" variant="contained"
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
                onClick={() => deleteFakultet(params.row.FakultetiID)}>
                Delete
                </Button>
            )
        }
    ]

    const rows = fakultetet.map((fakultet, index) => ({

        id:index + 1,
        ...fakultet,
        uKrijua: new Date(fakultet.uKrijua).toLocaleString()
    }))

    return(

        <div className="fade-in" id="container">

            <h1>LISTA E FAKULTETEVE</h1>

            {successMessage && (
        <div id="successMessageFkt" className="fade-in" role="alert">
          <Alert severity="success">{successMessage}</Alert>
        </div>
      )}

            {dataMessage && (
                <div id="dataMsgFkt" className="fade-in" role="alert">
                  <Alert severity="info">  {dataMessage}</Alert>
                </div>
            )}   

        <div id="searchBtnHolderFkt">
            
            <input id="searchLendaInput"
              type="text"
              placeholder="Kërko fakultetin..."
              value={searchFakulteti}
              onChange={(e) => setSearchFakulteti(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="form-control mb-3"
            />

            <Button onClick={handleSearch} variant="contained" color="primary" className="mb-3" >
                <Search></Search> Kërko</Button>
            <Button onClick={handleReset} variant="contained" id="resetSearchFkt" className="mb-3">Reset</Button> 
      
        </div>
            
            <div className="dataGridFakultet" >
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
                  pageSize:100,
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
export default ListaFakulteteve;