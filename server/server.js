import express from "express";
import studentiRoutes from "../routes/RouteStudenti.js"; 
import lendaRoutes from "../routes/routeLendet.js";
import fakultetRoutes from "../routes/routeFakulteti.js";

const app = express();
const port = 3000;

app.use(express.json());  

app.use(express.urlencoded({ extended: true }));

app.use("/studentet", studentiRoutes);  
app.use("/lendet", lendaRoutes);
app.use("/fakultetet", fakultetRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}..`);
});
