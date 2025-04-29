import React, {useEffect, useState} from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "../assets/Home.css";
import Swal from "sweetalert2";


function Home(){




    return(

        <div id="fadeInPage" className="container">
            <h1>HOME PAGE</h1>
            <h3>PËRSHËNDETJE ADMIN</h3>
        </div>
    )
}
export default Home;