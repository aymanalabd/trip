const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const price = sequelize.define('price',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
  
    
    price:Sequelize.DOUBLE
})

module.exports = price;