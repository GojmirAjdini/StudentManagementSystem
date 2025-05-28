import mysql from "mysql2";
import express from "express";
import env from "dotenv";

const app = express();

env.config();
app.use(express.json());

const db = mysql.createConnection({

    host: process.env.HOST,
    database: process.env.DATABASE,
    user:process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT
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
