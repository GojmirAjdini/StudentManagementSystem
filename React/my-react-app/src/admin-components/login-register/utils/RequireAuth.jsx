import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { chipClasses } from "@mui/material";

const RequireAuth = ({children}) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const checkAuthentication = async() =>{

        try{
        await axios.get('http://localhost:3000/admin/admin/check-auth', { withCredentials: true })
            setIsAuthenticated(true);
        }
      catch(err){
        setIsAuthenticated(false);
        navigate('/login'); 
      };
    };

    checkAuthentication();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? children : null;
};

export default RequireAuth;
