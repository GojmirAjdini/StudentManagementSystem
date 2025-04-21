import nodemailer from "nodemailer";
import 'dotenv/config';

function vitiAkademik(){

    let current = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    let nextYear = current + 1;
    let currYear;
    let prevYear = current - 1;
    let vitiAkademik;

    if(month >= 6){

        currYear = current.toFixed().charAt(2) + current.toFixed().charAt(3);
        let nxtYear = nextYear.toFixed().charAt(2)+ nextYear.toFixed().charAt(3);
        vitiAkademik  = currYear + nxtYear;
    }
    else{        

        let prvYear = prevYear.toFixed().charAt(2) + prevYear.toFixed().charAt(3);
        currYear = current.toFixed().charAt(2) + current.toFixed().charAt(3);
        vitiAkademik = prvYear + currYear;
    }
    return vitiAkademik;
}

function gjenerata(){

    let current = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    let nextYear = current + 1;
    let currYear;
    let prevYear = current - 1;
    let gjenerata;

    if(month >= 6){

        currYear = current.toFixed();
        let nxtYear = nextYear.toFixed();
        gjenerata  = `${currYear}/${nxtYear}`;
    }
    else{        

        let prvYear = prevYear.toFixed();
        currYear = current.toFixed();
        gjenerata = `${prvYear}/${currYear}`;
    }
    return gjenerata;
}

function generateStudentID(akademik, latestID = null) {
    
    let studentNumber = 1;

    if (latestID && Math.floor(latestID / 100000) === parseInt(akademik)) {
        studentNumber = latestID % 100000 + 1;
        
    }

    let faktor = 1;
    for (let i = 0; i < 5; i++) {
        faktor *= 10;
    }

    return parseInt(akademik) * faktor + studentNumber;
}
function randomEmail(emri, mbiemri, studentID){

        let number = studentID.toString();
        let array = [];

        for(let i = 4; i < number.length; i++){
            array.push(Number(number[i]));
        }

        let digits = array.join('');

        let email = `${emri.charAt(0).toLowerCase()}${mbiemri.charAt(0).toLowerCase()}${digits}@uni-edu.net`;
        return email;
    }

function randomPassword(emri, mbiemri, studentiID){

    let num = studentiID.toString();

    let array =[];

    for(let i = 4; i < num.length; i++){
    array.push(Number(num[i]));
    }

    let digits = array.join('');
    //PASS - 2 SHKRONJAT E PARA TE EMRIT DHE 2 TE MBIEMRIT "." DHE 5 SHIFRAT E FUNDIT TE ID //
    let password = `${emri.charAt(0).toUpperCase()}${emri.charAt(1).toUpperCase()}${mbiemri.toUpperCase().charAt(0)}${mbiemri.charAt(1).toUpperCase()}.${digits}`;

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


export default {gjenerata, vitiAkademik,generateStudentID, randomEmail, randomPassword, sendEmail};