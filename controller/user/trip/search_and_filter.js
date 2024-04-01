

//models
const companies = require('../../../models/companies');
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const  sequelize = require('sequelize');
const duration = require('../../../models/duration');
const rating = require('../../../models/rating'); 
const custumer = require('../../../models/custumer')
const isBlock = require('../../../models/isBlock')
const util = require('../../../util/helper');
const { Op } = require('sequelize');
  const moment = require('moment');





//جلب المدن
exports.getcities =(req,res)=>{
    starting.findAll({attributes: {
      exclude: ["updatedAt" , "createdAt"] 
    }}).then(result=>{
    return res.success(result,"this is all cities")
    }).catch(err=>{
    return res.error(err,500)
    })
    }
  

    //جلب جميع الشركات
    exports.getcompanies =(req,res)=>{
      companies.findAll({attributes: {
        exclude: ["updatedAt" , "createdAt" , "email" , "password"] 
      }}).then(result=>{
        
      return res.success(result,"this is all companies")
      }).catch(err=>{
      return res.error(err,500)
      })
      }

      //جلب انواع الباصات
      exports.gettypebus =(req,res)=>{
        typebus.findAll({attributes: {
          exclude: ["updatedAt" , "createdAt" , "ratio"] 
        }}).then(result=>{
          
        return res.success(result,"this is all types")
        }).catch(err=>{
        return res.error(err,500)
        })
        }
    
  
  
  //البحث عن رحلات عن طريق التاريخ ومكان الانطلاق والوصول
  exports.search = (req, res) => {
 console.log(req.custumer)
    isBlock.findAll({
      where:{custumerId:req.custumer.id , isBlock:false}
    }).then(custumer=>{
    const company =  custumer.map(company=>company.companyId)
   return company
    }).then(isblock=>{
      console.log(isblock)
      rating.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('rating')), 'totalRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'count'],
        ],
        include: [
          {
            model: trip,
            include: [
              {
                model: bus,attributes:["id"],
                include: [
                  {
                    model: companies,attributes:["name"]
                  },
                ],
              },
            ],
          },
        ],
        group: ['trip.bus.company.name'],
      })
        .then((results) => {
        const rr =  results.map(r=>{
    
           return {
           rating: r.dataValues.totalRating,
           companies : r.trip.bus.company.name,
           count:r.dataValues.count
           
           }
          // يمكنك التعامل مع نتائج الاستعلام هنا
        })
        return rr
      }).then(rate=>{
        console.log(rate)
        const startingId = req.body.startingid;
        const destinationId = req.body.destinationid;
        const date = req.body.date;
      
        const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
        const currentDate = moment().format('YYYY-MM-DD'); // التاريخ الحالي في صيغة سنة-شهر-يوم
    
        trip
          .findAll({
            order: [[sequelize.literal('DATE_FORMAT(tripTime, "%H:%i")'), 'ASC']],
            include: [
            
              {
                model: disk,
                attributes: ['numberdisk'],
                where: { status: true },
              },
              {
                model: bus,
                attributes: ['number'],
                where:{companyId: {[Op.notIn]: isblock}},
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
              tripDate: date, // التاريخ المحدد فقط
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
          })
          .then((trips) => {
            if(trips.length == 0){
              return res.error('not found any trips by informaton which you are entered ' , 404)
            }
            const tripss = trips.map((trip) => {
             
              const { duration ,numberdisksisFalse , timetrip , totalTime} = util.calculateTotalTime(trip)
    
              const companyRating = rate.find(
                (rating) => rating.companies === trip.bus.company.name
              );
    
              const ratingValue =
              companyRating && companyRating.count > 0
                ? companyRating.rating / companyRating.count
                : 0;       
                  
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
                      rating: ratingValue,
                     countRating:companyRating.count,
                      numberdisksisFalse,
                    }
    
                  
                ;
          
            });
      
            res.success(tripss, 'These are the required trips');
          })
          .catch((error) => {
            res.error(error, 500);
          });
    
        
      })
        .catch((error) => {
          console.error(error);
          // يمكنك التعامل مع الأخطاء هنا
        });
      
      

    })
   

   
  };
    //فلترة الرحلات عن طريق الشركة
      exports.filterbycompany = (req, res) => {
        console.log(req.custumer) 
          const companyid = parseInt(req.body.companyid);
          isBlock.findAll({
            where:{custumerId:req.custumer.id , isBlock:false}
          }).then(custumer=>{
          const company =  custumer.map(company=>company.companyId)
         return company
          }).then(isblock=>{
            if (isblock.includes(parseInt(companyid , 10))) {
              res.error('The company has blocked you', 403);
              return;
            }
          rating.findAll({
            attributes: [
              [sequelize.fn('SUM', sequelize.col('rating')), 'totalRating'],
              [sequelize.fn('COUNT', sequelize.col('rating')), 'count'],
            ],
            include: [
              {
                model: trip,
                include: [
                  {
                    model: bus,attributes:["id"],
                    include: [
                      {
                        model: companies,attributes:["name"]
                      },
                    ],
                  },
                ],
              },
            ],
            group: ['trip.bus.company.name'],
          })
            .then((results) => {
            const rr =  results.map(r=>{
        
               return {
               rating: r.dataValues.totalRating,
               companies : r.trip.bus.company.name,
               count:r.dataValues.count
               
               }
              // يمكنك التعامل مع نتائج الاستعلام هنا
            })
            return rr
          }).then(rate=>{
            console.log(rate)
            const startingId = req.body.startingid;
            const destinationId = req.body.destinationid;
            const date = req.body.date;
          
            const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
            const currentDate = moment().format('YYYY-MM-DD'); // التاريخ الحالي في صيغة سنة-شهر-يوم
        
            trip
              .findAll({
                order: [[sequelize.literal('DATE_FORMAT(tripTime, "%H:%i")'), 'ASC']],
                include: [
                
                  {
                    model: disk,
                    attributes: ['numberdisk'],
                    where: { status: true },
                  },
                  {
                    model: bus,
                    attributes: ['number'],
                    where: {
                      companyId: companyid,
                    },
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
                  tripDate: date, // التاريخ المحدد فقط
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
              })
              .then((trips) => {
                if(trips.length == 0){
                  return res.error('not found any trip in this company' , 404)
                }
                const tripss = trips.map((trip) => {
                 
                  const { duration ,numberdisksisFalse , timetrip , totalTime} = util.calculateTotalTime(trip)
        
                  const companyRating = rate.find(
                    (rating) => rating.companies === trip.bus.company.name
                  );
        
                  const ratingValue =
                  companyRating && companyRating.count > 0
                    ? companyRating.rating / companyRating.count
                    : 0;       
                      
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
                          rating: ratingValue,
                         countRating:companyRating.count,
                          numberdisksisFalse,
                        }
        
                      
                    ;
              
                });
               
                res.success(tripss, 'These are the required trips');
              })
              .catch((error) => {
                res.error(error, 500);
              });
        
            
          })
            .catch((error) => {
              console.error(error);
              // يمكنك التعامل مع الأخطاء هنا
            });
          })
          
        }
  
  
  //فلترة الرحلات عن طريق نوع الباص
        exports.filterbytypebus = (req, res) => {
          const typebusid = req.body.typebusid;
          isBlock.findAll({
            where:{custumerId:req.custumer.id , isBlock:false}
          }).then(custumer=>{
          const company =  custumer.map(company=>company.companyId)
         return company
          }).then(isblock=>{
          rating.findAll({
            attributes: [
              [sequelize.fn('SUM', sequelize.col('rating')), 'totalRating'],
              [sequelize.fn('COUNT', sequelize.col('rating')), 'count'],
            ],
            include: [
              {
                model: trip,
                include: [
                  {
                    model: bus,attributes:["id"],
                    include: [
                      {
                        model: companies,attributes:["name"]
                      },
                    ],
                  },
                ],
              },
            ],
            group: ['trip.bus.company.name'],
          })
            .then((results) => {
            const rr =  results.map(r=>{
        
               return {
               rating: r.dataValues.totalRating,
               companies : r.trip.bus.company.name,
               count:r.dataValues.count
               
               }
              // يمكنك التعامل مع نتائج الاستعلام هنا
            })
            return rr
          }).then(rate=>{
            console.log(rate)
            const startingId = req.body.startingid;
            const destinationId = req.body.destinationid;
            const date = req.body.date;
          
            const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
            const currentDate = moment().format('YYYY-MM-DD'); // التاريخ الحالي في صيغة سنة-شهر-يوم
        
            trip
              .findAll({
                order: [[sequelize.literal('DATE_FORMAT(tripTime, "%H:%i")'), 'ASC']],
                include: [
                
                  {
                    model: disk,
                    attributes: ['numberdisk'],
                    where: { status: true },
                  },
                  {
                    model: bus,
                    where:{typebusId:typebusid},
                    attributes: ['number'],
                    include: [
                      { model: typebus, attributes: ['type'] },
                      { model: companies, attributes: ['id','name'] },
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
                  tripDate: date, // التاريخ المحدد فقط
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
              })
              .then((trips) => {
                if(trips.length == 0){
                  return res.error('not found any trips by informaton which you are entered ' , 404)
                }
                const filteredTrips = trips.filter(trip => {
                  const company = trip.bus.company;
                  const isBlocked = isblock.includes(company.id);
                  return !isBlocked;
                });
                const tripss = filteredTrips.map((trip) => {
                  
                  
                 
                  const { duration ,numberdisksisFalse , timetrip , totalTime} = util.calculateTotalTime(trip)
        
                  const companyRating = rate.find(
                    (rating) => rating.companies === trip.bus.company.name
                  );
        
                  const ratingValue =
                  companyRating && companyRating.count > 0
                    ? companyRating.rating / companyRating.count
                    : 0;       
                      
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
                          rating: ratingValue,
                         countRating:companyRating.count,
                          numberdisksisFalse,
                        }
        
                      
                    ;
              
                });
          
                res.success(tripss, 'These are the required trips');
              })
              .catch((error) => {
                res.error(error, 500);
              });
        
            
          })
            .catch((error) => {
              console.error(error);
              // يمكنك التعامل مع الأخطاء هنا
            });
          })
          
        }


    