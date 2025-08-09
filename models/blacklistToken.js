const mongoose = require('mongoose')

backlisted = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:86400
    }
})

module.exports = mongoose.model("blacklist",backlisted);