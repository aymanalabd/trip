const companies = require('../../../models/companies');

  const axios = require('axios');

const util = require('../../../util/helper');
const { Op } = require('sequelize');  
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const duration = require('../../../models/duration');
const rating = require('../../../models/rating');
const driver = require('../../../models/driver');




const moment = require('moment-timezone');
const { date } = require('joi');


exports.getalltripfinished = (req, res) => {
  const companyId = req.companies.companiesId;


  const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
    const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

  

console.log("currentDate: "+ currentDate)
console.log("currentTime: "+ currentTime)  


      trip.findAll({
        order: [['tripDate', 'DESC'], ['tripTime', 'ASC']],
        include: [
          {
            model: rating,
            attributes: [["rating", "sum"]],
            required: false,
            raw: true,
            nested: true,
          },
          {
            model: disk,
            attributes: ['numberdisk'],
            where: { status: false, ispaid: true },
            required: false,
          },
          {
            model: bus,
            attributes: ['number'],
            where: { companyId: companyId },
            include: [
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
            { tripDate: { [Op.lt]: currentDate } }, // Trips before the current date
            {
              tripDate: currentDate,
              tripTime: { [Op.lt]: currentTime }, // Trips on the current date and before the current time
            },
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
          const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);
          let ratingSum = 0;
          if (trip.ratings.length > 0) {
            trip.ratings.forEach((rate) => {
              ratingSum += rate.dataValues.sum;
            });
          }

          return {
            id: trip.id,
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
            rating: ratingSum / trip.ratings.length,
            count: trip.ratings.length,
            numberdisksisFalse,
          };
        });

        res.success(tripss, 'These are the required trips');
      });
   
};

