import nodemailer from "nodemailer";
import 'dotenv/config';

function random(){
   
    let max = 10000;
    let min = 1000;
   
    for(let i = 0;i < 7; i++){
        return Math.floor(min + Math.random() * (max - min + 1));
    }
}

function randomEmail(emri, mbiemri){

    let randoms = random();

        let email = `${emri.toLowerCase()}.${mbiemri.toLowerCase()}@uni-edu.net`;
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
        
        from: Email,
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


export default {random, randomEmail, randomPassword, sendEmail};