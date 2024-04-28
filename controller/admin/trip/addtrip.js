



//models
const companies = require('../../../models/companies');
const { Op } = require('sequelize');  
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const  sequelize = require('sequelize');
const duration = require('../../../models/duration');
const rating = require('../../../models/rating');


const axios = require('axios')
const moment = require('moment');
const { required } = require('joi');



//for admin
exports.addtrip = (req , res)=>{
    const tripDate  = req.body.tripDate;
    const tripTime  = req.body.tripTime;
    const busid = req.body.busid;
    const starting = req.body.starting;
    const destination = req.body.destination;
    const moment = require('moment');

const currentTime = moment().format('HH:mm');
const currentDate = moment().format('YYYY-MM-DD');
if (tripDate < currentDate || (tripDate === currentDate && tripTime < currentTime)) {
  return res.error('This date or time is in the past', 402);
}

    bus.findOne({
        where: { id: busid },
        include: [
          {
            model: typebus,
            attributes: ["price"],
          },
        ],
      })
        .then(async (bus) => {
          const startleft = await duration.findOne({
            where: { startingId: starting, destinationId: destination },
          });
      
          const newTrip = await trip.create({
            tripDate: tripDate,
            tripTime: tripTime,
            busId: busid,
            price: Math.floor((startleft.km * bus.typebus.price)/1000) * 1000 ,
            durationId: startleft.id,
          });
      
          const disks = [];
          for (let i = 1; i <= bus.numofdisk; i++) {
            disks.push({
              numberdisk: i,
              status: true,
              tripId: newTrip.id,
              ispaid:false
            });
          }
      
          await disk.bulkCreate(disks);
      
          res.success({},'completed creating a  trip successfully')
        })
        .catch((err) => {
          res.error(err, 500);
        });
    }


    exports.deletetrip = (req, res) => {
      const id = req.params.id;
    
      trip.findByPk(id).then(trip => {
        if (!trip) {
          return res.error('the trip is not found' , 404)
        }
    
        disk.destroy({ where: { tripId: trip.id } }).then(() => {

         rating.destroy({ where: { tripId: trip.id } });
        }).then(() => {

           trip.destroy().then(() => {
      
            return res.success({} , 'complete delete the trip successfully')
        
        }).catch(error => {
        return res.error(error , 500)
        });
      }).catch(error => {
return res.error(error , 500)
      });
    }).catch(error => {
      return res.error(error , 500)
            });
  }

exports.updatetrip = (req , res )=>{
  const id = req.params.id;
  const tripDate = req.body.tripDate;
  const tripTime = req.body.tripTime;

  const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
        const currentDate = moment().format('YYYY-MM-DD'); // التاريخ الحالي في صيغة سنة-شهر-يوم
    
//اذا كان التاريخ المدخل اصغر من تاريخ الوقت الحالي ارجع رسالة خطا
  if (tripDate < currentDate) {
    return res.error(' this date is old' ,  402);
  } else{
    if(tripDate == currentDate && tripTime < currentTime){
      return res.error(' this time is old' ,  402);

    }
  } 
  trip.findByPk(id).then(trip=>{
    if (!trip) {
      return res.error('the trip is not found' , 404)
    }
    trip.update({
      tripDate:tripDate,
      tripTime:tripTime
    }).then(()=>{
      return res.success({} , 'updated trip successfully')
    })
  })
}

exports.getbusbyorg = (req, res) => {
  const tripDate = req.body.tripDate; // التاريخ المدخل
  const tripTime = req.body.tripTime;
  const startings = req.body.starting;
  const destinations = req.body.destination;
  axios.get('http://worldtimeapi.org/api/ip')
  .then(response => {
    const currentDateTime = response.data.datetime;
    const currentDate = currentDateTime.slice(0, 10);

    const currentTime = moment().format('HH:mm');
 
  // إذا كان التاريخ المدخل أصغر من التاريخ الحالي أو إذا كان التاريخ المدخل يساوي التاريخ الحالي والوقت المدخل أصغر من الوقت الحالي
  if (tripDate < currentDate || (tripDate === currentDate && tripTime < currentTime)) {
    return res.error('This date or time is in the past', 402);
  }

  bus.findAll({
    include: [
      {
        model: typebus,
        attributes: ["type"]
      },
      {
        model: trip,
        required: false,
        include: [
          {
            model: duration,
            attributes: ["duration"],
            include: [
              {
                model: starting,
                attributes: ["name"]
              },
              {
                model: destination,
                attributes: ["name"]
              }
            ]
          }
        ]
      }
    ],
    where: { companyId: req.companies.companiesId },
    order: [[{ model: trip, as: 'trips' }, 'updatedAt', 'DESC']],
  })
    .then((buses) => {
      const availableBuses = buses.filter(bus => {
        const startHourss = parseInt(tripTime.split(':')[0]);
        const startMinutess = parseInt(tripTime.split(':')[1]);
        const totalTimes = `${startHourss.toString().padStart(2, '0')}:${startMinutess.toString().padStart(2, '0')}`;
        
        if (bus.trips.length > 0) {
          const lastTrip = bus.trips[0];
          const startTime = bus.trips[0].tripTime;
          const endTime = bus.trips[0].duration.duration;
          const startHours = parseInt(startTime.split(':')[0]);
          const startMinutes = parseInt(startTime.split(':')[1]);
          const durationHours = parseInt(endTime.split(':')[0]);
          const durationMinutes = parseInt(endTime.split(':')[1]);
          const totalMinutes = startMinutes + durationMinutes;
          const totalHours = startHours + durationHours + Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const totalTime = `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          if (lastTrip.tripDate === tripDate && totalTimes <= totalTime || lastTrip.duration.destination.name != startings ) {
            return false;
          }
        }else{
          if(bus.place != startings){
            return false
          }
        }
        return true;
      });

      const busNumbers = availableBuses.map((bus) => {
        console.log(bus.id)
        const destination = bus.trips.length > 0 ? bus.trips[0].duration.destination.name : bus.place;
       
        return {
          id: bus.id,
          number: bus.number,
          type: bus.typebus.type,
          destination: destination
        }
      });

     return res.success(busNumbers);
    })
  })
    .catch((err) => {
      res.error(err.message, 500);
    });
};



exports.getduration = (req , res )=>{
  const startings = req.body.starting;
  const destinations = req.body.destination;
  duration.findOne({
    
    include:[
      {
        model:starting , attributes:["name"],
        where:{name:startings}
      },
      {
        model:destination , attributes:["name"],
        where:{name:destinations}
      }
    ]
  }).then(duration=>{
  
    if(duration){
      const durationHours = parseInt(duration.duration.split(':')[0]);
      const durationMinutes = parseInt(duration.duration.split(':')[1]);
      const durations = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}`;
  
   return res.success(durations)
    }else{
      return res.error('not found trips for information which you are entered ' , 404)
    }
  }).catch(err=>{
    return res.error(err , 500);
  })

}