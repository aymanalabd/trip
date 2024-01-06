// const con = require('../conn/conn');
// const {validationResult} = require('express-validator')

// exports.getrequest = (req, res, next) => {
//     con.query('select * from request', function (err, result) {
//         if (err) throw err;
//         res.status(200).json({
//             msg: 'fetched requests',
//             requests: result
//         })
//     })
// }

// exports.applyreq = (req, res, next) => {
  
//     const  id = req.body.id;
//     const apply =req.body.apply;
//     const city = req.body.city;
//     const reason = req.body.reason;
//     const natnumber = req.body.natnumber;
//     const nfamily = req.body.nfamily;
//     const phone = req.body.phone;
//     const service = req.body.service;
//     const date =req.body.date;
//     const details = req.body.details;
//     const resolution = req.body.resolution;
//     con.query("select * from request where Applicant=?" ,[apply] ,(err , result)=>{
//         if(result.length>0){
//             res.json({msg : 'this apply registered '});
//             }else{
//                 con.query
//                 ("insert into request( Applicant , City , Reason , National_Number,Number_Of_Family,Number_Phone,	Service_Type,Order_Date,Details ,resolution)values (? , ?,?,?,?,?,?,?,?,?) ", [apply,city,reason,natnumber,nfamily,phone
//                     ,service,date,details,resolution
//                     ], function(err , result){
                        
//                    if(err){
//                     res.json({msg : 'error is occured'})
//                    }
//                     res.json({msg:'created request' , result})
//                 })
//             }
    
   
//         }
//     )
 
   

   
  
// }

const request = require('../models/request')

exports.createre=(req , res , next)=>{
    const name = req.body.name;
    const phone = req.body.phone;
    const num = req.body.num;
    console.log(name , phone )
    request.create({
        firstname : name,
        phone:phone,
        numf:num
    })
}
exports.getreq = (req , res , next)=>{
    request.findAll().then(result=>{
        res.json({msg : 'fetched all' , result:result})
    })
}
