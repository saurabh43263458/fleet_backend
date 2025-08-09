const { validationResult, query } = require('express-validator');
const rideservice = require('../service/ride.service');
const mapsService = require('../service/maps.service');
const {sendMessageToSocketId} = require('../socket');
const riderModel = require('../models/rider.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;
    console.log(req.user._id, pickup, destination, vehicleType);
    try {
        const ride = await rideservice.createRide({ user: req.user, pickup, destination, vehicleType });
        res.status(201).json({ success: true, ride });
        const pickupCoordinate = await mapsService.getAddressCoordinate(pickup);
        console.log(pickupCoordinate);
        const captainsInRadius = await mapsService.getCaptainsInTheRadius(pickupCoordinate.ltd,pickupCoordinate.lng, 100);
        ride.otp="";
        const rideWithUser = await riderModel.findOne({ _id: ride._id }).populate('user');
        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })
        console.log('Ride created and notifications sent to captains');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports.getfare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.query;
    try {
        const fare = await rideservice.getfare(pickup, destination, vehicleType);
        res.status(200).json({ success: true, fare });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports.getAllFares = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { pickup, destination } = req.query;
    try {
        const fares = await rideservice.getAllVehicleFares(pickup, destination);
        res.status(200).json({ success: true, fares });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;
    try {
        const ride = await rideservice.confirmRide({ rideId, captain: req.captain });
       console.log("🚨 ride.user:", ride.user); // This should show full user object
      console.log("🚨 ride.user.socketId:", ride.user?.socketId); 
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json({"message":ride,});
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideservice.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideservice.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}