const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const trip = sequelize.define('trip',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    triptime:Sequelize.TIME,
    description:Sequelize.STRING
})

module.exports = trip;