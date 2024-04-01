const config = require('dotenv').config();
const express = require('express');
const val = require('express-validator')
const bodyparser = require('body-parser')
const sequelize = require('./conn/conn');

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




 
//routers require
const routeorg = require('./routes/admin/authentication/companies');
const routecus = require('./routes/user/authentication/custumer');
const routesearchandfilter = require('./routes/user/trip/searchandFilter')
const routereservation = require('./routes/user/trip/reservation')
const routetripadmin = require('./routes/admin/trip/addtrip')
const routegettripadmin = require('./routes/admin/trip/gettrips')
const routetrating = require('./routes/user/trip/rating')
const routenot = require('./routes/notification/routenot')







const app = express();

//handle error
app.use(response.response);

//json with postman
app.use(bodyparser.json());
app.use( bodyparser.urlencoded({extended:false}))


//use routes
app.use(routenot)
app.use(routetrating)
app.use(routeorg);
app.use(routesearchandfilter);
app.use(routereservation);
app.use(routetripadmin);
app.use(routegettripadmin);
app.use(routecus)




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


//العلاقة بين الباص ونوعه
typebus.hasMany(bus);
bus.belongsTo(typebus);


trip.hasMany(disk);
disk.belongsTo(trip);


custumer.hasMany(disk);
disk.belongsTo(custumer);


destination.hasMany(duration);
duration.belongsTo(destination)


starting.hasMany(duration);
duration.belongsTo(starting)

sequelize.sync().then(result=>{
    app.listen(process.env.PORT)
}).catch(err=>{
    console.log(err)
})
