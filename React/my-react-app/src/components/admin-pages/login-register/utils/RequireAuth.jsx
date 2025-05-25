import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import axiosInstance from "../../../../services/axiosInstance";

const RequireAuth = ({children, allowedRoles =['admin', 'superadmin', 'profesor', 'student']}) => {

  const [authState, setAuthState] = useState({isAuthenticated:null, role:null});
  const navigate = useNavigate();

  useEffect(() => {
    
    const checkAuthentication = async() =>{

        try{
        const res = await axiosInstance.get('admin/check-authentication', {withCredentials:true});
            
        console.log(res.data.role);
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
        navigate('/staff/login'); 
      };
    };

    checkAuthentication();
  }, [navigate]);

  if (authState.isAuthenticated === null) {
    return <Loading/>;
  }

   if (!allowedRoles.includes(authState.role)) {
    return <Navigate to="/staff/login" />;
  }

  return children;
};

export default RequireAuth;
