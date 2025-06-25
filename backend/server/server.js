import express from "express";
import studentiRoutes from "../routes/RouteStudenti.js"; 
import profesoriRoutes from "../routes/routeProfesori.js";
import adminRoutes from "../routes/routeStafiAdministrativ.js";
import compression from "compression";
import env from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";

env.config();
const corsOptions = {

    origin: ["http://localhost:5173"],
    credentials: true
};


const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());

app.use(express.json());  

app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(compression());
app.use("/student", studentiRoutes);  
app.use("/profesor", profesoriRoutes);
app.use("/admin",adminRoutes); 

app.listen(port, () => {
    console.log(`Server running on port ${port}..`);
});
