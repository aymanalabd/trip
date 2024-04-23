const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');
const custumer = require('./custumer');

const customerisnotpaid = sequelize.define('customerisnotpaid',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    companyId:{
        type:Sequelize.INTEGER,
    },
    numberbus:{
        type:Sequelize.INTEGER,
    },
    custumerId:{
        type:Sequelize.INTEGER,
    },
    tripDate:{
        type:Sequelize.DATEONLY,
    },
   
  
    
    
})

module.exports = customerisnotpaid;