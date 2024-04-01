const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const destination = sequelize.define('destination',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    name:Sequelize.STRING,
})

module.exports = destination;