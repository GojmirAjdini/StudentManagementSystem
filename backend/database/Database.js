import mysql from "mysql2";
import express from "express";
import env from "dotenv";

const app = express();

env.config();
app.use(express.json());

const db = mysql.createConnection({

    host: "localhost",
    database: "student_management_system",
    user:"root",
    password: "",
});

db.connect((error) =>{

    if(error){
        console.log("Lidhja me databaze deshtoi!", error);
        
    }
    else{
        console.log("Lidhja me databaze e suksesshme!");
    }
});

export default db;
