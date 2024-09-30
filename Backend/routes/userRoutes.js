const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');
const jwt = require('jsonwebtoken')
require('dotenv').config();

router.post('/signup',userController.signup_post);
router.post('/login',userController.login_post);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/google', passport.authenticate('google', {
    scope: ['profile' , 'email']
}));
router.get('/google/redirect', passport.authenticate('google',{ failureRedirect: '/auth/failure' }),(req, res) => {
    const userid = req.user._id;
    const token = jwt.sign({_id: userid}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:5173/auth/login?token=${token}`);
})

router.get('/failure', (req, res) => {
    res.redirect(`http://localhost:5173/auth/login?error=User Not Registered`);
});


module.exports = router;