


//models
const companies = require('../../../models/companies');
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const duration = require('../../../models/duration');





//اضافة حجز غي رحلة ما
exports.reservation = (req, res, next) => {
  const seats = req.body.seats;
  const id = req.params.id;

  trip.findOne({ where: { id: id } })
    .then(trip => {
      disk.findAll({ where: { tripId: trip.id, numberdisk: seats } })
        .then(foundSeats => {
          const reservedSeats = foundSeats.filter(seat => seat.status === false);
          if (reservedSeats.length > 0) {
            return res.error('One or more requested seats are unavailable. Please choose available seats.', 402);
          }

          const customerId = req.custumer.id;
          return disk.count({ where: { tripId: trip.id, custumerId: customerId } })
            .then(count => {
              // تحقق من عدد المقاعد المحجوزة للزبون
              const totalReservedSeats = count + seats.length;
              if (totalReservedSeats > 6) {
                return res.error('You cannot reserve more than 6 seats in the same trip.', 402);
              }

              const promises = foundSeats.map(seat => {
                return disk.update({ custumerId: customerId, status: false }, { where: { tripId: trip.id, numberdisk: seat.numberdisk } });
              });

              return Promise.all(promises)
                .then(() => {
                  return res.success({}, 'Reservation completed successfully.');
                })
                .catch(err => {
                  return res.error(err);
                });
            });
        });
    });
};

//جلب الحجوزات المدفوعة لزبون ما
exports.getreserveispaid = (req , res , next)=>{
            
    trip.findAll({
      include:[  
        {
          model: disk,
          attributes: [
            "numberdisk"
          ]  ,where:{ispaid:true, custumerId:req.custumer.id}         
          
        },
      {
          model: bus,
          attributes: ["number"],
          include:[
            {
              model:typebus,attributes:["type"]
            }
          ],
          include: [
            { model: companies, attributes: ["name"] },
            { model: typebus, attributes: ["type"] }
          ]
        } ,
      


      {
          model: duration,
          attributes: ["duration"],
        
          include: [
            {
              model: starting,
              attributes: [
                "name"
            ]
            },
            {
              model: destination,
              attributes: [
                "name"
            ]
            }
          ]
        
      }
    ],
     
    attributes: {
      exclude: ["updatedAt" , "createdAt" , "busId" , "startingId" , "destinationId"] 
    }
    })
      .then(trips => {
        
        const tripss = trips.map(trip => {
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
          const numberdisksispaid = trip.disks.map(disk => disk.numberdisk);
          return {
            id:trip.id,
            tripDate: trip.tripDate,
            tripTime: timetrip,
            price: trip.price,
            duration: duration,
              starting: trip.duration.starting.name,
              destination: trip.duration.destination.name,
            typebus:trip.bus.typebus.type,
            numberbus:trip.bus.number,              
            company:trip.bus.company.name,
            arrivalTime:totalTime,
              numberdisksispaid 
          }
        
        });

        if (tripss.length === 0) {
          return res.error("not found any seats that require payment.", 404);
        }
       
        res.success(tripss, "These are all your reservation which you are paid");
       
      })
      .catch(error => {
        res.error(error , 500); 
      });
    

}


// جلب الحجوزات الغير مدفوعة لزبون ما
exports.getreserveisnotpaid = (req , res , next)=>{
            
    trip.findAll({
      include:[  
        {
          model: disk,
          attributes: [
            "numberdisk"
          ]  ,where:{ispaid:false , custumerId:req.custumer.id}         
          
        },
      {
          model: bus,
          attributes: ["number"],
          include:[
            {
              model:typebus,attributes:["type"]
            }
          ],
          include: [
            { model: companies, attributes: ["name"] },
            { model: typebus, attributes: ["type"] }
          ]
        } ,
      


      {
          model: duration,
          attributes: ["duration"],
        
          include: [
            {
              model: starting,
              attributes: [
                "name"
            ]
            },
            {
              model: destination,
              attributes: [
                "name"
            ]
            }
          ]
        
      }
    ],
     
    attributes: {
      exclude: ["updatedAt" , "createdAt" , "busId" , "startingId" , "destinationId"] 
    }
    })
      .then(trips => {
        
        const tripss = trips.map(trip => {
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
          const numberdisksisnotpaid = trip.disks.map(disk => disk.numberdisk);
          return {
            id:trip.id,
            tripDate: trip.tripDate,
            tripTime: timetrip,
            price: trip.price,
            duration: duration,
              starting: trip.duration.starting.name,
              destination: trip.duration.destination.name,
            typebus:trip.bus.typebus.type,
            numberbus:trip.bus.number,              
            company:trip.bus.company.name,
            arrivalTime:totalTime,
              numberdisksisnotpaid
          };
        });
       
        res.success(tripss, "These are all reservation which you are not paid yet ");
      })
      .catch(error => {
        res.error(error , 500); 
      });
    

}

exports.cancelreserve = (req, res, next) => {
  const customerId = req.custumer.id;
  const idTrip = req.params.id;

  disk.update(
    {
      status: 1,
      custumerId: null
    },
    {
      where: {
        custumerId: customerId,
        tripId: idTrip
      }
    }
  )
  .then(() => {
    return res.success({}, 'Reservation canceled successfully');
  })
  .catch(error => {
return res.error(error) 
 });
};


