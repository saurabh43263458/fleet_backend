const express= require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller");
const {body} =require('express-validator');
const authMiddleware = require("../middleware/auth.middleware")
router.post('/register',[
    body('email').isEmail().withMessage("email is wrong"),
    body('password').isLength({min:6}).withMessage("password is not in correct format"),
    body('fullname.firstname').isLength({min:3}).withMessage("name should atleast 6 char"),
    body('vehicle.color').isLength({min:3}).withMessage("color name should be 3 letter"),
    body('vehicle.plate').isLength({min:3}).withMessage("it should be of length 3"),
    body('vehicle.capacity').isInt({min:1}).withMessage("minimum capacity should be one"),
    body('vehicle.vehicleType').isIn(['Car','Motorcycle','Auto','Bike']).withMessage("give type")
],captainController.registerCaptain)

router.post('/login',[
    body('email').isEmail().withMessage("email is wrong"),
    body('password').isLength({min:6}).withMessage("password is not in correct format")
],captainController.loginCaptain);

router.get('/profile',authMiddleware.authCaptain,captainController.profileCaptain)

router.get('/logout',authMiddleware.authCaptain,captainController.logout);
module.exports = router;
