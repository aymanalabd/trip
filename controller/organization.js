const organization = require('../models/organization')

const jwt = require('jsonwebtoken')
exports.login = (req , res , next)=>{
    const email = req.body.email;
    const password = req.body.password;

    organization.findOne({where:{email:email}}).then(result=>{
       
        if(!result){
            res.status(422).json('wrong email or password')
        }
        
        if(result.password!==password){
            res.json('wrong email or password')
        }else{
           
        const token = jwt.sign({email:email,orgid:result.id, password:password} , 'mytoken')
        res.status(200).json({msg:'successfull', result:result , token : token})
        }
    })
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