const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const reservation = sequelize.define('reservation',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    }
  
  
})

module.exports = reservation;