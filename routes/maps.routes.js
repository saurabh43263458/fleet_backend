const express = require('express');
const router = express.Router ();
const mapsController = require('../controllers/map.controller');
const authMiddleware = require('../middleware/auth.middleware');
const {query} = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({min:3}), 
    authMiddleware.authUser, mapsController.getCoordinates);

router.get('/get-distance-time',
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min:3}),
    authMiddleware.authUser,
    mapsController.getDistanceAndTime
)
router.get('/get-suggestion',
    query('input').isString().isLength({min:3}),
    authMiddleware.authUser,
    mapsController.getSuggestions
)
module.exports = router;