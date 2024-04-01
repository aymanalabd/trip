const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const isBlock = sequelize.define('isBlock',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    isblock:Sequelize.BOOLEAN,
  

})

module.exports = isBlock;