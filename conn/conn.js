// const mysql = require('mysql');
// const con = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'mybalsam',
//     port:'3408'
// })

// con.connect(function(){
//     console.log('connected');

// })

// module.exports = con;

const Sequelize = require('sequelize');
const sequelize = new Sequelize('transport' , 'root' , '' , {
    dialect:'mysql',
    host:'localhost',
    port:'3408'

})
module.exports = sequelize;


