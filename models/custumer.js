const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const custumer = sequelize.define('custumer',{
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


    cusemail:{
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
    fcmToken:{
        type:Sequelize.STRING,
    },
    verificationCode: Sequelize.INTEGER
    ,
    activeUser:Sequelize.BOOLEAN
   
    // isadmin:Sequelize.BOOLEAN
})

module.exports = custumer;