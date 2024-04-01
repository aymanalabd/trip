const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const typebus = sequelize.define('typebus',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ratio:{
        type:Sequelize.FLOAT,
        allowNull:false,
    },
  
    
   
})

module.exports = typebus;