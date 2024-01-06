const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const leftarrive = sequelize.define('leftarrive',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    }
  
})

module.exports = leftarrive;