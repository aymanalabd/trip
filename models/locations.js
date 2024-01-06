const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const locations = sequelize.define('locations',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    name:Sequelize.STRING,
})

module.exports = locations;