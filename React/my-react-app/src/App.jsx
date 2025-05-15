import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import {Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PersonRounded, Home, LibraryBooks, 
  School, AccountBalance, AccountBox,
  PeopleAlt, AdminPanelSettings } from '@mui/icons-material';

import Swal from 'sweetalert2';
import Loading from './admin-pages/login-register/utils/Loading';

import Login from "./admin-pages/login-register/Login";
import RequireAuth from './admin-pages/login-register/utils/RequireAuth';

const Register = lazy(() => import ('./admin-pages/studentet/StudentRegister'));
const StudentList = lazy(() => import ('./admin-pages/studentet/Students'));
const StudentsEdit = lazy(() => import ('./admin-pages/studentet/StudentsEdit'));
import "./assets/App.css";

const HomeAdmin = lazy(() => import ('./admin-pages/navigation/HomeAdmin'));
import DropDownMenu from './admin-pages/navigation/NavDropDown';

import RegjistroFakultetin from './admin-pages/fakultetet/RegjistroFakultetin';
const ListaFakulteteve = lazy(() => import ('./admin-pages/fakultetet/ListaFakulteteve'));
const EditFakultetet = lazy(() => import ('./admin-pages/fakultetet/EditFakultetet'));

import RegjistroLendet from './admin-pages/lendet/RegjistroLendet';
const ListaLendeve = lazy(() => import ('./admin-pages/lendet/Lendet'));
const EditLendet = lazy(() => import ('./admin-pages/lendet/EditLendet'));

import RegjistroProfesoret from './admin-pages/profesoret/RegjistroProfesoret';
const ListaProfesoreve = lazy(() => import ('./admin-pages/profesoret/ListaProfesoreve'));
const EditProfesoret = lazy(() => import ('./admin-pages/profesoret/EditProfesoret'));
const CaktoLendetProfesoret = lazy(() => import ('./admin-pages/profesoret/CaktoLendetProfesoret'));

function AppContent() {

  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

useEffect(() => {
  const fetchRole = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/admin/check-auth", {
        withCredentials: true,
      });
      console.log(res.data.role)
      
      setUserRole(res.data.role);
      
    } catch (err) {
      setUserRole(null);
    }
  };

  fetchRole();
}, [location.pathname]);



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
  
        {userRole === 'superadmin' && (
        <DropDownMenu
           titulli={( <> <AdminPanelSettings sx={{marginRight: "7px", marginTop:"-4px"}}/>Adminët </>)} 
           data={[
            { label: 'Regjistro Admin', path: '/register/admin' },
            { label: 'Lista e Adminëve', path: '/admin' },
           ]}
        />
        )}
  
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

                }).then( async (result) => {
                  if(result.isConfirmed){

                    try{

                    const module = await import('./admin-pages/login-register/Logout');
                    module.default(navigate);
                    }catch(err){
                      console.error(err);
                    }  
                }
            })
          },
        }
           ]}
           className='rightAlign'
        />

        </nav>
      </div>
      )}
      <Suspense fallback={<Loading/>}>
        <Routes>

          <Route path='/login' element={<Login/>} />
          <Route path='/' element={<RequireAuth allowedRoles={['admin', 'superadmin']}><HomeAdmin/></RequireAuth>} />

          <Route path="/register/student" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><Register/></RequireAuth>} />
          <Route path="/studentet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <StudentList /> </RequireAuth>} />
          <Route path='/edit/studenti/:ID' element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <StudentsEdit /> </RequireAuth>} />

          <Route path="/register/fakutetet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <RegjistroFakultetin />  </RequireAuth>} />
          <Route path="/fakultetet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaFakulteteve/></RequireAuth>} />
          <Route path="/edit/fakulteti/:FakultetiID" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><EditFakultetet /></RequireAuth>} />

          <Route path="/register/lendet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><RegjistroLendet /></RequireAuth>} />
          <Route path="/lendet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaLendeve /></RequireAuth>} />
          <Route path="/edit/lenda/:LendaID" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><EditLendet /></RequireAuth>} />

          <Route path="/register/profesoret" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><RegjistroProfesoret /></RequireAuth>} />
          <Route path="/profesoret" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaProfesoreve /></RequireAuth>} />
          <Route path="/edit/profesori/:ProfesoriID" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><EditProfesoret /></RequireAuth>} />
          <Route path='/lendet/profesoret/assign' element={<RequireAuth allowedRoles={['admin', 'superadmin']}><CaktoLendetProfesoret /></RequireAuth>} />
        </Routes>
        </Suspense>
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
