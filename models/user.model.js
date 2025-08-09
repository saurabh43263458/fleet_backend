const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'first name should be atleast 3 word']
        },
        lastname:{
            type:String,
            minlength:[3,'first name should be atleast 3 word']
        }
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,'password must be atleast 6']
    },
    password:{
        type:String,
        required:true,
        select: false,
    },
    socketId:{
        type:String,
    },
})

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id: this._id},process.env.JWT_SECRET,{expiresIn:"24h"});
    return token;
}

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password,10);
}

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;