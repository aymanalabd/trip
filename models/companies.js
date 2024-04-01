const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const companies = sequelize.define('companies',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    // orgname:Sequelize.STRING,
    // description:Sequelize.STRING,
})

module.exports = companies;