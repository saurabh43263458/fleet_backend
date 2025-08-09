const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');
const  {body,query} =require('express-validator');
router.post('/create', 
     authMiddleware.authUser,
     body('pickup').isString().isLength({min:3,max:300}).withMessage('Pickup must be a string with Length between 3 and 34'),
     body('destination').isString().isLength({min:3,max:300}).withMessage('Destination must be a string with Length between 3 and 34'),
     body('vehicleType').isString().isIn(['Car', 'Bike', 'Van', 'Auto']).withMessage('Vehicle type must be one of Car, Bike, Van, Auto'),
     rideController.createRide);



router.get('/get-fare',
     authMiddleware.authUser,
     query('pickup').isString().isLength({min:3,max:300}).withMessage('Pickup must be a string with Length between 3 and 34'),
     query('destination').isString().isLength({min:3,max:300}).withMessage('Destination must be a string with Length between 3 and 34'),
     rideController.getAllFares
)
router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)




module.exports=router;

