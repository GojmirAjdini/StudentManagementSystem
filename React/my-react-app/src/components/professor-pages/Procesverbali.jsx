import React, {useState, useEffect, useMemo, PureComponent} from "react";
import './assets/FshijNoten.css';
import Button from "@mui/material/Button";
import axiosInstance from "../../services/axiosInstance";
import { DataGrid, GridToolbar} from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";



function Procesverbali() {
   
    const [loading, setLoading] = useState(null);
    const [provimetStudentet, setProvimetStudentet] = useState([]);
    const [profesori, setProfesori] = useState([]);

    useEffect (() =>{
        
      fetchProvimetEMija();
      fetchProfesoriData();
      
}, []);


    const fetchProfesoriData = async() =>{

      try{

        const response = await axiosInstance.get("profesor/profile");

        console.log(response.data);
        setProfesori(response.data);
        

    }
      catch(err){
        console.error(err.response.data);       
      }
    }

const handleExportPDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Procesverbali i Provimit", 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Profesori: ${profesori[0].Titulli_Akademik === 'PhD' ? 'Dr. Sc.' : 'Msc'} ${profesori[0].Emri} ${profesori[0].Mbiemri}`, 14, 25);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 46);

  const tableColumn = ["#", "Emri", "Mbiemri", "Email", "Lenda", "Kodi", "Nota"];
  const tableRows = provimetStudentet.map((row, index) => [
    index + 1,
    row.Emri,
    row.Mbiemri,
    row.EmailStudentor,
    row.Emri_Lendes,
    row.Kodi_Lendes,
    row.NOTA,
  ]);

  // Table
  autoTable(doc,{
    startY: 55,
    head: [tableColumn],
    body: tableRows,
    styles: {
      font: "helvetica",
      fontSize: 10,
    },
    headStyles: {
      fillColor: [211, 211, 211],
    },
  });

  // Signature area
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.text("__________________________", 14, finalY);
  doc.text("Nënshkrimi i profesorit", 14, finalY + 6);

  // Save PDF
  doc.save(`procesverbali-${new Date().toISOString().split("T")[0]}.pdf`);
};


    const fetchProvimetEMija = async() =>{

      try{

        const response = await axiosInstance.get("profesor/notat/regjistruara");

        console.log(response.data);
        setProvimetStudentet(response.data);
        

    }
      catch(err){
        console.error(err.response.data);       
      }
    }


  const columns = [
    
    {field:'id',headerName:'#', width:20,},
    {field:'Emri',headerName:'Emri', width:130},
    {field:'Mbiemri',headerName:'Mbiemri', width:130},
    {field:'EmailStudentor',headerName:'Email', width:200},
    {field:'Emri_Lendes',headerName:'Emri lëndës', width:400},
    {field:'Kodi_Lendes',headerName:'Kodi', width:120},
    {field:'NOTA',headerName:'Nota e regjistruar', width:150},
  ]

  const rows = useMemo(() => provimetStudentet.map((prv, index) => ({
    id:index + 1,
     ...prv,
  
  })), [provimetStudentet]);
    return (

        <div className="containerParaqitProvimin" id="fadeInPage">

        <h1 id="notatERegjistruar">PROCESVERBALI</h1>


      <div className="registeredGrades" >

        <div className="exportPDF"> 
        <Button variant="contained" endIcon={<PictureAsPdf sx={{color:'white'}}/>} 
        onClick={handleExportPDF} style={{marginBottom:'10px' }}>
          Shkarko PDF 
            </Button>
        </div>

           <DataGrid
           disableColumnResize
          showColumnVerticalBorder
          showCellVerticalBorder

                rows={rows}
                columns={columns}
                density='compact'
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

export default Procesverbali; 