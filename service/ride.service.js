const mapsService = require('../service/maps.service');
const rideModel = require('../models/rider.model');
const crypto = require('crypto');

const RIDE_TYPES = {
    Car: { basePrice: 2.5, pricePerKm: 1.5, minimumFare: 5 },
    Bike: { basePrice: 3.5, pricePerKm: 2.0, minimumFare: 8 },
    Van: { basePrice: 5.0, pricePerKm: 2.5, minimumFare: 10 },
    Auto: { basePrice: 6.0, pricePerKm: 3.0, minimumFare: 15 }
};

// Utility function
function getOtp(num) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num) - 1);
}

// Fare calculator
async function getfare(pickup, destination, vehicleType = 'Car') {
    if (!pickup || !destination) throw new Error('Pickup and destination are required');

    const fareData = await mapsService.getDistanceAndTime(pickup, destination);
    if (!fareData?.distance) throw new Error('Unable to calculate fare');

    const distanceInKm = fareData.distance / 1000;
    const config = RIDE_TYPES[vehicleType];
    if (!config) throw new Error(`Invalid ride type: ${vehicleType}`);

    const baseFare = config.basePrice + (config.pricePerKm * distanceInKm);
    return Math.max(baseFare, config.minimumFare);
}

// Calculate fare for all vehicle types
async function getAllVehicleFares(pickup, destination) {
    if (!pickup || !destination) throw new Error('Pickup and destination are required');

    const fareData = await mapsService.getDistanceAndTime(pickup, destination);
    if (!fareData?.distance) throw new Error('Unable to calculate fare');

    const distanceInKm = fareData.distance / 1000;
    const fares = {};
    for (const [type, config] of Object.entries(RIDE_TYPES)) {
        const baseFare = config.basePrice + (config.pricePerKm * distanceInKm);
        fares[type] = Math.max(baseFare, config.minimumFare);
    }
    return fares;
}

// Create a ride
async function createRide({ user, pickup, destination, vehicleType }) {
    if (!user || !pickup || !destination || !vehicleType)
        throw new Error('User, pickup, destination, and vehicle type are required');

    const fare = await getfare(pickup, destination, vehicleType);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare,
    });

    return ride;
}

// Confirm a ride
async function confirmRide({ rideId, captain }) {
    if (!rideId) throw new Error('Ride id is required');
    await rideModel.findOneAndUpdate({ _id: rideId }, {
        status: 'accepted',
        captain: captain._id
    });
    const ride = await rideModel.findOne({ _id: rideId }).populate('user')
        .populate('captain').populate('otp')
       
    if (!ride) throw new Error('Ride not found');
    return ride;
}

// Start a ride
async function startRide({ rideId, otp, captain }) {
    if (!rideId || !otp) throw new Error('Ride id and OTP are required');

    const ride = await rideModel.findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'accepted') throw new Error('Ride not accepted');
    if (ride.otp !== otp) throw new Error('Invalid OTP');

    await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });

    return ride;
}

// End a ride
async function endRide({ rideId, captain }) {
    if (!rideId) throw new Error('Ride id is required');

    const ride = await rideModel.findOne({ _id: rideId, captain: captain._id })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'ongoing') throw new Error('Ride not ongoing');

    await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'completed' });

    return ride;
}

module.exports = {
    getfare,
    getAllVehicleFares,
    createRide,
    confirmRide,
    startRide,
    endRide
};
