import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const RequireAuth = ({children, allowedRoles =['admin', 'superadmin']}) => {

  const [authState, setAuthState] = useState({isAuthenticated:null, role:null});
  const navigate = useNavigate();

  useEffect(() => {
    
    const checkAuthentication = async() =>{

        try{
        const res = await axios.get('http://localhost:3000/admin/admin/check-auth', { withCredentials: true })
            
            setAuthState({
              isAuthenticated:true,
              role: res.data.role,
            })
            
        }
      catch(err){
         
            setAuthState({
              isAuthenticated:null,
              role: null,
            })
        navigate('/login'); 
      };
    };

    checkAuthentication();
  }, [navigate]);

  if (authState.isAuthenticated === null) {
    return <Loading/>;
  }

   if (!allowedRoles.includes(authState.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;
