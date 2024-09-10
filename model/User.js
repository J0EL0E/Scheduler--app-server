const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {type: String, unique: true, required: true},
    password : {type: String, required: true },
    isEmail_Sent : {type: Boolean}
})

async function connectDB () {
    try{
        const connected = await mongoose.connect('mongodb://127.0.0.1:27017/', {
            serverSelectionTimeoutMS: 30000 
    });
        console.log(`MongoDB Connected: ${connected.connection.host}`);
    }catch(err){
        console.log(err)
    }
}
const User  = mongoose.model('User', userSchema);


module.exports = { User, connectDB };