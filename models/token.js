const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const Token = sequelize.define('token',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false, 
        primaryKey:true,
        autoIncrement:true
    },
    token: Sequelize.TEXT,
    expireDate:Sequelize.DATE
 
})

module.exports = Token;