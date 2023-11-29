import express  from "express";
import cors from "cors";
// const express = require('express');
import dotenv from "dotenv"
import conectarDB from "./config/db.js";
import veterinarioRotes from './routers/veterinarioRoutes.js'
import pacientesRotes from './routers/pacientesRotes.js'

const app = express();

app.use(express.json())
dotenv.config();
conectarDB();

const urlsPermitidos = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin,callback){
        if(urlsPermitidos.indexOf(origin) !== -1) {
            callback(null,true)
        }else{
            callback(new Error('Url no permitida'))
        }
    },
};

app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinarioRotes)
app.use('/api/pacientes', pacientesRotes)

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});


