const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const custumerbyadmin = sequelize.define('custumerbyadmin',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    fullname:{
        type:Sequelize.STRING,
        allowNull:false,
},


    
 
})

module.exports = custumerbyadmin;