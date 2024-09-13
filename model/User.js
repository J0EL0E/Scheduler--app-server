const mongoose = require("mongoose");
const schema = mongoose.Schema;
require('dotenv').config();

const userSchema = new schema({
    username : {type: String, unique: true, required: true},
    password : {type: String, required: true },
    isEmail_Sent : {type: Boolean}
})

const User  = mongoose.model('User', userSchema);


module.exports =  User ;