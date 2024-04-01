const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const duration = sequelize.define('duration',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    duration:{
        type:Sequelize.TIME,
        allowNull:false,
    }

})

module.exports = duration;