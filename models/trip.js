const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const trip = sequelize.define('trip',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    tripDate: {
        type: Sequelize.DATEONLY,
        
      },
      tripTime: {
        type: Sequelize.TIME,
        
      },
    price:{
        type:Sequelize.FLOAT,
        allowNull:false,
    }
})

module.exports = trip;