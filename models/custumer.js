const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const custumer = sequelize.define('custumer',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    // firstname:{
    //     type:Sequelize.STRING,
    //     allowNull:false,
        
    // },
    // father:{
    //     type:Sequelize.STRING,
    //     allowNull:false,
        
    // },
    // mather:{
    //     type:Sequelize.STRING,
    //     allowNull:false,
        
    // },

    // lastname:{
    //     type:Sequelize.STRING,
    //     allowNull:false,
        
    // },
    // localnumber:{
    //     type:Sequelize.INTEGER,
    //     allowNull:false,
        
    // },
    cusemail:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
   
    // isadmin:Sequelize.BOOLEAN
})

module.exports = custumer;