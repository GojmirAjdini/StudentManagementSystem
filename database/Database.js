import mysql from "mysql2";
import express from "express";

const app = express();

app.use(express.json());

const db = mysql.createConnection({

    host: "localhost",
    database: "student_management_system",
    user:"root",
    password: ""
});

db.connect((error) =>{

    if(error){
        console.log("Lidhja me databaze deshtoi!", error.cause);
        
    }
    else{
        console.log("Lidhja me databaze e suksesshme!");
    }
});

export default db;
