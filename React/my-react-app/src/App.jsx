import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/StudentRegister';
import StudentList from './components/Students';
import "./assets/App.css";
import Students from './components/Students';
import StudentsEdit from './components/StudentsEdit';

function App() {
  return (
    <Router>
      <div className="navContainer">
        <nav>
          <ul>
            <li><Link className='customLink' to="/register">Regjistro Studentë</Link></li>
            <li><Link className='customLink' to="/studentet">Lista e Studentëve</Link></li>
          </ul>
        </nav>
      </div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/studentet" element={<StudentList />} />
          <Route path='/edit/:ID' element={<StudentsEdit />} />
        </Routes>
    </Router>
  );
}

export default App;
