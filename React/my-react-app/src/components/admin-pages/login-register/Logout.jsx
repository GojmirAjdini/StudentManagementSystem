import axios from "axios";
import axiosInstance,{disableInterceptor} from "../../../services/axiosInstance";





export default async function logout(navigate, clearUserRole) {
    try{
        disableInterceptor();
        
        const res = await axiosInstance.get("/admin/check-authentication", { withCredentials: true });
        const role = res.data.role;

        await axios.post("http://localhost:3000/admin/logout",{},{withCredentials:true});
        
        if(clearUserRole) clearUserRole(null);
        
        if(role === "student") 
            navigate("/student/login");
        
        else 
        navigate('/staff/login');
    
    }   catch(err){
    console.error("Ç'kyçja dështoi!", err);
}      
} 
