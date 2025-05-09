import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PersonRounded, Home, LibraryBooks, 
  School, AccountBalance, AccountBox,
  PeopleAlt } from '@mui/icons-material';

import Swal from 'sweetalert2';

import Login from "./admin-components/login-register/Login";
import RequireAuth from './admin-components/login-register/utils/RequireAuth';

import Register from './admin-components/studentet/StudentRegister';
import StudentList from './admin-components/studentet/Students';
import StudentsEdit from './admin-components/studentet/StudentsEdit';
import "./assets/App.css";

import HomeAdmin from './admin-components/navigation/HomeAdmin';
import DropDownMenu from './admin-components/navigation/NavDropDown';

import RegjistroFakultetin from './admin-components/fakultetet/RegjistroFakultetin';
import ListaFakulteteve from './admin-components/fakultetet/ListaFakulteteve';
import EditFakultetet from './admin-components/fakultetet/EditFakultetet';

import RegjistroLendet from './admin-components/lendet/RegjistroLendet';
import ListaLendeve from './admin-components/lendet/Lendet';
import EditLendet from './admin-components/lendet/EditLendet';

import RegjistroProfesoret from './admin-components/profesoret/RegjistroProfesoret';
import ListaProfesoreve from './admin-components/profesoret/ListaProfesoreve';
import EditProfesoret from './admin-components/profesoret/EditProfesoret';
import CaktoLendetProfesoret from './admin-components/profesoret/CaktoLendetProfesoret';

function AppContent() {

  const navigate = useNavigate();

  const logout = async () =>{
    try{

        const response = await axios.post("http://localhost:3000/admin/logout",{},{withCredentials:true});
    
        navigate('/login');
    
}catch(err){
    console.err("Ç'kyçja dështoi!", err);
}      
} 

const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && (
      <div className="navContainer">
        <nav>
        <li> <Link id='homeLink' className='customLink' to="/"><Home>Home</Home></Link></li>
        
           <DropDownMenu
           titulli={( <> <School sx={{marginRight: "7px", marginTop:"-4px"}}/>Studentët </>)}
           data={[
            { label: 'Regjistro Student', path: '/register/student' },
            { label: 'Lista e Studentëve', path: '/studentet' },
           ]}
           />

           <DropDownMenu
           titulli={( <> <AccountBalance sx={{marginRight: "7px", marginTop:"-4px"}}/>Fakultetet </>)} 
           data={[
            { label: 'Regjistro Fakultet', path: '/register/fakutetet' },
            { label: 'Lista e Fakulteteve', path: '/fakultetet' },
           ]}
        />

          <DropDownMenu
           titulli={(<> <PeopleAlt sx={{marginRight: "7px", marginTop:"-4px"}}/>Profesorët </>)} 
           data={[
            { label: 'Regjistro Profesor', path: '/register/profesoret' },
            { label: 'Lista e Profesorëve', path: '/profesoret' },
            { label: 'Cakto Lëndët & Profesorët', path: '/lendet/profesoret/assign'}
           ]}
        />

        <DropDownMenu
           titulli={( <> <LibraryBooks sx={{marginRight: "7px", marginTop:"-4px"}}/>Lëndët </>)} 
           data={[
            { label: 'Regjistro Lëndë', path: '/register/lendet' },
            { label: 'Lista e Lëndëve', path: '/lendet' },
           ]}
        />
        <DropDownMenu
           titulli={( <> <AccountBox sx={{marginRight: "5px", marginTop:"-4px"}}/>Llogaria </>)} 
           data={[
            {label: ( <> <PersonRounded sx={{marginRight: "5px", marginTop:"-2px"}}/>Profili im </>), path:'/' },
            { label: "Ç'kyçu", 
              onClick: () => {
                Swal.fire({

                  title:"A jeni të sigurt?",
                  text:"Dëshironi të  ç'kyçeni nga llogaria?",
                  icon:"warning",
                  showCancelButton:true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: "Po, ç'kyçu",
                  cancelButtonText:'Jo, anulo',
                  timer:5000, 
                  customClass:{

                      confirmButton: 'swal-confirmBtn',
                      cancelButton: 'swal-confirmBtn',
                      popup: 'popupDesign'
                  }

                }).then((result) => {
                  if(result.isConfirmed){
                    logout();
                  }
                });
            }
          },
           ]}
           className='rightAlign'
        />

        </nav>
      </div>
      )}
        <Routes>

          <Route path='/login' element={<Login/>} />
          <Route path='/' element={<RequireAuth><HomeAdmin/></RequireAuth>} />

          <Route path="/register/student" element={<RequireAuth><Register/></RequireAuth>} />
          <Route path="/studentet" element={<RequireAuth> <StudentList /> </RequireAuth>} />
          <Route path='/edit/studenti/:ID' element={<RequireAuth> <StudentsEdit /> </RequireAuth>} />

          <Route path="/register/fakutetet" element={<RequireAuth> <RegjistroFakultetin />  </RequireAuth>} />
          <Route path="/fakultetet" element={<RequireAuth><ListaFakulteteve/></RequireAuth>} />
          <Route path="/edit/fakulteti/:FakultetiID" element={<RequireAuth><EditFakultetet /></RequireAuth>} />

          <Route path="/register/lendet" element={<RequireAuth><RegjistroLendet /></RequireAuth>} />
          <Route path="/lendet" element={<RequireAuth><ListaLendeve /></RequireAuth>} />
          <Route path="/edit/lenda/:LendaID" element={<RequireAuth><EditLendet /></RequireAuth>} />

          <Route path="/register/profesoret" element={<RequireAuth><RegjistroProfesoret /></RequireAuth>} />
          <Route path="/profesoret" element={<RequireAuth><ListaProfesoreve /></RequireAuth>} />
          <Route path="/edit/profesori/:ProfesoriID" element={<RequireAuth><EditProfesoret /></RequireAuth>} />
          <Route path='/lendet/profesoret/assign' element={<RequireAuth><CaktoLendetProfesoret /></RequireAuth>} />
        </Routes>
        </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
