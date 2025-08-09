const express  = require('express');
const app =express();
const dotenv  = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser =require('cookie-parser')
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes')
const captainRoutes = require('./routes/captain.routes');
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.route');
const paymentRoutes = require("./routes/paymentRoutes");
connectToDb();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res) => {
  res.send("hello world");
})
app.use('/captains',captainRoutes);
app.use('/user',userRoutes);
app.use('/maps',mapRoutes)
app.use('/ride',rideRoutes);
app.use("/payment", paymentRoutes);
module.exports = app;