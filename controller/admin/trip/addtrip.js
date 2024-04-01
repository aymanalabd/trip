



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
const moment = require('moment')



//for admin
exports.addtrip = (req , res)=>{
    const tripDate  = req.body.tripDate;
    const tripTime  = req.body.tripTime;
    const price = req.body.price;
    const busid = req.body.busid;
    const starting = req.body.starting;
    const destination = req.body.destination;

    bus.findOne({
        where: { id: busid },
        include: [
          {
            model: typebus,
            attributes: ["ratio"],
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
            price: price * bus.typebus.ratio,
            durationId: startleft.id,
          });
      
          const disks = [];
          for (let i = 1; i <= bus.numofdisk; i++) {
            disks.push({
              numberdisk: i,
              status: true,
              tripId: newTrip.id,
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
    const triptime = req.body.tripTime;
    const currentTime = moment().format('HH:mm'); // الوقت الحالي في صيغة ساعة:دقيقة
    const currentDate = moment().format('YYYY-MM-DD'); // التاريخ الحالي في صيغة سنة-شهر-يوم
 

  //اذا كان التاريخ المدخل اصغر من تاريخ الوقت الحالي ارجع رسالة خطا
    if (tripDate < currentDate) {
      return res.error(' this date is old' ,  402);
    }else{
      if(tripDate == currentDate && triptime < currentTime){
        return res.error(' this time is old' ,  402);

      }
    } 
    
  
  bus
    .findAll({
      
      include:[
        {
          model:typebus , attributes:["type"]
        },
            {
              model:trip,
              include:[
                {
                  model:duration,attributes:["duration"],
                  include:[
                    {
                      model:starting , attributes:["name"]
                    },
                    {
                      model:destination , attributes:["name"]
                    }
                  ]
                }
              ],where:{ tripDate:tripDate}
            }
          ],
          where:{companyId:req.companies.companiesId}
    })
    .then((buses) => {
      let isBusAvailable = false;
      const availableBuses = buses.filter(bus => {
        
        
        for (const trip of bus.trips) {

          const startTime = trip.tripTime;
          const endTime = trip.duration.duration;
       


          const startHours = parseInt(startTime.split(':')[0]);
          const startMinutes = parseInt(startTime.split(':')[1]);
          const durationHours = parseInt(endTime.split(':')[0]);
          const durationMinutes = parseInt(endTime.split(':')[1]);
          const totalMinutes = startMinutes + durationMinutes;
          const totalHours = startHours + durationHours + Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const totalTime = `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

          const startHourss = parseInt(triptime.split(':')[0]);
          const startMinutess = parseInt(triptime.split(':')[1]);
          const totalTimes = `${startHourss.toString().padStart(2, '0')}:${startMinutess.toString().padStart(2, '0')}`;
          if (totalTimes <= totalTime) {
            return false // الباص متاح
          }
          isBusAvailable = true;
        }
        return true; // الباص غير متاح
      });
 
const busNumbers = availableBuses.map((bus) => ({
          id:bus.id,
          number: bus.number,
          type: bus.typebus.type,
          destination:bus.trips[0].duration.destination.name
        }));
if (isBusAvailable) {
        // تنفيذ الإجراءات إذا كان الباص متاحًا
        res.success(busNumbers);
      } else {
        // إجراءات إذا كان الباص غير متاح
        res.success({});
      }
     })
    .catch((err) => {
      res.error(err, 500);
    });
};
