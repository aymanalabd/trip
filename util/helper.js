const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config();


exports.handleerror = (req , res , next)=>{
    const result = validationResult(req);
if(!result.isEmpty()){
    const errorResponse = result.array()
    return res.error(errorResponse[0].msg,422)
}
next()
}

exports.generateToken = (data)=>{
    const token = jwt.sign(data , process.env.ACCESSTOKEN);
    const refreshtoken = jwt.sign(data ,  process.env.REFRESHTOKEN , {expiresIn:'30d'});

    return {token, refreshtoken};
}




exports.calculateTotalTime = (trip) => {
    const startTime = trip.tripTime;
    const endTime = trip.duration.duration;
    
    const startHours = parseInt(startTime.split(':')[0]);
    const startMinutes = parseInt(startTime.split(':')[1]);
    const timetrip = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;


    const durationHours = parseInt(endTime.split(':')[0]);
    const durationMinutes = parseInt(endTime.split(':')[1]);
    const duration = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`;


    const totalMinutes = startMinutes + durationMinutes;
    const totalHours = startHours + durationHours + Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalTime = `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const numberdisksisFalse = trip.disks.map(disk => disk.numberdisk);

   

    return {totalTime , duration , timetrip , numberdisksisFalse }
  };

