
const bodyparser = require('body-parser')
const sequelize = require('./conn/conn');
const moment = require('moment')
const {admin} =  require('./controller/notification/index')






//handle error
const response = require('./services/response');

//models
const companies = require('./models/companies');
const notification = require('./routes/notification/routenot')
const custumer = require('./models/custumer');
const rating = require('./models/rating');
const bus = require('./models/bus');
const disk = require('./models/disk');
const isBlock = require('./models/isBlock');
const driver = require('./models/driver');
const duration = require('./models/duration');
const starting = require('./models/starting');
const destination = require('./models/destination');
const typebus = require('./models/typebus');
const trip = require('./models/trip');
const custumerbyadmin = require('./models/custumerbyadmin');

const customersIsNotPaid = require('./models//customersIsNotPaid');






 
//routers require
const routeorg = require('./routes/admin/authentication/companies');
const routecus = require('./routes/user/authentication/custumer');
const routedrive = require('./routes/admin/drivers/login');
const routesearchandfilter = require('./routes/user/trip/searchandFilter')
const routereservation = require('./routes/user/trip/reservation')
const routetripadmin = require('./routes/admin/trip/addtrip')
const routereserveauto = require('./routes/admin/trip/reservation')
const routegettripadmin = require('./routes/admin/trip/gettrips')
const routetrating = require('./routes/user/trip/rating')
const routenot = require('./routes/notification/routenot')
const routegetcus = require('./routes/admin/customers/getcustumers')
const routeblock = require('./routes/admin/customers/block')
const routedriver = require('./routes/admin/drivers/adddriver')
const routeinfodriver = require('./routes/admin/drivers/getinfodriver')
const routeaddbus = require('./routes/admin/trip/addbus')





const app = require('express')();
const serverAdmin = require('http').createServer(app);
const serverDriver = require('http').createServer(app);

const ioAdmin = require('socket.io')(serverAdmin, {
  cors: {
    origin: "*"
  }
});

const ioDriver = require('socket.io')(serverDriver, {
  cors: {
    origin: "*"
  }
});

const adminCoordinates = {};
const driversCoordinates = {};

ioAdmin.on('connection', (socket) => {
  console.log('Admin connected successfully');

  socket.on('adminSelectDriver', (id) => {
     
      if (driversCoordinates[id]) {
        const { longitude, latitude } = driversCoordinates[id];
        ioAdmin.emit('adminCoordinates', { latitude, longitude });
      } else {
        console.log(`Driver ID: ${id} is not currently connected.`);
      }
   
  });

  socket.on('disconnect', () => {
    console.log('Admin disconnected');
  });
});

ioDriver.on('connection', (socket) => {
  console.log('Driver connected successfully');

  socket.on('driverCoordinates', (data) => {
    
    parsedData = JSON.parse(data);
    console.log(parsedData)
    
    const { longitude, latitude } = parsedData;
    driversCoordinates[parsedData.id] = { longitude, latitude };
  });
  socket.on('disconnect', () => {
    console.log('Driver disconnected');

   
  });
});

serverAdmin.listen(3000, () => {
  console.log('Admin server is running on port 3000');
});

serverDriver.listen(3001, () => {
  console.log('Driver server is running on port 3001');
});
//handle error
app.use(response.response);

//json with postman
app.use(bodyparser.json());
app.use( bodyparser.urlencoded({extended:false}))







//use routes
app.use(notification)
app.use(routenot)
app.use(routedriver)
app.use(routedrive)
app.use(routetrating)
app.use(routeorg);
app.use(routesearchandfilter);
app.use(routereservation);
app.use(routetripadmin);
app.use(routegettripadmin);
app.use(routecus)
app.use(routegetcus)
app.use(routeaddbus)
app.use(routeblock)
app.use(routereserveauto)
app.use(routeinfodriver)






const cron = require('node-cron');
const axios = require('axios');




const addtripauto = () => {
  cron.schedule('0 0 * * *', () => { // تنفيذ الكود كل 24 ساعة في الساعة 00:00

    trip.findAll({ where: { isRecurring: true } }).then((trips) => {
      console.log(trips)
        trips.forEach(async (tripss) => {
          tripss.update({
            isRecurring:false
          })
          const newDate = new Date(tripss.tripDate);
          newDate.setDate(newDate.getDate() + 1);
          const tripDate = newDate.toISOString().slice(0, 10); // زيادة يوم واحد على تاريخ الرحلة
              
          bus.findOne({
            where: { id: tripss.busId },
           
          })
            .then(async (bus) => {
                const newTrip = await trip.create({
                tripDate: tripDate,
                tripTime: tripss.tripTime,
                busId: tripss.busId,
                price:tripss.price,
                durationId: tripss.durationId,
                isRecurring: true,
              });

              const disks = [];
              for (let i = 1; i <= bus.numofdisk; i++) {
                disks.push({
                  numberdisk: i,
                  status: true,
                  tripId: newTrip.id,
                  ispaid: false,
                });
              }

              await disk.bulkCreate(disks);
         
            });
          })
        });
      });
    }

