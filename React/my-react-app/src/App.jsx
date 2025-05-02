import { BrowserRouter as Router, Routes, Route, Link, useLocation, href } from 'react-router-dom';
import Register from './components/studentet/StudentRegister';
import StudentList from './components/studentet/Students';
import "./assets/App.css";
import HomeAdmin from './components/navigation/HomeAdmin';
import StudentsEdit from './components/studentet/StudentsEdit';
import DropDownMenu from './components/navigation/NavDropDown';
import RegjistroFakultetin from './components/fakultetet/RegjistroFakultetin';
import ListaFakulteteve from './components/fakultetet/ListaFakulteteve';
import EditFakultetet from './components/fakultetet/EditFakultetet';

function AppContent() {

  return (
    <>
      <div className="navContainer">
        <nav>
        <li> <Link id='homeLink' className='customLink' to="/">Home</Link></li>
            
           <DropDownMenu
           titulli={"Studentët"}
           data={[
            { label: 'Regjistro Student', path: '/register/student' },
            { label: 'Lista e Studentëve', path: '/studentet' },
           ]}
           />

           <DropDownMenu
           titulli={"Fakultetet"} 
           data={[
            { label: 'Regjistro Fakultet', path: '/register/fakutetet' },
            { label: 'Lista e Fakulteteve', path: '/fakultetet' },
           ]}
        />

          <DropDownMenu
           titulli={"Profesorët"} 
           data={[
            { label: 'Regjistro Profesor', path: '/register/profesoret' },
            { label: 'Lista e Profesorëve', path: '/profesoret' },
           ]}
        />

        <DropDownMenu
           titulli={"Lëndët"} 
           data={[
            { label: 'Regjistro Lëndë', path: '/register/lendet' },
            { label: 'Lista e Lëndëve', path: '/lendet' },
           ]}
        />
        </nav>
      </div>
        <Routes>
          <Route path='/' element={<HomeAdmin />} />
          <Route path="/register/student" element={<Register />} />
          <Route path="/studentet" element={<StudentList />} />
          <Route path='/edit/studenti/:ID' element={<StudentsEdit />} />

          <Route path="/register/fakutetet" element={<RegjistroFakultetin />} />
          <Route path="/fakultetet" element={<ListaFakulteteve/>} />
          <Route path="/edit/fakulteti/:FakultetiID" element={<EditFakultetet />} />
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
