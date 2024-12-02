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
router.get('/confirm-email/:token', userController.confirmEmail);
router.get('/google', (req, res, next) => {
    const userType = req.query.type;
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: userType 
    })(req, res, next);
});
router.get('/google/redirect', passport.authenticate('google',{ failureRedirect: '/auth/failure' }),(req, res) => {
    const userid = req.user._id;
    const usertype = req.query.state;
    const utype = usertype == 'false' ? 'customer' : 'owner'

    if((req.user.isOwner && usertype === 'false') || (!req.user.isOwner && usertype === 'true')) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=Unauthorized&type=${utype}`);
    }
    const token = jwt.sign({_id: userid}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
})

router.get('/failure', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=User Not Registered`);
   //res.status(401).json({ error: 'User Not Registered' });
});

router.get('/user-data', userController.getAllUsers);

module.exports = router;
