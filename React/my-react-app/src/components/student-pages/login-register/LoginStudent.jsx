import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./assets/LoginStudent.css";
import CircularProgress from "@mui/material/CircularProgress";
import axiosInstance from "../../../services/axiosInstance";

function LoginStudent(){

    const API_URL = 'http://localhost:3000/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState('');

    const togglePassword = () =>{
        setShowPassword(!showPassword);
    }

    useEffect(() =>{

        const checkAuth = async () =>{
            try{

                const res = await axiosInstance.get("admin/check-authentication");

                if(res.data.message === 'Authenticated'){
                if(res.data.role === 'student'){
                    navigate('/dashboard');
                }
                }
            }catch(err){
                console.log("User nuk eshte autentifikuar");
            }   
        };

        checkAuth();
    },[])

    const navigate = useNavigate();

    const handleReset = () =>{

        setEmail('');
        setPassword('')
    }

    const handleSubmit = async(e) =>{

        e.preventDefault();

        setLoading(true);
        try{

            const response = await axios.post(`${API_URL}student/login`,{
                EmailStudentor: email,
                Password: password
            }, {
                withCredentials:true
        }
    )   
    setTimeout(() => {

            navigate('/dashboard');
    },500);

            console.log(response.data.loginMessage);
            console.log(response.data.message);
            setTimeout(() =>{ setSuccessMessage('') },3000);
        }catch(err){
            console.error(err);
            console.log(err.response.data);
            setTimeout(() => {
            setSuccessMessage(err.response.data.message);

            setTimeout(() =>{ 
            setSuccessMessage(''); 
        },3000);
    },1000);

        }finally{
            setTimeout(() =>{
                setLoading(false);
            },1000);
        }
    }


    return (

        <div className="loginContainer">

            {message && (
        <div id="successMsgLogin" className="fade-in" role="alert">
         <Alert  severity="warning">  {message}</Alert>
        </div>  
      )} 

        <form id="loginForm" onSubmit={handleSubmit} className="fade-in">
            <h1 id="adminLoginH1">STUDENT - LOGIN</h1>
        <div className="input-label">
    <label htmlFor="Email">Email <span>*</span></label>
    <input className="form-control" required type="email" name="Email" 
    placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
    onKeyDown={(e) =>{ if (e.key === 'Enter') handleSubmit(e)}} />
    </div>
    
    <div className="input-label">
    <label htmlFor="Password">Password <span>*</span></label>
    <input className="form-control" required type={showPassword ? "text" : "password"} 
    placeholder="Password" name="Password" value={password} 
    onChange={(e) => setPassword(e.target.value)}
    onKeyDown={(e) =>{ if (e.key === 'Enter') handleSubmit(e)}}
     
     />
     <Button className="passVisibility" variant="text" 
     sx={{height:"fit-content", width:'fit-content', marginLeft:'-5px'}} 
     onClick={togglePassword}> {(!showPassword ? <VisibilityOff/> : <Visibility/>)}</Button>
   
    </div>
    <div className="input-labelButtons">
        <Button loadingIndicator={<CircularProgress sx={{color:'white'}} size={25}/>} 
        loading={loading} sx={{textTransform:'none', fontFamily:'Montserrat'}} 
        id="loginLoginAdm" variant="contained" type="submit" color="primary">
            Login</Button>

        <Button id="loginResAdm" sx={{textTransform:'none', fontFamily:'Montserrat'}}  
        variant="contained" onClick={handleReset} color="inherit">Reset</Button>
        </div>
        </form>
       
        </div>  
    )
}

export default LoginStudent;