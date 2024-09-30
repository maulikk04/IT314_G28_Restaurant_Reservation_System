const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator')

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Enter name"]
    },
    email:{
        type:String,
        required:[true, "Enter email"],
        validate: {
            validator: function (v) {
                return validator.isEmail(v); 
            },
            message: "Enter a valid email"
        }
    },
    password:{
        type:String,
        required:[true,"Enter password"],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v);
            },
            message: "Password must be of minimum length 6 and must contain at least one uppercase letter, one number, and one special character"
        }
    },

    isOwner:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,10);
    next();
})


const user = new mongoose.model('user',userSchema);
module.exports = user;