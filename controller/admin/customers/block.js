const companies = require('../../../models/companies');
const moment = require('moment')
const util = require('../../../util/helper');
const { Op } = require('sequelize');  
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');
const starting = require('../../../models/starting');
const destination = require('../../../models/destination');
const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const  sequelize = require('sequelize');
const duration = require('../../../models/duration');
const custumer = require('../../../models/custumer');
const isBlock = require('../../../models/isBlock');


exports.block = (req , res)=>{
    const id = req.params.id;
    const companiesId = req.companies.companiesId;
    isBlock.findOne({where:{custumerId:id , companyId:companiesId}}).then(user=>{
        if(user && user.isblock == false){
            return res.error('this user is blocked already' , 403)
        }else if(user && user.isblock == true){
            isBlock.update({
                companyId:companiesId,
                custumerId:id,
                isblock:false,   
            }
             ,
            {
                where:{
                    custumerId:id,
                    companyId:companiesId
                }
                }).then(()=>{
                    return res.success({} , 'completed  blocked this user successfully')
                }).catch(err=>{
                    res.error(err , 500);
                })
        }else{
        isBlock.create({
            companyId:companiesId,
            custumerId:id,
            isblock:false,
        }).then(()=>{
            return res.success({} , 'completed blocked this user successfully')
        }).catch(err=>{
            res.error(err , 500);
        })
    }
    })

   
}

exports.cancleblock = (req , res)=>{
    const id = req.params.id;
    const companiesId = req.companies.companiesId;
    isBlock.findOne({where:{custumerId:id ,companyId:companiesId}}).then(user=>{
        if(!user || user.isblock == true){
            return res.error('this user is not blocked' , 403)
        }
        isBlock.update({
            companyId:companiesId,
            custumerId:id,
            isblock:true,   
        }
         ,
        {
            where:{
                custumerId:id,
                companyId:companiesId
            }
            }).then(()=>{
            return res.success({} , 'completed canceled block this user successfully')
        }).catch(err=>{
            res.error(err , 500);
        })
    })
}
