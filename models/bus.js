const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const bus = sequelize.define('bus',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    number:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    numofdisk:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    place:{
        type:Sequelize.STRING,
    }
   
  
        
})

module.exports = bus;