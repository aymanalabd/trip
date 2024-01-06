const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const driver = sequelize.define('driver',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    name:Sequelize.STRING
})

module.exports = driver;