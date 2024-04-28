const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const driver = sequelize.define('driver',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    }, 
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    confirmpassword:{
        type:Sequelize.STRING,
        allowNull:false,
    },
  
    phone:Sequelize.STRING,
    fullname:Sequelize.STRING
})

module.exports = driver;