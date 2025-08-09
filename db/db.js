const mongoose = require('mongoose');


function connectToDb() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

}




module.exports = connectToDb;