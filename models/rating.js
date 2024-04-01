const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const rating = sequelize.define('rating',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    rating:Sequelize.FLOAT,
})

module.exports = rating;