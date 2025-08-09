const axios = require('axios');
const captainModel = require('../models/captain.model')
module.exports.getAddressCoordinate = async (address) => {
  const apikey = process.env.GOOGLE_MAPS_API;

  if (!apikey) {
    console.error('GOOGLE_MAPS_API not found in environment variables');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng
      };
    } else {
      console.error("Google Maps API response status:", response.data.status);
      throw new Error('Unable to fetch coordinates');
    }
  } catch (error) {
    console.error("Geocode API Error:", error.response?.data || error.message);
    throw new Error('Unable to fetch coordinates');
  }
};
module.exports.getDistanceAndTime = async (origin,destination)=>{
   if(!origin || !destination){
      throw new Error('Origin and destination are required');
   }
   const apikey = process.env.GOOGLE_MAPS_API;
   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apikey}`;
   try{
     const resp = await axios.get(url);
     if(resp.data.status ==='OK'){
      const element = resp.data.rows[0].elements[0];
      if(element.status === 'OK'){
         return {
            distance: element.distance.value,
            time: element.duration.value,
         };
     }
     else{
      throw new Error('Unable to fetch distance and time');
     }

   }
}catch(error){
      console.error("Distance and Time API Error:", error.response?.data || error.message);
      throw new Error('Unable to fetch distance and time');
   }
}
module.exports.getSuggestions = async (input) => {
   if(!input){
      throw new Error('Input is required for suggestions');
   }
   const apikey = process.env.GOOGLE_MAPS_API;
   const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apikey}`;
   try{
      const response = await axios.get(url);
      if(response.data.status === 'OK') {
        return response.data.predictions
   } 
}catch(error) {
      console.error("Suggestions API Error:", error.response?.data || error.message);
      throw new Error('Unable to fetch suggestions');
   }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}