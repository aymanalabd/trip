const companies = require('../../../models/companies');
const moment = require('moment')
const util = require('../../../util/helper');
const { Op } = require('sequelize');  
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const  sequelize = require('sequelize');
const duration = require('../../../models/duration');
const custumer = require('../../../models/custumer');


exports.gettripisavailable = (req , res)=>{
const companyId = req.companies.companiesId;


    const startingId = req.body.startingid;
    const destinationId = req.body.destinationid;
  
    const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
    const currentDate = moment().format('YYYY-MM-DD'); 
    
    trip
    .findAll({
        order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
      include: [
        
      
        {
          model: disk,
          attributes: ['numberdisk'],
          where: { status: true },
        },
        {
          model: bus,
          attributes: ['number'],
          where:{companyId:companyId},
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
      ],
      },
      attributes: {
        exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
      },
    }).then((trips) => {
        if(trips.length == 0){
            return res.error('not found any trips available in current time');
        }
        const tripss = trips.map((trip) => {
         
          const { duration ,numberdisksisFalse , timetrip , totalTime} = util.calculateTotalTime(trip)

               
              
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
                  numberdisksisFalse,
                }

              
            ;
      
        });
  
        res.success(tripss, 'These are the required trips');
      })
}


exports.gettripisfinished = (req , res)=>{
  const companyId = req.companies.companiesId;
  
  
      const startingId = req.body.startingid;
      const destinationId = req.body.destinationid;
    
      const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
      const currentDate = moment().format('YYYY-MM-DD'); 
      
      trip
      .findAll({
          order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
        include: [
          
        
          {
            model: disk,
            attributes: ['numberdisk'],
            where: { status: true },
          },
          {
            model: bus,
            attributes: ['number'],
            where:{companyId:companyId},
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
          { tripDate: { [Op.lte]: currentDate } }, // الرحلات قبل التاريخ الحالي
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
          if(trips.length == 0){
              return res.error('not found any trips available in current time');
          }
          const tripss = trips.map((trip) => {
           
            const { duration ,numberdisksisFalse , timetrip , totalTime} = util.calculateTotalTime(trip)
  
                 
                
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
                    numberdisksisFalse,
                  }
  
                
              ;
        
          });
    
          res.success(tripss, 'These are the required trips');
        })
  }

exports.filtertripbynumberbus = (req , res)=>{
    const companyId = req.companies.companiesId;


    const startingId = req.body.startingid;
    const destinationId = req.body.destinationid;
    const numberbus = req.body.numberbus;
  
    const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
    const currentDate = moment().format('YYYY-MM-DD'); 
    
    trip
    .findAll({
        order: [['tripDate', 'ASC'], ['tripTime', 'ASC']],
      include: [
        
      
        {
          model: disk,
          attributes: ['numberdisk'],
          where: { status: true },
        },
        {
          model: bus,
          attributes: ['number'], 
          where:{companyId:companyId , number : numberbus},
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
      ],
      },
      attributes: {
        exclude: ['updatedAt', 'createdAt', 'busId', 'startingId', 'destinationId'],
      },
    }).then((trips) => {
        if(trips.length == 0){
            return res.error('not found any trips available by info which you are entered');
        }
        const tripss = trips.map((trip) => {
         
          const { duration ,numberdisksisFalse , timetrip , totalTime} = util.calculateTotalTime(trip)

               
              
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
                  numberdisksisFalse,
                }

              
            ;
      
        });
  
        res.success(tripss, 'These are the required trips');
      })
}

exports.getcustumers = (req , res )=>{

    const id = req.params.id;
    
        custumer.findAll({
            
            include:[
                {
                    model:disk , attributes:[ "numberdisk"],
                    where:{tripId:id}
                }
            ]
            
        }).then(custumers=>{
            if(custumers.length == 0){
                return res.error('not found any custumers in this trip' , 404)
            }
            const data = custumers.map((custumer) => {
                const { id ,fullname, disks } = custumer;
                const seatNumbersisreserved = disks.map((disk) => disk.numberdisk);
                return { id ,fullname, seatNumbersisreserved };
              });
              return res.success(data , 'this is all customers in this trip' )
            })
    

}

