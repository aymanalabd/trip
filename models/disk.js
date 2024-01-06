const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const disk = sequelize.define('disk',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
 
})

module.exports = disk;