const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
const authHeaders = req.header('Authorization');
const token = authHeaders.split(" ")[1];
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
 req.userId = decoded.userId;   
 next();
 } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;