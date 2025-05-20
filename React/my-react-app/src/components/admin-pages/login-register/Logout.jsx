import axios from "axios";
import axiosInstance,{disableInterceptor} from "../../../services/axiosInstance";

export default async function logout(navigate, clearUserRole) {
    try{
        disableInterceptor();

        await axios.post("http://localhost:3000/admin/logout",{},{withCredentials:true});
        
        if(clearUserRole) clearUserRole(null);

        navigate('/login');
    
    }   catch(err){
    console.error("Ç'kyçja dështoi!", err);
}      
} 
