const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const starting = sequelize.define('starting',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    name:Sequelize.STRING,
})

module.exports = starting;