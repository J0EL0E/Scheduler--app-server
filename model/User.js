const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    username : {type: String, unique: true, required: true},
    password : {type: String, required: true },
    isEmail_Sent : {type: Boolean}
})

async function connectDB () {
    try{
        const connected = await mongoose.connect('process.env.DB_URL', {
            serverSelectionTimeoutMS: 30000 
    });
        console.log(`MongoDB Connected: ${connected.connection.host}`);
    }catch(err){
        console.log(err)
    }
}
const User  = mongoose.model('User', userSchema);


module.exports = { User, connectDB };