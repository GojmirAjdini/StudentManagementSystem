import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Students from "./components/Students";
import Register from "./components/StudentRegister";
import App from "./App";
import StudentsEdit from "./components/StudentsEdit";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div>
    <React.StrictMode>
      
      <App />
    
  </React.StrictMode>
  </div>
)