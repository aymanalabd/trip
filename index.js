const config = require('dotenv').config();
const express = require('express');
const val = require('express-validator')
const bodyparser = require('body-parser')
const sequelize = require('./conn/conn');
const moment = require('moment')





//handle error
const response = require('./services/response');

//models
const companies = require('./models/companies');
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


const routeaddbus = require('./routes/admin/trip/addbus')








const app = express();

//handle error
app.use(response.response);

//json with postman
app.use(bodyparser.json());
app.use( bodyparser.urlencoded({extended:false}))


//use routes
app.use(routenot)
app.use(routedriver)
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





const cron = require('node-cron');


const canclereserveauto = ()=>{cron.schedule('0,30 * * * *', () => {
    // الكود الذي ترغب في تنفيذه هنا
    const currentTime = moment().format('HH:mm'); 
    const currentDate = moment().format('YYYY-MM-DD'); 
        trip
          .findAll({
            attributes: ["tripTime", "tripDate"],
            include: [
              {
                model: disk,
                    attributes: ["numberdisk", "id", "custumerId",
                ],
             
                where: { ispaid: false, status: false },
              },
              {
                model: bus,
                attributes: ["id", "companyId", "number"],
              },
            ],
          })
          .then((trips) => {
            if (trips.length === 0) {
              console.error("No upcoming trips with unpaid reservations found");
              return;
            }
      
            const tripsToCancel = trips.filter((trip) => {
              const cutoffTimeMoment = moment(trip.tripTime, "HH:mm").subtract(30, "minutes");
              const cutoffTimeString = cutoffTimeMoment.format("HH:mm");
              return trip.tripDate === currentDate && cutoffTimeString <= currentTime;
            });
      
            if (tripsToCancel.length === 0) {
              console.log("No upcoming trips to cancel reservations for");
              return;
            }
      
            const diskIdsToUpdate = tripsToCancel.reduce((acc, trip) => {
              const tripDisks = trip.disks.map((disk) => {
                return {
                  id: disk.id,
                  custumerId: disk.custumerId,
                  countSeats:disk.diskCount
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
                customersIsNotPaid.findOne({
                  where: {
                    companyId: company.companyId,
                    tripDate: company.tripDate,
                    custumerId: company.custumerId,
                    numberbus: company.numberbus,
                  },
                })
                  .then((existingRecord) => {
                    if (!existingRecord ) {
                      customersIsNotPaid.create({
                        companyId: company.companyId,
                        tripDate: company.tripDate,
                        custumerId: company.custumerId,
                        numberbus: company.numberbus,
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
              .update(
                { ispaid: false, status: true, custumerId: null },
                { where: { id: diskIdsToUpdate.map((disk) => disk.id) } }
              )
              .then(() => {
                console.log("Successfully canceled reservations for upcoming trips before 30 minutes");
              })
              .catch((err) => {
                console.error(err.message);
              });
          });
      
})}
canclereserveauto();



//RELATIONS

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
