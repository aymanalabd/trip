
const isBlock = require('../../../models/isBlock');
const customerisnotpaid = require('../../../models/customersIsNotPaid');

exports.block = (req , res)=>{
    const id = req.params.id;
    const companiesId = req.companies.companiesId;
    customerisnotpaid.destroy({
        where: {
          custumerId: id,
          companyId: companiesId
        }
      })
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
