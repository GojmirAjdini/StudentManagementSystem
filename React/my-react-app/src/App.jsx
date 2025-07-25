import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import {Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import axiosInstance from './services/axiosInstance';

import PersonRounded  from '@mui/icons-material/PersonRounded';
import Home from '@mui/icons-material/Home';
import LibraryBooks from '@mui/icons-material/LibraryBooks';
import AccountBox from '@mui/icons-material/AccountBox';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import AccountBalance from '@mui/icons-material/AccountBalance'; 
import School from '@mui/icons-material/School';

import Swal from 'sweetalert2';
import Loading from './components/admin-pages/login-register/utils/Loading';

import Login from "./components/admin-pages/login-register/Login";
import LoginStudent from './components/student-pages/login-register/LoginStudent';
import RequireAuth from './components/admin-pages/login-register/utils/RequireAuth';

const Register = lazy(() => import ('./components/admin-pages/studentet/StudentRegister'));
const StudentList = lazy(() => import ('./components/admin-pages/studentet/Students'));
const StudentsEdit = lazy(() => import ('./components/admin-pages/studentet/StudentsEdit'));
const LexoNotatEStudentit = lazy(() => import ('./components/admin-pages/studentet/LexoNotatEStudentit'));

import "./assets/App.css";

const HomeAdmin = lazy(() => import ('./components/admin-pages/navigation/HomeAdmin'));
const DropDownMenu = lazy(() => import ('./components/admin-pages/navigation/NavDropDown'));

const RegjistroFakultetin = lazy(() => import ('./components/admin-pages/fakultetet/RegjistroFakultetin'));
const ListaFakulteteve = lazy(() => import ('./components/admin-pages/fakultetet/ListaFakulteteve'));
const EditFakultetet = lazy(() => import ('./components/admin-pages/fakultetet/EditFakultetet'));
const CaktoSemestrin = lazy (() => import ('./components/admin-pages/fakultetet/CaktoSemestrin'));
const CaktoVitinAkademik = lazy (() => import ('./components/admin-pages/fakultetet/CaktoVitinAkademik'));
const RegjistroGjeneraten = lazy (() => import ('./components/admin-pages/fakultetet/RegjistroGjeneraten'));

const RegjistroLendet = lazy(() => import ('./components/admin-pages/lendet/RegjistroLendet'));
const ListaLendeve = lazy(() => import ('./components/admin-pages/lendet/Lendet'));
const EditLendet = lazy(() => import ('./components/admin-pages/lendet/EditLendet'));
const CaktoProvimet = lazy(() => import ('./components/admin-pages/lendet/CaktoProvimet'));
const RegjistroPeriudhenEProvimeve = lazy(() => import ('./components/admin-pages/lendet/RegjistroPeriudhenEProvimeve'));
const ListaProvimeve = lazy(() => import ('./components/admin-pages/lendet/ListaProvimeve'));
const PeriudhatEProvimeve = lazy(() => import ('./components/admin-pages/lendet/ListaPeriudhave'));

const RegjistroProfesoret = lazy(() => import ('./components/admin-pages/profesoret/RegjistroProfesoret'));
const CaktoFakultetinProfesorit = lazy(() => import ('./components/admin-pages/profesoret/CaktoFakultetin'));
const ProfesoretFakultetet = lazy(() => import ('./components/admin-pages/profesoret/ListaEProfesoreveFakulteteve'))
const ListaProfesoreve = lazy(() => import ('./components/admin-pages/profesoret/ListaProfesoreve'));
const EditProfesoret = lazy(() => import ('./components/admin-pages/profesoret/EditProfesoret'));
const CaktoLendetProfesoret = lazy(() => import ('./components/admin-pages/profesoret/CaktoLendetProfesoret'));
const LendetProfesoret = lazy(() => import ('./components/admin-pages/profesoret/ListaLendetProfesoret'));

import RegjistroAdmin from './components/admin-pages/adminet/RegjistroAdmin';
const ListoAdminet = lazy(() => import ('./components/admin-pages/adminet/ListoAdminet'));
const EditAdminet = lazy(() => import ('./components/admin-pages/adminet/EditAdminet'));

// IMPORTET PER PROFESOR //

const Profile = lazy(() => import ('./components/professor-pages/Profile'));
const LendetSipasProfit = lazy (() => import ('./components/professor-pages/LendetEMija'));
const VendosNotatEProvimit = lazy (() => import ('./components/professor-pages/VendosNotatEProvimit'));
const FshijNoten = lazy(() => import ('./components/professor-pages/FshijNoten'));
const Procesverbali = lazy(() => import ('./components/professor-pages/Procesverbali'));

// IMPORTET PER STUDENT //

const Dashboard = lazy(() => import ('./components/student-pages/Dashboard'));
const RegjistrimiSemestrit = lazy(() => import ('./components/student-pages/RegjistroSemestrinStudent'));
const ParaqitProvimin = lazy(() => import ('./components/student-pages/ParaqitProvimin'));
const ProvimetEParaqitura = lazy(() => import ('./components/student-pages/ProvimetEParaqitura'));
const Transkripta = lazy(() => import ('./components/student-pages/Transkripta'));

function AppContent() {

  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();
  const isLoginPage = location.pathname === '/staff/login';
  const isStudentLoginPage = location.pathname === '/student/login';

useEffect(() => {

  if(isLoginPage || isStudentLoginPage){ 
    setUserRole(null);
    setUserEmail(null);
    return;}
  
  const fetchRole = async () => {
    try {
      const res = await axiosInstance.get("admin/check-authentication" );
      
      setUserEmail(res.data.email);
      setUserRole(res.data.role);
      
    } catch (err) {
      setUserRole(null);
    }
  };

  fetchRole();
}, [location.pathname]);



  return (
    <>
      {!isLoginPage && !isStudentLoginPage && (
      <div className="navContainer">
        <nav>
         
        <li> <Link id='homeLink' className='customLink' to={userRole === 'student' ? '/dashboard' : '/'}><Home></Home></Link></li>
     {userRole === 'student' && ( 
        <li> <Link id='homeLink' className='customLink' 
        to={'/semester/register'}>Regjistro semestrin</Link></li> )}  
     
      {userRole === 'student' && ( <li> 
        <Link id='homeLink' className='customLink' 
        to={'/paraqit-provimin'}>Paraqit provimet</Link></li>)}  
     
      {userRole === 'student' && (  
        <li> <Link id='homeLink' className='customLink' 
        to={'/provimet/paraqitura'}>Provimet e paraqitura</Link></li>)}
 
      {userRole === 'student' && ( 
        <li> <Link id='homeLink' className='customLink' 
        to={'/transkripta-notave'}>Transkripta</Link></li>)}
  
      
        {/* PROFESOR */}  

        {userRole === 'profesor' && ( 
        <li> <Link id='homeLink' className='customLink' 
        to={'/MY/lendet'}>Lëndët</Link></li> )}

        {userRole === 'profesor' && ( 
        <li> <Link id='homeLink' className='customLink' 
        to={'/register/nota'}> Regjistro notën</Link></li> )}
        
        {userRole === 'profesor' && ( 
        <li> <Link id='homeLink' className='customLink' 
        to={'/delete/nota'}> Notat e regjistruara</Link></li> )}

        {userRole === 'profesor' && ( 
        <li> <Link id='homeLink' className='customLink' 
        to={'/procesverbal'}> Procesverbali</Link></li> )}

        {['admin', 'superadmin'].includes(userRole) && (
           <DropDownMenu
           titulli={( <> <School sx={{marginRight: "7px", marginTop:"-4px"}}/>Studentët </>)}
           data={[
            { label: 'Regjistro Student', path: '/register/student' },
            { label: 'Lista e Studentëve', path: '/studentet' },
           ]}
           />
          )}

          {['admin', 'superadmin'].includes(userRole) && (
           <DropDownMenu
           titulli={( <> <AccountBalance sx={{marginRight: "7px", marginTop:"-4px"}}/>Fakultetet </>)} 
           data={[
            { label: 'Regjistro Fakultet', path: '/register/fakutetet' },
            { label: 'Regjistro Vitin akademik', path: '/register/academic-year' },
            { label: 'Regjistro Gjeneratë të re akademike', path: '/register/academic-generation' },
            { label: 'Regjistro Semestër të ri', path: '/register/semester' },
            { label: 'Lista e Fakulteteve', path: '/fakultetet' },
            
           ]}
        />
          )}

          {['admin', 'superadmin'].includes(userRole) && (
          <DropDownMenu
           titulli={(<> <PeopleAlt sx={{marginRight: "7px", marginTop:"-4px"}}/>Profesorët </>)} 
           data={[
            { label: 'Regjistro Profesor', path: '/register/profesoret' },
            { label: 'Cakto Fakultetin për Profesor', path:'/assign/profesoret-fakultetin'},
            { label: 'Cakto Lëndët & Profesorët', path: '/lendet/profesoret/assign'},
            { label: 'Lista e të gjithë Profesorëve', path: '/profesoret' },
            { label: 'Lista e Fakulteteve & Profesorëve', path: '/profesoret-fakultetet' },
            { label: 'Lista e Lëndëve & Profesorëve', path: '/profesoret-lendet' }
           ]}
        />
          )}

        {['admin', 'superadmin'].includes(userRole) && (
        <DropDownMenu
           titulli={( <> <LibraryBooks sx={{marginRight: "7px", marginTop:"-4px"}}/>Lëndët </>)} 
           data={[
            { label: 'Regjistro Lëndë', path: '/register/lendet' },
            { label: 'Cakto Periudhën e provimeve', path:'/cakto/periudha-provimeve'}, 
            { label: 'Cakto Provimet', path:'/cakto-provimet'}, 
            { label: 'Lista e Lëndëve', path: '/lendet' },
            { label: 'Lista e Provimeve', path:'/provimet/all'},
            { label: 'Lista e Periudhave të provimeve', path:'/periudhat-e-provimeve'}
           ]}
        />
          )}
  
        {userRole === 'superadmin' && (
        <DropDownMenu
           titulli={( <> <AdminPanelSettings sx={{marginRight: "7px", marginTop:"-4px"}}/>Adminët </>)} 
           data={[
            { label: 'Regjistro Admin', path: '/register/admin' },
            { label: 'Lista e Adminëve', path: '/adminet' },
           ]}
        />
        )}

        <DropDownMenu
           titulli={( <> <AccountBox sx={{marginRight: "5px", marginTop:"-4px"}}/>{userEmail} </>)} 
           data={[
            
            {label: ( <> <PersonRounded sx={{marginRight: "5px", marginTop:"-2px"}}/>Profili im </>), 
            path: userRole === 'student' ? '/dashboard' : '/' },
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

                    const module = await import('./components/admin-pages/login-register/Logout');
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

          <Route path='/staff/login' element={<Login/>} />
          <Route path="/student/login" element={<LoginStudent/>} />

          <Route
          path="/"
          element={(
              <RequireAuth allowedRoles={['admin', 'superadmin', 'profesor']}>
                {userRole === 'profesor' ? <Navigate to="/profile" /> : <HomeAdmin />}
              </RequireAuth>
            )
          }
        />

      <Route path="/register/student" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><Register/></RequireAuth>} />
      <Route path="/studentet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <StudentList /> </RequireAuth>} />
      <Route path='/edit/studenti/:ID' element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <StudentsEdit /> </RequireAuth>} />
      <Route path='/notat/studenti/:ID' element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <LexoNotatEStudentit /> </RequireAuth>} />


      <Route path="/register/fakutetet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <RegjistroFakultetin />  </RequireAuth>} />
      <Route path="/fakultetet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaFakulteteve/></RequireAuth>} />
      <Route path="/edit/fakulteti/:FakultetiID" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><EditFakultetet /></RequireAuth>} />
      <Route path="/register/semester" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><CaktoSemestrin /></RequireAuth>} />
      <Route path="/register/academic-year" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><CaktoVitinAkademik /></RequireAuth>} />
      <Route path="/register/academic-generation" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><RegjistroGjeneraten /></RequireAuth>} />
  
      <Route path="/register/lendet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><RegjistroLendet /></RequireAuth>} />
      <Route path="/lendet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaLendeve /></RequireAuth>} />
      <Route path="/edit/lenda/:LendaID" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><EditLendet /></RequireAuth>} />
      <Route path="/cakto-provimet" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><CaktoProvimet /></RequireAuth>} />
      <Route path="/cakto/periudha-provimeve" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><RegjistroPeriudhenEProvimeve /></RequireAuth>} />
      <Route path="/provimet/all" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaProvimeve /></RequireAuth>} />
      <Route path="/periudhat-e-provimeve" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><PeriudhatEProvimeve /></RequireAuth>} />


      <Route path="/register/profesoret" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><RegjistroProfesoret /></RequireAuth>} />
      <Route path ="/assign/profesoret-fakultetin" element={<RequireAuth allowedRoles={['admin', 'superadmin']}> <CaktoFakultetinProfesorit/>  </RequireAuth>} />
      <Route path='/profesoret-fakultetet' element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ProfesoretFakultetet /></RequireAuth>} />
      <Route path="/profesoret" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><ListaProfesoreve /></RequireAuth>} />
      <Route path="/edit/profesori/:ProfesoriID" element={<RequireAuth allowedRoles={['admin', 'superadmin']}><EditProfesoret /></RequireAuth>} />
      <Route path='/lendet/profesoret/assign' element={<RequireAuth allowedRoles={['admin', 'superadmin']}><CaktoLendetProfesoret /></RequireAuth>} />
      <Route path='/profesoret-lendet' element={<RequireAuth allowedRoles={['admin', 'superadmin']}><LendetProfesoret /></RequireAuth>} />
  
      <Route path='/register/admin' element={<RequireAuth allowedRoles={['superadmin']}><RegjistroAdmin /></RequireAuth>} />
      <Route path='/adminet' element={<RequireAuth allowedRoles={['superadmin']}><ListoAdminet /></RequireAuth>} />
      <Route path='/edit/admin/:AdminID' element={<RequireAuth allowedRoles={['superadmin']}><EditAdminet /></RequireAuth>} />

      {/* ROUTES PER PROFESOR */}

      <Route path='/profile' element={<RequireAuth allowedRoles={['profesor']}> <Profile/></RequireAuth>}/>
      <Route path='/MY/lendet' element={<RequireAuth allowedRoles={['profesor']}> <LendetSipasProfit/></RequireAuth>}/>
      <Route path='/register/nota' element={<RequireAuth allowedRoles={['profesor']}> <VendosNotatEProvimit/></RequireAuth>}/>
      <Route path='/delete/nota' element={<RequireAuth allowedRoles={['profesor']}> <FshijNoten/></RequireAuth>}/>
      <Route path='/procesverbal' element={<RequireAuth allowedRoles={['profesor']}> <Procesverbali/></RequireAuth>}/>

      { /* ROUTES PER STUDENT */}

      <Route path='/dashboard' element={<RequireAuth allowedRoles={['student']}> <Dashboard/></RequireAuth>}/>
      <Route path='/semester/register' element={<RequireAuth allowedRoles={['student']}> <RegjistrimiSemestrit/> </RequireAuth>}/>
      <Route path='/paraqit-provimin' element={<RequireAuth allowedRoles={['student']}> <ParaqitProvimin/> </RequireAuth>}/>
      <Route path='/provimet/paraqitura' element={<RequireAuth allowedRoles={['student']}> <ProvimetEParaqitura/> </RequireAuth>}/>
      <Route path='/transkripta-notave' element={<RequireAuth allowedRoles={['student']}> <Transkripta/> </RequireAuth>}/>

    
    
    
    
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
