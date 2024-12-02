const usermodel = require('../model/usermodel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const dns = require('dns');
const Token = require('../model/tokenmodel');
const { EmailVerificationTemplate, ResetPasswordTemplate } = require('../templates/templates.js');
require('dotenv').config();

const errorHandle = (err) => {
    return err.message || 'An unknown error occurred';
};

function isDomainValid(email) {
    return new Promise((resolve) => {
        const domain = email.split('@')[1];
        dns.resolveMx(domain, (error, addresses) => {
            if (error || !addresses || addresses.length === 0) {
                resolve(false);  // No valid MX record
            } else {
                resolve(true);  // Valid MX record found
            }
        });
    });
}

const signup_post = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, isOwner } = req.body;
        const user = await usermodel.findOne({ email: email });
    
        if (user) {
            return res.status(409).json({ message: "User already exists" })
        }
        // Validate email domain
        const domainValid = await isDomainValid(email);
        if (!domainValid) {
            return res.status(400).json({ message: "Invalid email domain" });
        }
        if (password !== confirmPassword) {
            return res.status(401).json({ message: "Password not matching" })
        }

        const newUser = new usermodel({
            name: name,
            email: email,
            password: password,
            isOwner: isOwner
        })
        await newUser.save();

        // Generate a confirmation token
        const confirmationToken = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        // Send confirmation email
        await sendConfirmationEmail(name, email, confirmationToken);

        res.status(200).json({ message: "User created successfully", userId: newUser._id, owner: newUser.isOwner })

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }

}

const sendConfirmationEmail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.email,
                pass: process.env.password
            }
        });
        console.log(process.env.BACKEND_URL);
        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Account Confirmation',
            html: EmailVerificationTemplate.replace("{Username}",name).replace("{url}",`${process.env.BACKEND_URL}/auth/confirm-email/${token}`)
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.log(error);
    }
};

const confirmEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sessionToken = randomstring.generate(32);
        const user = await usermodel.findByIdAndUpdate(
            decoded._id,
            { emailVerified: true , sessionToken: sessionToken },
            { new: true, runValidators: false }
        );

        if (!user) {
            return res.status(400).json({ message: "Invalid token or user does not exist" });
        }
        const userType = user.isOwner === true ? 'owner' : 'customer';
        
        res.redirect(`${process.env.FRONTEND_URL}/login?type=${userType}&verified=true`);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: "Email confirmation failed" });
    }
};


const login_post = async (req, res) => {
    try {
        const { email, password, isOwner } = req.body;
        const data = await usermodel.findOne({ email: email })
        if (!data) {
            return res.status(401).json({ message: "Enter Valid Email" });
        }

        if (data.isOwner != isOwner) {
            return res.status(401).json({ message: "Invalid User" });
        }
        if (!data.emailVerified) {
            return res.status(403).json({ 
                message: "Please verify your email before logging in. Check your inbox for the confirmation link." 
            });
        }
        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Enter valid password" });
        }
        const token = jwt.sign({ _id: data._id , isOwner:data.isOwner }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        })
        res.setHeader('Authorization', 'Bearer ' + token);
        res.status(200).json({ message: "User logged in successfully", userId: data._id, token: token })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }

}

const sendresetpasswordmail = async (name, email, token) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {
                user: process.env.email,
                pass: process.env.password
            }
        });

        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'For reset password',
            html: ResetPasswordTemplate.replace("{Username}",name).replace("{url}",`${process.env.FRONTEND_URL}/auth/reset-password/${token}`)

        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(`email send successfully ${info.response}`);
            }
        })
    } catch (err) {
        console.log(err);
        const error_message = errorHandle(err); // Use the correct function name
        res.status(401).json({ message: error_message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email , userType } = req.body;
        const userdata = await usermodel.findOne({ email: email });

        if (!userdata) {
            return res.status(401).send({ message: "Enter valid registered Email Id" });
        }
        if(userdata.isOwner && userType === 'customer' || (!userdata.isOwner && userType === 'owner')) {
            return res.status(401).json({message: "Unauthorized"})
        }
        let tokendata = await Token.findOne({ userid: userdata._id });
        if (!tokendata) {
            const rs = randomstring.generate();
            tokendata = new Token({
                userid: userdata._id,
                token: rs
            });
            await tokendata.save();
        }

        sendresetpasswordmail(userdata.name, userdata.email, tokendata.token);
        return res.status(200).send({ message: "Reset Password Link has been sent to your email" })

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }

}

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const tokendata = await Token.findOne({ token: token });
        if (tokendata) {
            const password = req.body.password;
            if (!password) {
                return res.status(401).send({ message: "Password is required" });
            }
            const user = await usermodel.findOne({ _id: tokendata.userid });
            if (!user) {
                return res.status(400).send({ message: "Cannot find user" });
            }
            user.password = password;
            await user.save();
            await tokendata.deleteOne({ token: token })
            return res.status(200).send({ message: "Password changed successfully" });
        }
        else {
            return res.status(404).send({ message: "Invalid Token" });
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        // No authentication required, fetch all users
        const userData = await usermodel.find({})
            .select('name email isOwner'); // Select only needed fields
        res.status(200).json({ 
            success: true,
            userData: userData 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch users' 
        });
    }
};

module.exports = { isDomainValid, signup_post, login_post, forgotPassword, getAllUsers, resetPassword, confirmEmail, sendresetpasswordmail, sendConfirmationEmail, errorHandle };
