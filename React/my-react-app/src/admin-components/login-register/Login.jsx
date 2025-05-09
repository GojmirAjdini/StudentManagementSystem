import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import "./assets/login.css";


function Login(){

    const API_URL = 'http://localhost:3000/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleReset = () =>{

        setEmail('');
        setPassword('')
    }

    const handleSubmit = async(e) =>{

        e.preventDefault();

        try{

            const response = await axios.post(`${API_URL}admin/login`,{
                Email: email,
                Password: password
            }, {
                withCredentials:true
        }
    )
            navigate('/');

            console.log(response.data.message);
            setSuccessMessage(response.data.message);
            setTimeout(() =>{ setSuccessMessage('') },3000);
        }catch(err){
            console.error(err);
            console.log(err.response.data);
            setSuccessMessage(err.response.data.message);

            setTimeout(() =>{ setSuccessMessage('') },3000);
        }
    }


    return (

        <div className="loginContainer">

            {message && (
        <div id="successMsgLogin" className="fade-in" role="alert">
         <Alert  severity="info">  {message}</Alert>
        </div>  
      )} 

        <form id="loginForm" className="fade-in">
            <h1 id="adminLoginH1">ADMIN - LOGIN</h1>
        <div className="input-label">
    <label htmlFor="Email">Email <span>*</span></label>
    <input className="form-control" required type="email" name="Email" 
    placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
    onKeyDown={(e) =>{ if (e.key === 'Enter') handleSubmit(e)}} />
    </div>
    
    <div className="input-label">
    <label htmlFor="Password">Password <span>*</span></label>
    <input className="form-control" required type="password" 
    placeholder="Password" name="Password" value={password} 
    onChange={(e) => setPassword(e.target.value)}
    onKeyDown={(e) =>{ if (e.key === 'Enter') handleSubmit(e)}}
    
 />
    </div>
    <div className="input-labelButtons">
        <Button id="loginLoginAdm" variant="contained" onClick={handleSubmit} color="primary">Login</Button>
        <Button id="loginResAdm"  variant="contained" onClick={handleReset} color="inherit">Reset</Button>
        </div>
        </form>
        </div>  
    )
}

export default Login;