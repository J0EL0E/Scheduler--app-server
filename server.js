const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth.js');
const errorHandler = require('./middleware/errorHandler.js');
const cors = require('cors');
const corsOption = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE',
    allowedHeaders: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Content-Type', 
        'Authorization'
    ],
    credentials:true,          
    optionSuccessStatus:200
}
require('dotenv').config();
const app = express();
const port = process.env.API_SERVER_URL || 3000;

async function connectDB () {
    try{
        await mongoose.connect( process.env.DB_URI , () => {
            console.log(`MongoDB Connected`);
    }catch(err){
        console.log(err)
    }
}
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use('/', authRoute);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Listening from port ${port}`)
});

module.exports = app;
