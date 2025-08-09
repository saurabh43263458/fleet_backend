const mapService = require('../service/maps.service');
const { validationResult } = require('express-validator');
module.exports.getCoordinates = async (req, res, next) => {
     const error = validationResult(req);
     if(!error.isEmpty()){
        return res.status(400).json({"success":false,"message":"something is not right"});
     }
     const {address} = req.query;
     try{
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json({"success":true,"coordinates":coordinates});
     }catch(error){
        console.error(error);
        res.status(500).json({"success":false,"message":"Internal server error"});
     }
}
module.exports.getDistanceAndTime = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({"success":false,"message":`something is not right ${error}`});
    }
    console.log(req.query, "ioi");
    const {origin,destination} = req.query;
    try{
        const distanceAndTime = await mapService.getDistanceAndTime(origin,destination);
        res.status(200).json({"success":true,"distanceAndTime":distanceAndTime});
    }
    catch(error){
        console.log(error);
        res.status(500).json({"success":false,"message":"Interal error"})
    }
}
module.exports.getSuggestions = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({"success":false,"message":"something is not right"});
    }
    const {input} = req.query;
    try{
        // Assuming you have a method to get suggestions based on input
        const suggestions = await mapService.getSuggestions(input);
        res.status(200).json({"success":true,"suggestions":suggestions});
    }catch(error){
        console.error(error);
        res.status(500).json({"success":false,"message":"Internal server error"});
    }
}
