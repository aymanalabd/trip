const Sequelize = require('sequelize');

const sequelize = require('../conn/conn');

const disk = sequelize.define('disk',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    numberdisk: Sequelize.INTEGER,
    status: {
       type: Sequelize.BOOLEAN,
       default:true
    },
    ispaid: {
        type: Sequelize.BOOLEAN,
        default:true
     }
    

 
})

module.exports = disk;