addtripauto();





const canclereserveauto = () => {
  cron.schedule('* * * * *', () => {
    const currentTime = moment().format('HH:mm');
    const currentDate = moment().format('YYYY-MM-DD');

    trip
      .findAll({
        attributes: ['tripTime', 'tripDate'],
        include: [
          {
            model: disk,
            attributes: ['numberdisk', 'id', 'custumerId'],
            where: { ispaid: false, status: false },
          },
          {
            model: bus,
            attributes: ['id', 'companyId', 'number'],
          },
        ],
      })
      .then((trips) => {
        if (trips.length === 0) {
          console.error('No upcoming trips with unpaid reservations found');
          return;
        }

        const tripsToCancel = trips.filter((trip) => {
          const cutoffTimeMoment = moment(trip.tripTime, 'HH:mm').subtract(30, 'minutes');
          const cutoffTimeString = cutoffTimeMoment.format('HH:mm');
          return trip.tripDate === currentDate && cutoffTimeString <= currentTime;
        });

        if (tripsToCancel.length === 0) {
          console.log('No upcoming trips to cancel reservations for');
          return;
        }

        const diskIdsToUpdate = tripsToCancel.reduce((acc, trip) => {
          const tripDisks = trip.disks.map((disk) => {
            return {
              id: disk.id,
              custumerId: disk.custumerId,
              countSeats: disk.diskCount,
            };
          });
          acc.push(...tripDisks);
          return acc;
        }, []);

        const customersToAdd = Array.from(new Set(diskIdsToUpdate.map((disk) => disk.custumerId)));

        customersToAdd.forEach((customerId) => {
          const companyToAdd = tripsToCancel
            .filter((trip) => {
              return trip.disks.some((disk) => disk.custumerId === customerId);
            })
            .map((trip) => {
              return {
                companyId: trip.bus.companyId,
                tripDate: trip.tripDate,
                custumerId: customerId,
                numberbus: trip.bus.number,
              };
            });

          // Check if the record already exists in the `customersIsNotPaid` table
          companyToAdd.forEach((company) => {
            customersIsNotPaid
              .findOne({
                where: {
                  companyId: company.companyId,
                  tripDate: company.tripDate,
                  custumerId: company.custumerId,
                  numberbus: company.numberbus,
                },
              })
              .then((existingRecord) => {
                if (!existingRecord) {
                  customersIsNotPaid.create({
                    companyId: company.companyId,
                    tripDate: company.tripDate,
                    custumerId: company.custumerId,
                    numberbus: company.numberbus,
                  }).then(() => {
                    // Send notification to the customer
                    custumer.findByPk(customerId).then(user => {
                      const fcmToken = user.fcmToken;
                      companies.findByPk(company.companyId).then(company => {
                        const message = {
                          token: fcmToken,
                          notification: {
                            title: 'Payment Reminder',
                            body: `Your reservation at ${company.name} has been canceled because you did not confirm it half an hour before the start of the trip.`,
                          },
                        };

                        return admin.messaging().send(message);
                      });
                    });
                  });
                }
              })
              .catch((err) => {
                console.error(err.message);
              });
          });
        });

        // Update the disks
        disk
          .update({ ispaid: false, status: true, custumerId: null }, { where: { id: diskIdsToUpdate.map((disk) => disk.id) } })
          .then(() => {
            console.log('Successfully canceled reservations for upcoming trips before 30 minutes');
          })
          .catch((err) => {
            console.error(err.message);
          });
      });
  });
};

canclereserveauto();



//RELATIONS between tables

//العلاقة بين الباص والرحلة
bus.hasMany(trip);
trip.belongsTo(bus);

//العلاقة بين السائق والباص
driver.hasMany(bus);
bus.belongsTo(driver);


//العلاقة بين الشركة والباص
companies.hasMany(bus);
bus.belongsTo(companies);



























//العلاقة بين الرحلة والمحافظة
duration.hasMany(trip);
trip.belongsTo(duration);


//التقييم 
trip.hasMany(rating);
rating.belongsTo(trip);

custumer.hasMany(rating);
rating.belongsTo(custumer)


companies.hasMany(isBlock);
isBlock.belongsTo(companies);
custumer.hasMany(isBlock);
isBlock.belongsTo(custumer);



companies.hasMany(custumerbyadmin);
custumerbyadmin.belongsTo(companies);

custumerbyadmin.hasMany(disk);
disk.belongsTo(custumerbyadmin)


//العلاقة بين الباص ونوعه
typebus.hasMany(bus);
bus.belongsTo(typebus);


trip.hasMany(disk);
disk.belongsTo(trip);


custumer.hasMany(disk);
disk.belongsTo(custumer);

companies.hasMany(driver);
driver.belongsTo(companies);

driver.hasMany(bus);
bus.belongsTo(driver)

destination.hasMany(duration);
duration.belongsTo(destination)


starting.hasMany(duration);
duration.belongsTo(starting)

sequelize.sync().then(result=>{
    app.listen(process.env.PORT)
}).catch(err=>{
    console.log(err)
})
