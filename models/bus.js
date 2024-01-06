const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const bus = sequelize.define('bus',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    color:Sequelize.INTEGER,
    icon:Sequelize.STRING,
    
})

module.exports = bus;