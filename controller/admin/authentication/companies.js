const companies = require('../../../models/companies');

const jwt = require('jsonwebtoken')
exports.login = (req , res , next)=>{
    const email = req.body.email;
    const password = req.body.password;

    companies.findOne({where:{email:email}}).then(result=>{
       
        if(!result){
           return res.error('error in email or password',422)
        }
        
        if(result.password!=password){
           return res.error('error in email or password',422)
        }else{
           
        const token = jwt.sign({email:email,companiesId:result.id , password:password} , 'mytoken')
       return res.success({result:result , token : token},'login successfull')
        }
    }).catch(err=>{
       return res.error(err,422);   
    })
}

exports.getAllreserve = (req, rws , next)=>{

}
 
exports.getorg = (req , res , next)=>{
    organization.findAll().select('email').then(org=>{
        res.json({msg : 'completed' , org:org});
    })
    
}

exports.createorg = (req , res , next)=>{
    const name = req.body.name;
    const desc = req.body.desc;
    
    organization.create({
        orgname:name,
        description:desc
    }).then(result=>{
        res.json({msg:'created org' , result:result})
    })
   
}