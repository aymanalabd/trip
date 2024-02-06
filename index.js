//models
const organization = require('./models/organization');
const custumer = require('./models/custumer');
const bus = require('./models/bus');
const disk = require('./models/disk');
const price = require('./models/price');
const driver = require('./models/driver');
const reservation = require('./models/reservation');
const locations = require('./models/locations');
const location2 = require('./models/location2');

const leftarrive = require('./models/leftarrive');





 
//routers
const routeorg = require('./routes/organization');
const routecus = require('./routes/custumer');
const routetrip = require('./routes/trip')


const express = require('express');
const val = require('express-validator')
const bodyparser = require('body-parser')

const sequelize = require('./conn/conn');
const trip = require('./models/trip');
const response = require('./services/response');
const app = express();


app.use(response.response);
app.use(bodyparser.json());
app.use( bodyparser.urlencoded({extended:false}))

app.use(routeorg);
app.use(routetrip)
app.use(routecus)

app.use((err, req, res, next) => {
    if (! err) {
        return next();
    }

    res.status(500).json(err.message);
    
});



bus.hasMany(trip);
trip.belongsTo(bus);

driver.hasMany(bus);
bus.belongsTo(driver);


price.hasMany(trip);
trip.belongsTo(price);



//العلاقة بين الشركة والرحلة ونوعها وربطهم بجدول شركة،رحلة_نوع
organization.hasMany(bus);
bus.belongsTo(organization);

//العلاقة بين الزبون وشركة_رحلة_انطلاق_وجهة وربطهم بجدول الحجز
trip.belongsToMany(custumer,{through:reservation});
custumer.belongsToMany(trip,{through:reservation});

reservation.hasMany(disk);
disk.belongsTo(reservation);
//العلافة بين الانطلاق والوجهة وربطهم بجدول انطلاق-وجهة
locations.hasMany(leftarrive);
leftarrive.belongsTo(locations)
location2.hasMany(leftarrive);
leftarrive.belongsTo(location2)

leftarrive.hasMany(trip);
trip.belongsTo(leftarrive)







sequelize.sync(/*{force:true}*/).then(result=>{
    app.listen(8000)
}).catch(err=>{
    console.log(err)
})
