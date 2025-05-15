import axios from "axios";

export default async function logout(navigate) {
    try{

        await axios.post("http://localhost:3000/admin/logout", {},{withCredentials:true});
    
        navigate('/login');
    
}catch(err){
    console.error("Ç'kyçja dështoi!", err);
}      
} 
