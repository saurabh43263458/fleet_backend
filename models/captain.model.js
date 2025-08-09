const mongoose =require('mongoose')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'firstname must be at least 3 characters long']
        },
        lastname:{
            type:String,
            minlength:[3,'firstname must be at least 3 characters long']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,

    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'colr name must be 3 char'],
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'plate must be atleast 3 characters long'],
        },
        capacity:{
          type:Number,
          required:true,
          min:[1,'Capacity must be at least 1']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['Car','Motorcycle','Auto'],
        },

    },
    location:{
        ltd:{
            type:Number,
        },
        lng:{
         type:Number,
        }
    }
})

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}
captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
captainSchema.statics.hashed = async function(password){
    return await bcrypt.hash(password,10);
}


const captainModel = mongoose.model('captain',captainSchema);
module.exports =captainModel;