exports.gettripisfinished = (req, res) => {
  const companyId = req.companies.companiesId;

  const startingId = req.body.startingid;
  const destinationId = req.body.destinationid;

  const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
  const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

  console.log(currentDate)
  console.log(currentTime);

      trip.findAll({
        order: [['tripDate', 'DESC'], ['tripTime', 'ASC']],
        include: [
          {
            model: rating,
            attributes: [["rating", "sum"]],
            required: false,
            raw: true,
            nested: true,
          },
          {
            model: disk,
            attributes: ['numberdisk'],
            where: { status: true },
            required: false,
          },
          {
            model: bus,
            attributes: ['number'],
            where: { companyId: companyId },
            include: [
              { model: typebus, attributes: ['type'] },
              { model: companies, attributes: ['name'] },
            ],
          },
          {
            model: duration,
            attributes: ['duration'],
            where: { startingId: startingId, destinationId: destinationId },
            include: [
              { model: starting, attributes: ['name'] },
              { model: destination, attributes: ['name'] },
            ],
          },
        ],
        where: {
          [Op.or]: [
            { tripDate: { [Op.lt]: currentDate } }, // الرحلات قبل التاريخ الحالي
            {
              tripDate: currentDate,
              tripTime: { [Op.lt]: currentTime }, // الرحلات في نفس التاريخ و قبل الوقت الحالي
            },
          ],
        },
        attributes: {
          exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
        },
      }).then((trips) => {
        if (trips.length === 0) {
          return res.error('Not found any finished trips in the current time', 404);
        }

        const tripss = trips.map((trip) => {
          const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);
          let ratingSum = 0;
          if (trip.ratings.length > 0) {
            trip.ratings.forEach((rate) => {
              ratingSum += rate.dataValues.sum;
            });
          }

          return {
            id: trip.id,
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
            rating: trip.ratings.length > 0 ? ratingSum / trip.ratings.length : 0,
            count: trip.ratings.length,
            numberdisksisFalse,
          };
        });

        res.success(tripss, 'These are the finished trips');
      });
    
};

  exports.gettripisavailable = (req, res) => {
    const companyId = req.companies.companiesId;
  
    const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
    const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

        const startingId = req.body.startingid;
        const destinationId = req.body.destinationid;
  
        trip.findAll({
          order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
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
              where: { companyId: companyId },
              include: [
                { model: typebus, attributes: ['type'] },
                { model: companies, attributes: ['name'] },
              ],
            },
            {
              model: duration,
              attributes: ['duration'],
              where: { startingId: startingId, destinationId: destinationId },
              include: [
                { model: starting, attributes: ['name'] },
                { model: destination, attributes: ['name'] },
              ],
            },
          ],
          where: {
            [Op.or]: [
              { tripDate: { [Op.gt]: currentDate } }, // الرحلات بعد التاريخ الحالي
              {
                tripDate: currentDate,
                tripTime: { [Op.gte]: currentTime }, // الرحلات في نفس التاريخ والوقت الحالي وما بعده
              },
              {
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
            return res.error('Not found any trips available in the current time', 404);
          }
          const tripss = trips.map((trip) => {
            const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);
  
            if (trip.tripDate === currentDate && (trip.tripTime <= currentTime && totalTime >= currentTime)) {
              return {
                id: trip.id,
                isAvailable: "Now",
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
            } else if (trip.tripDate === currentDate && trip.tripTime >= currentTime) {
              return {
                id: trip.id,
                isAvailable: "Today",
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
            } else if (trip.tripDate > currentDate) {
              return {
                id: trip.id,
                isAvailable: "Later",
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
          const filteredTrips = tripss.filter((trip) => trip !== undefined); // استبعاد القيم الـ null
  
          res.success(filteredTrips, 'These are the required trips');
        });
      
  };

    exports.filtertripbynumberbus = (req, res) => {
      const companyId = req.companies.companiesId;
      const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
      const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

    
          const startingId = req.body.startingid;
          const destinationId = req.body.destinationid;
          const numberbus = req.body.numberbus;
    
        
          trip.findAll({
            order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
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
                where: { companyId: companyId, number: numberbus },
                include: [
                  { model: typebus, attributes: ['type'] },
                  { model: companies, attributes: ['name'] },
                ],
              },
              {
                model: duration,
                attributes: ['duration'],
                where: { startingId: startingId, destinationId: destinationId },
                include: [
                  { model: starting, attributes: ['name'] },
                  { model: destination, attributes: ['name'] },
                ],
              },
            ],
            where: {
              [Op.or]: [
                { tripDate: { [Op.gt]: currentDate } }, // الرحلات بعد التاريخ الحالي
                {
                  tripDate: currentDate,
                  tripTime: { [Op.gte]: currentTime }, // الرحلات في نفس التاريخ والوقت الحالي وما بعده
                },
                {
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
              return res.error('Not found any available trips based on the entered information', 404);
            }
            const tripss = trips.map((trip) => {
              const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);
    
              if (trip.tripDate === currentDate && (trip.tripTime <= currentTime && totalTime >= currentTime)) {
                return {
                  id: trip.id,
                  isAvailable: 'Now',
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
              } else if (trip.tripDate === currentDate && trip.tripTime >= currentTime) {
                return {
                  id: trip.id,
                  isAvailable: 'Today',
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
              } else if (trip.tripDate > currentDate) {
                return {
                  id: trip.id,
                  isAvailable: 'Later',
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
            const filteredTrips = tripss.filter((trip) => trip !== undefined); // استبعاد القيم الـ null
    
            res.success(filteredTrips, 'These are the required trips');
          });
        
    };



exports.filtertripbynumberbusonly = (req, res) => {
  const companyId = req.companies.companiesId;
  const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
  const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')


      const numberbus = req.body.numberbus;

      trip.findAll({
        order: [['tripDate', 'DESC'], ['tripTime', 'ASC']],
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
            where: { companyId: companyId, number: numberbus },
            include: [
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
            { tripDate: { [Op.gt]: currentDate } }, // الرحلات بعد التاريخ الحالي
            {
              tripDate: currentDate,
              tripTime: { [Op.gte]: currentTime }, // الرحلات في نفس التاريخ والوقت الحالي وما بعده
            },
            {
              tripDate: currentDate,
              tripTime: { [Op.lte]: currentTime },
            }
          ],
        },
        attributes: {
          exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
        },
      }).then((trips) => {
        if (trips.length == 0) {
          return res.error('Not found any trips available by the provided information', 404);
        }
        const tripss = trips.map((trip) => {

          const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip)

          if (trip.tripDate == currentDate && (trip.tripTime <= currentTime && totalTime >= currentTime)) {
            return {
              id: trip.id,
              isAvailable: "Now",
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
            }
          } else if (trip.tripDate == currentDate && (trip.tripTime >= currentTime)) {
            return {
              id: trip.id,
              isAvailable: "Today",
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
            }
          } else if (trip.tripDate > currentDate) {
            return {
              id: trip.id,
              isAvailable: "Later",
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
            }
          }

        });
        const filteredTrips = tripss.filter((trip) => trip !== undefined); // استبعاد القيم الـ null

        res.success(filteredTrips, 'These are the required trips');
      })
  
}


exports.gettripscurrent = (req, res) => {
  const companyId = req.companies.companiesId;

  const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
    const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

          trip.findAll({
        order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
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
            where: { companyId: companyId },
            include: [
              { model: typebus, attributes: ['type'] },
              { model: companies, attributes: ['name'] },
              { model: driver, attributes: ['id'] },

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
           
             
              tripDate: currentDate,
              tripTime: { [Op.lte]: currentTime },
            
          
        },
        attributes: {
          exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
        },
      }).then((trips) => {
        if (trips.length == 0) {
          return res.error('Not found any trips available at the current time', 404);
        }
        
        const tripss = trips.map((trip) => {
          const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);

          if (trip.tripDate === currentDate && trip.tripTime <= currentTime && totalTime >= currentTime) {
            return {
              id: trip.id,
              isAvailable: "Now",
              tripDate: trip.tripDate,  
              tripTime: timetrip,
              price: trip.price,
              duration: duration,
              starting: trip.duration.starting.name,
              destination: trip.duration.destination.name,
              typebus: trip.bus.typebus.type,
              numberbus: trip.bus.number,
              company: trip.bus.company.name,
              driverId:trip.bus.driver.id,
              arrivalTime: totalTime,
              numberdisksisFalse,
            };
          }
        });

        const filteredTrips = tripss.filter((trip) => trip !== undefined); // استبعاد القيم الـ null
       
        if(filteredTrips.length == 0){
          return res.error('Not found any trips available at the current time', 404);
        }
        res.success(filteredTrips, 'These are the required trips');
      });
    
   
};



exports.gettripsavailable = (req, res) => {
  const companyId = req.companies.companiesId;

  const currentDate = moment.tz('Asia/Damascus').format('YYYY-MM-DD')
    const currentTime =  moment.tz('Asia/Damascus').format('HH:mm')

  trip.findAll({
    order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
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
        where: { companyId: companyId },
        include: [
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
        { tripDate: { [Op.gt]: currentDate } }, // الرحلات بعد التاريخ الحالي
        {
          tripDate: currentDate,
          tripTime: { [Op.gte]: currentTime }, // الرحلات في نفس التاريخ والوقت الحالي وما بعده
        },
        {
          tripDate: currentDate,
          tripTime: { [Op.lte]: currentTime },
        },
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
      const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);

      if (trip.tripDate === currentDate && trip.tripTime <= currentTime && totalTime >= currentTime) {
        return {
          id: trip.id,
          isAvailable: "Now",
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
      } else if (trip.tripDate === currentDate && trip.tripTime >= currentTime) {
        return {
          id: trip.id,
          isAvailable: "Today",
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
      } else if (trip.tripDate > currentDate) {
        return {
          id: trip.id,
          isAvailable: "Later",
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

    const filteredTrips = tripss.filter((trip) => trip !== undefined); // استبعاد القيم الـ null

    res.success(filteredTrips, 'These are the required trips');
  }).catch(error => {
    res.error('An error occurred while retrieving trips:', error);
  });
};



exports.getonetrip = (req, res) => {
  const id = req.params.id;
  trip.findOne({
    where: { id: id },
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
    attributes: {
      exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
    },
  }).then((trip) => {
    if (!trip) {
      return res.error('Trip not found', 404);
    }

    const { duration, numberdisksisFalse, timetrip, totalTime } = util.calculateTotalTime(trip);

    const tripData = {
      id: trip.id,
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

    res.success(tripData, 'This is the required trip');
  }).catch((error) => {
    res.error('An error occurred while retrieving the trip', 500);
  });
};