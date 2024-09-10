const express = require('express');
const authRoute = require('./routes/auth.js');
const { connectDB } = require('./model/User.js');
const protectedRoute = require('./routes/protectedRoute.js');
const errorHandler = require('./middleware/errorHandler.js')
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


const app = express();
const port = 3000;


connectDB ();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.use('/', authRoute);
app.use('/protected', protectedRoute);
app.use(errorHandler);



app.listen(port, () => {
    console.log(`Listening from port ${port}`)
});

module.exports = app;
