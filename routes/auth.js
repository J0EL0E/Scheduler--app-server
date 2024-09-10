const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyToken, verifyUser } = require('../controller/authController.js');


router.get('/', (req, res) => {
    res.json({message: 'Login successfully'})
});
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/token/:refreshToken', verifyToken);
router.post('/verify-token/:refreshToken', verifyUser);


module.exports =  router;