const blacklistToken = require("../models/blacklistToken");
const captainModel = require("../models/captain.model");
const captainService = require('../service/captain.service');
const {validationResult} = require('express-validator');


module.exports.registerCaptain = async(req,res,next)=>{
    const error = validationResult(req);
    if(!error){
        res.status(400).json({"successor":false,"message":"something is not right"});
    }
    const {fullname, email,password,vehicle} = req.body
    const hashedpassword = await captainModel.hashed(password);
    const isEmailAlready = await captainModel.findOne({email});
    if(isEmailAlready){
        res.status(400).json({"successor":false,"message":"user already present"});
    }
    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email:email,
        password:hashedpassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    })

    const token = captain.generateAuthToken();
    res.status(200).json({token,captain});
}

module.exports.loginCaptain = async(req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(400).json({"success":false,error:error.array()})
    }
    const {email,password} = req.body;
    const captainExist = await captainModel.findOne({email}).select('+password');
    if(!captainExist){
        res.status(400).json({"success":false,message:"user already exist"});
    }
    const isMatch = await captainExist.comparePassword(password);
    if(!isMatch){
        res.status(400).json({"success":false,message:"password does not match"});
    }
    const token  = captainExist.generateAuthToken();
    res.cookie("token",token);
    res.status(200).json({"success":true,message:"captain got login",token});
}


module.exports.profileCaptain = async (req, res, next) => {
  try {
    const captain = req.captain;
    if (!captain) {
      return res.status(404).json({ success: false, message: "Captain not found" });
    }
    console.log(captain);
    return res.status(200).json({ success: true,message: "Captain profile retrieved successfully", captain });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports.logout = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistToken.create({token});
    res.clearCookie('token');
    res.status(200).json({success:true,message:"logout success"})
}