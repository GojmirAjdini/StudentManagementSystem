import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './assets/ListoProfesoret.css';
import {Alert, Button} from '@mui/material';
import {Delete, Edit, Search} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

function ListaProfesoreve() {

    const API_URL = 'http://localhost:3000/'

    const [profesoret, setProfesoret] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchProfesori, setSearchProfesori] = useState('');
    const [dataMessage, setDataMessage] = useState('');


    const fetchProfesoret = async () =>{

        try{

            const response = await axios.get(`${API_URL}admin/profesoret/all`, { withCredentials:true});
            
            console.log(response.data);
            setProfesoret(response.data);
            
        }catch(err){
            console.error(err);
        }
    }

    const handleReset = () =>{

      setSearchProfesori('');
    }
    
  const handleSearch = async () =>{

    if(!searchProfesori){

      setDataMessage('Ju lutem shënoni Profesorin!');

      setTimeout(() => { setDataMessage('')},3000);

      return;
    }

    try{

      const response = await axios.get(`${API_URL}admin/profesoret/profesori/search?Emri=${searchProfesori}`, { withCredentials:true});

      console.log(response.data);
      setProfesoret(response.data);
    
    }catch(err){
      console.error(err);
        setDataMessage(err.response.data.message);

        setTimeout(() => { setDataMessage('')},3000);
    }
  }  

    const deleteProfesorById = async (ID) => {
        
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

            const response = await axios.delete(`${API_URL}admin/profesoret/delete/${ID}`, { withCredentials:true});

            setProfesoret(prev => prev.filter(prof => prof.ProfesoriID !== ID));

            setSuccessMessage(response.data.message);

            setTimeout(() => { 
                setSuccessMessage ('')}, 5000);

        }catch(err){
            console.error(err);
        }
    }
    }

    useEffect(() =>{

        fetchProfesoret();

        const interval = setInterval(() => {

            fetchProfesoret()
        },5000);

        return () => clearInterval(interval);

    },[])

     const columns = [

        {field:'id', headerName:'#', width:20},
        {field: 'Emri', headerName:'Emri', width:100},
        {field: 'Mbiemri', headerName:'Mbiemri', width:100},
        {field: 'Gjinia', headerName:'Gjinia', width:70},
        {field: 'Fakulteti', headerName:'Fakulteti', width:200},
        {field: 'NrTel', headerName:'Kontakt', width:100},
        {field: 'Email', headerName:'Email Akademik', width:220},
        {field: 'Titulli_Akademik', headerName:'Titulli Akademik', width:140},
        {field: 'uKrijua', headerName:'Data e Regjistrimit', width:170},
     
      {

        field: 'Edit',
        headerName:'Përditëso',
        width:120,
        renderCell: (params) =>(
          <Link to={`/edit/profesori/${params.row.ProfesoriID}`}>
          <Button id="editBtn" color="success" variant="contained"
          startIcon={<Edit sx={{color:"white"}}/>}>Edit</Button>
          </Link>
        )
      },

      {

        field: 'Delete',
        headerName:'Fshij',
        width:120,
        renderCell: (params) =>(
          <Button color='error' sx={{width:'100%'}} 
          variant='contained' startIcon={<Delete sx={{color:"white"}}/>}
          onClick={ () => deleteProfesorById(params.row.ProfesoriID)}>Delete</Button>

        )
      }
      ]

    const rows = profesoret.map((prof, index) => ({

      id:index + 1,
      ...prof,
      Data_Punesimit: new Date(prof.Data_Punesimit).toLocaleDateString(),
      uKrijua: new Date(prof.uKrijua).toLocaleString()

    }))


    return (
        <div id='container' className='fadeInPage'>

            <h1>LISTA E PROFESORËVE</h1>
        
      {successMessage && (
        <div id="successMessageProf" className="fade-in" role="alert">
          <Alert severity="success">  {successMessage}</Alert>
        </div>
      )}
      
      {dataMessage && (
          <div id="dataMsgProf" className="fade-in" role="alert">
            <Alert severity="info">  {dataMessage}</Alert>
          </div>
      )}   
     
     <div id="searchBtnHolderProf">
      
      <input id="searchLendaInput"
        type="text"
        placeholder="Kërko profesorin..."
        value={searchProfesori}
        onChange={(e) => setSearchProfesori(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        className="form-control mb-3"
      />
     
      <Button onClick={handleSearch} variant="contained" color="primary" className="mb-3" >
          <Search></Search> Kërko</Button>
      <Button onClick={handleReset} variant="contained" id="resetSearchProf" className="mb-3">Reset</Button> 
            </div>

           <div className="dataGridProf" >
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

export default ListaProfesoreve;