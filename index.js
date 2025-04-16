import mysql from "mysql2";
import express from "express";
import nodeNotifier from "node-notifier";
import bcrypt, { hash } from "bcrypt";
import nodemailer from "nodemailer";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "student_management_system"
});

db.connect((error)=>{

    if(error) {
        console.log("Lidhja me databaze deshtoi!",error.cause);
        return;
    }
    console.log("Lidhja me databaze e suksesshme..");
});

app.get("/", (req, res) =>{

    res.render("index");
})

function vitiAkademik(){

    let current = new Date().getFullYear();

    let nextYear = current + 1;

    let currYear = current.toFixed().charAt(2) + current.toFixed().charAt(3);
    let nxtYear = nextYear.toFixed().charAt(2) + nextYear.toFixed().charAt(3);

    let vitiAkademik  = currYear + nxtYear;

    return vitiAkademik;
}

function random(){
   
    let rez;
    let max = 10000;
    let min = 1000;
   
    for(let i = 0;i < 5; i++){
        rez = Math.floor(min + Math.random() * (max - min + 1));
    }
    return rez;
}

function randomEmail(emri, mbiemri){

    let randoms = random();

        let email = `${emri.toLowerCase()}${mbiemri.toLowerCase()}${randoms}@uni-edu.net`;
        return email;
    }

function randomPassword(emri, mbiemri){

    let randoms = random();
    let password = `${emri.charAt(0).toUpperCase()}${emri.charAt(1).toUpperCase()}${mbiemri.toUpperCase().charAt(0)}${mbiemri.charAt(1).toUpperCase()}.${randoms}`;
    
    return password;
}

function sendEmail(emailprivat, emailstudentor, password){

    
    let transporter = nodemailer.createTransport({

        service:"gmail",
        auth: {
            user: "gojmirajdini@gmail.com",
            pass: "olzm gxdj jqdl miai"
        },
    
    });
    
    let mailOptions = {
        
        from: "gojmirajdini@gmail.com",
        to: `${emailprivat}`,
        subject: "Informatat per login ne sistem!",
        text: `Pershendetje, \n\nEmaili i juaj i studentit: ${emailstudentor} \nNdersa Passwordi juaj: ${password}\nJu lutem ndryshoni passwordin tuaj!`,
        
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log("Email u dergua me sukses!");
        }
    });
}

app.post("/submit", async (req, res) =>{;

    const {emri, mbiemri, gjinia, emailprivat, vendlindja, data_lindjes, adresa, nrtel, fakulteti, statusi} = req.body;

    const salt = 10;

    const emailstudentor = randomEmail(emri,mbiemri);
    const password =randomPassword(emri,mbiemri);
    try {
        
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO studenti(Emri, Mbiemri, Gjinia, EmailStudentor, EmailPrivat, Password, Vendlindja, Data_Lindjes, Adresa, Nr_Tel, FakultetiID, Statusi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        db.query(sql, [emri, mbiemri, gjinia, emailstudentor, emailprivat, hashedPassword, vendlindja, data_lindjes, adresa, nrtel, fakulteti, statusi], (err, results) => {
            if (err) {
                console.log(err);
            }

        if (results.affectedRows > 0) {
        nodeNotifier.notify({
            title: "Notification",
            message:`Te dhenat u regjistruan ne sistem!`
            
        });
        
        sendEmail(emailprivat, emailstudentor, password);

        res.status(200).json({ message: "Studenti u regjistrua me sukses!", email: emailstudentor, password:password });

            }
        });
    } catch (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Error hashing password" });
    }
});

app.get("/all",(req, res) =>{

    const sql = "SELECT * FROM studenti";

    db.query(sql,(err, results) =>{

        if(err) {
            res.json(err.message);
        }
    
        else{
            res.json(results);
        }
    })

})

app.listen(port, () =>{
    console.log(`Server running on port ${port}..`);
});
