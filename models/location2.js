const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const location2 = sequelize.define('location2',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    name:Sequelize.STRING,
})

module.exports = location2;