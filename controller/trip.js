//models
const jwt = require('jsonwebtoken')

const organization = require('../models/organization');
const custumer = require('../models/custumer');
const bus = require('../models/bus');
const price = require('../models/price');
const driver = require('../models/driver');
const reservation = require('../models/reservation');
const locations = require('../models/locations');
const location2 = require('../models/location2');

const leftarrive = require('../models/leftarrive');
const trip = require('../models/trip');
const { where, Sequelize } = require('sequelize');
exports.addtrip = (req , res , next)=>{
    const { time , desc} = req.body;
    const busid = req.body.busid;
    const priceid = req.body.priceid;
    const driverid = req.body.driverid;
    const leftarriveid = req.body.leftarriveid;
        trip.create({
        triptime:time,
        busId:busid,
        driverId:driverid,
        priceId:priceid,
        leftarriveId:leftarriveid
        })
    
    
}

exports.getinfotrip = (req , res ,next)=>{
    const id  = req.params.id;
    trip.findOne({include:[{model:leftarrive,include:[{model:locations , attributes:["name"]} , {model:location2}]},{model:price},{model:bus}]},{where:{id:id}}).then(info=>{
        res.json(info)
    }).catch(err=>{
        res.json(err)
    })
}



exports.getall = (req , res  ,next)=>{
   
    trip.findAll({include:[{model:bus,where:{organizationId:req.orgid},attributes:[]}]}).then(r=>{
        
        res.json(r)
    })
}

exports.updatetrip =async (req , res , next)=>{
    const id = req.params.id;
   orgtrip.findOne({where:{tripId:id}}).then(r=>{
    if(r.organizationId===req.orgid){
       trip.update(req.body , {where:{id:id}}).then(rr=>{
        res.json({msg:rr})
       })
        
    }else{
        res.json({msg:'cannot updated this trip because this trip to other company'})
    }
   })
       
  

    
 
}