require('dotenv').config()
const detail = require('../model/usermodel');
const passport = require('passport');
const googglestrategy = require('passport-google-oauth20');

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
})

passport.use(new googglestrategy({
    callbackURL: 'http://localhost:4000/auth/google/redirect',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
},
    async (accessToken, refreshToken, profile, done)=>{
        try {
            const email = profile.emails[0].value;
            const user = await detail.findOne({email});
            if(!user)
                return done(null, false, { message: 'User not registered' });            
            return done(null, user); 
          
        } catch (err) {
            return done(err, null); 
        }
    }
))



