
const bcrypt = require('bcryptjs');
const bus = require('../../../models/bus');
const trip = require('../../../models/trip');
const duration = require('../../../models/duration');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const typebus = require('../../../models/typebus');
const disk = require('../../../models/disk');

const { Op } = require('sequelize');  
const axios = require('axios');
const util = require('../../../util/helper');
const driver = require('../../../models/driver');
const companies = require('../../../models/companies');
const moment = require('moment-timezone')




exports.getinfodriver = (req, res) => {

  const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
  const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

        trip.findAll({
      // order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
      include: [
        {
          model: disk,
          attributes: ['numberdisk'],
          where: { status: true },
          required: false
        },
        {
          model: bus,
          attributes: ['number'],
          include: [
            {model:driver , attributes:["id","fullname"]},
            { model: typebus, attributes: ['type'] },
            { model: companies, attributes: ['name'] },
          ],
        },
        {
          model: duration,
          attributes: ['duration'],
          include: [
            {
              model: starting,
              attributes: ['name'],
            },
            {
              model: destination,
              attributes: ['name'],
            },
          ],
        },
      ],
      where: {
        [Op.or]: [
          {
            tripDate: currentDate,
            tripTime: { [Op.gte]: currentTime }, // الرحلات في نفس التاريخ والوقت الحالي وما بعده
          }
          , {
            tripDate: currentDate,
            tripTime: { [Op.lte]: currentTime },
          }
        ],
      },
      attributes: {
        exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
      },
    }).then((trips) => {
      if (trips.length === 0) {
        return res.error('Not found any trips available at the current time', 404);
      }
      
      const tripss = trips.map((trip) => {
console.log(trip.tripTime)
        const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);

        if ( trip.bus.driver.id == req.driver.id && trip.tripDate === currentDate && trip.tripTime <= currentTime && totalTime >= currentTime) {
          return {
            id: trip.id,
            timeTrip:"now",
            idDriver:trip.bus.driver.id,
            fullname:trip.bus.driver.fullname,
            tripDate: trip.tripDate,
            tripTime: timetrip,
            price: trip.price,
            duration: duration,
            starting: trip.duration.starting.name,
            destination: trip.duration.destination.name,
            typebus: trip.bus.typebus.type,
            numberbus: trip.bus.number,
            company: trip.bus.company.name,
            arrivalTime: totalTime,
            numberdisksisFalse,
          };
        }else if (trip.tripDate === currentDate && trip.tripTime >= currentTime) {
          return {
            id: trip.id,
            timeTrip: "After a while",
            idDriver:trip.bus.driver.id,
            fullname:trip.bus.driver.fullname,
            tripDate: trip.tripDate,
            tripTime: timetrip,
            price: trip.price,
            duration: duration,
            starting: trip.duration.starting.name,
            destination: trip.duration.destination.name,
            typebus: trip.bus.typebus.type,
            numberbus: trip.bus.number,
            company: trip.bus.company.name,
            arrivalTime: totalTime,
            numberdisksisFalse,
          };
        }
      });


      const filteredTrips = tripss.filter((trip) => trip !== undefined);
      if(filteredTrips){
        res.success(filteredTrips, 'These are the required trips');

      } else{
       
          return res.error('not found any trip for this driver' , 404)
        
      }

    });
 
};




