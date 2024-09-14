const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const  User = require('../model/User.js');
const { sendEmailActivation} = require('./sendEmailConfimation.js')
require('dotenv').config();


async function registerUser(req, res, next){
    try {
        const {username, password} = req.body;
        const result = await User.find({username: username});
        if (!username ||  username == ' ' || !password || password === ' ') {
            res.status(400).json({ error: 'Username and password are required'});
        }
        else if(result.length !== 0){
            res.status(401).json({ error: 'Username is already used'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: username,
            password: hashedPassword,
            isEmail_Sent: null
        });
        await user.save();
// generating the email confirmation
        const registeredUser = await User.findOne({username: username});
        const accessToken = generateUserToken({userId: registeredUser._id})
        const refreshToken = jwt.sign({ userId: registeredUser._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '15m'});
        const verificationLink = `http://localhost:5173/verify-token/${refreshToken}`
//sending the email
        sendEmailActivation(registeredUser.username, verificationLink);
//updating the user
        await User.findOneAndUpdate({username: username}, {$set: {isEmail_Sent: true}});
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        //res.status(500).json({ error: 'Registration failed' });
        //next(error);
    }
}

async function loginUser(req, res, next){
    try {
        const {username, password} = req.body;
        //console.log(username, password)
        if (!username ||  username == ' ' || !password || password === ' ') {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = await User.findOne({username: username}, {username: true, password: true, _id:false});
        if(!user){
            res.status(401).json({error: "The user is not found"})
        } else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(401).json({error: "The password is incorrect"})
        } else {
            const accessToken = generateUserToken({ userId: user._id }); 
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '15m'});
            res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});     
            }
        }
    }catch (error)
    {   console.log(error)
        //res.status(500).json({ error: 'Login failed' });
        //next(error);
    }
}

function verifyToken(req, res, next) {
    const token = req.params.refreshToken;
    console.log(token)
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
     const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
     console.log(decoded);
     res.redirect('/');
     } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Expired Token' });
     }
};

function verifyUser(req, res, next) {
    const { refreshToken } = req.params;
    if (!refreshToken) return res.status(401).json({ error: 'Access denied' });
    try {
     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
     console.log(decoded);
     res.status(200).json({ message: 'Verification successful'});
    
     } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Invalid token' });
     }
};


function generateUserToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
};

module.exports = {registerUser, loginUser, verifyToken, verifyUser}