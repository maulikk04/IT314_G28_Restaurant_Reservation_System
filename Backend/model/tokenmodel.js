const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const tokenschema = new Schema({
    userid:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required : true
    },
    token : {
        type: String,
        required : true
    },
    createdAt : {
        type:Date,
        default :Date.now,
        expires: 3600
    }
})

const token = new mongoose.model('token' ,tokenschema );
module.exports = token