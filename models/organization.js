const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const organization = sequelize.define('organization',{
    // id:{
    //     type:Sequelize.INTEGER,
    //     allowNull:false,
    //     primaryKey:true,
    //     autoIncrement:true
    // },
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

module.exports = organization;