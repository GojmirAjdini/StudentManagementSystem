import express from "express";
import studentiRoutes from "../routes/RouteStudenti.js"; 
import lendaRoutes from "../routes/routeLendet.js";
import fakultetRoutes from "../routes/routeFakulteti.js";
import profesoriRoutes from "../routes/routeProfesori.js";
import adminRoutes from "../routes/routeStafiAdministrativ.js";
import semestriRoutes from "../routes/routeSemestri.js";
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
const port = 3000;

app.use(cookieParser());

app.use(express.json());  

app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(compression());
app.use("/studentet", studentiRoutes);  
app.use("/lendet", lendaRoutes);
app.use("/fakultetet", fakultetRoutes);
app.use("/profesoret", profesoriRoutes);
app.use("/admin",adminRoutes); 
app.use('/semestri', semestriRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}..`);
});
