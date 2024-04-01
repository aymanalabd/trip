
    const config = require('dotenv').config();
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const nodemailer = require('nodemailer');
    const {generateToken} = require('../../../util/helper')

    //models
    const custumer = require('../../../models/custumer');



    const transporter = nodemailer.createTransport({

        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })



    //login custumer
    exports.logincus = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;

        custumer.findOne({ where: { cusemail: email } }).then(result => {
            if (!result || result.activeUser == false) {
                return res.error('error in email or password', 404)
            }
           
           
            bcrypt.compare(password, result.password).then(ok => {
                if (!ok) {
                    return res.error("error in email or password", 404)
                }
                const {token , refreshtoken} = generateToken({id:result.id })

                return res.success({ result: result, token: token , refreshtoken:refreshtoken }, "successfull")
            }).catch(err => {
               return res.error(err, 500)
            })




        }).catch(err => {
           return res.error(err, 500)
        })



    }




    //signup custumer
    exports.signup = (req, res, next) => {
        const { fullname , email, password, confirmpassword } = req.body;
        
    custumer.findOne({ where: { cusemail: email } }).then(user => {
        
            if (user || user && user.activeUser == true) {
                return res.error("this email is exist please enter other email", 422)
            } 
        
            const code = Math.floor(10000 + Math.random() * 90000);
            console.log(code)
            const mailoptions = {
                from: process.env.USER,
                to: email,
                subject: "AlEman company for transport :)",
                text: `code is : ${code}`
            }
            transporter.sendMail(mailoptions, (error, info) => {
                if (error) {
                    res.error(error , 500)
                } else {
                    console.log('ok')
                }
            })
            bcrypt.hash(password, 10).then((hash) => {
            bcrypt.hash(confirmpassword, 10).then(confirmpasswordhash => {
            custumer.create({fullname:fullname,cusemail:email , password:hash ,
                    confirmpassword:confirmpasswordhash , verificationCode:code , activeUser:false}).then(user=>{
                    return res.success({ userinfo: user } , 'this is info user');

                    })
                        .catch(err=>{
                            return res.error(err , 500)
                        })
                                })
                                .catch(err => {
                                     return res.error(err, 500)
                                })
            
    
        })
        
    })}



    exports.verifycodecustumer = (req, res, next) => {
        const code = req.body.code;
        const id = req.params.id;
        custumer.findOne({where:{id:id}}).then(user=>{
            if (user && user.activeUser == true) {
                return res.error("this email is exist please enter other email", 422)
            } 
            if(!user){
                return res.error('you are not invoke code for this email' , 402)
            }
        if(user.verificationCode != code){
            return res.error('code is wrong' , 402)
        }
       
        
        user.update({verificationCode:null , activeUser:true} , {where:{id:user.id}})

        const {token , refreshtoken} = generateToken({ id: user.id })
       return res.success({user , token:token , refreshtoken : refreshtoken },'create user successfull')
        
        
            
        }).catch(err=>{
            return res.error(err , 500)
        })

    }


    exports.coderesetpassword = (req, res, next) => {
            const email = req.body.email;
            const code = Math.floor(10000 + Math.random() * 90000);
    console.log(code)
            custumer.findOne({ where: { cusemail: email } }).then(user  => { 
                if (!user || user.activeUser == false) {
                return res.error('please enter correct email', 404)
                } else {
                    if (!email) {
                        return res.error(' please enter your email first ', 422)
                    } else {
                        custumer.update({verificationCode : code} , {where:{cusemail:email}}).then(r=>{
                            return res.success({id:user.id} , 'verification code is sended with successfull');
                        })
                        
                        const mailoptions = {
                            from: "aymanite22@gmail.com",
                            to: email,
                            subject: "Ayman's services to transport :)",
                            text: `code is : ${code}`
                        }
                        transporter.sendMail(mailoptions, (error, info) => {
                            if (error) {
                                console.log(error)
                            } else {
                            console.log('successfull')
                            }
                        })
                    }
                }
            }).catch(err => {
               return res.error(err, 500);
            })
        }




    exports.verifycodepassword = (req, res, next) => {
    const id = req.params.id;
    const code = req.body.code;
    custumer.findOne({where:{id : id}}).then(user =>{


        if (user && user.activeUser == false) {
            return res.error('this email is not correct' , 422)        } 
        if(!user){
            return res.error('email is not exist' , 422)   
            } 
        
        if(code != user.verificationCode){
           return res.error('code is wrong' , 422)
        }
        user.update({verificationCode:null , activeUser:true} , {where:{id:id}})


        res.success({} , 'now you can reset password')
    })

    }


    exports.resetpassword = (req, res, next) => {

    const id = req.params.id;
    const newpassword = req.body.password;
    const newconfirm = req.body.confirmpassword;
        if(newpassword != newconfirm){
            return res.error('two words are not matched' , 422);
        
        }
        custumer.findOne({where :{id :id}}).then(user=>{
            bcrypt.hash(newpassword, 10).then((hash) => {
                bcrypt.hash(newconfirm, 10).then(confirmpasswordhash => {
                     if(!user || user.activeUser == false){
                         return res.error('this email is not exist' , 422)
                     }
                 user.update({password:hash , confirmpassword:confirmpasswordhash} , {where : {id:id}}).then(r=>{
                     return res.success({},'complete reset password')
                 })
                         
     
             })
           })
        })
        

    }
   

    exports.refreshtoken = (req , res , next)=>{
        const {refresh} = req.body;
        if(!refresh){
            return res.error('token is required' , 402)
        }

    jwt.verify(refresh , process.env.REFRESHTOKEN , (err , result)=>{
        console.log(result.iat)
        if(err){
            return res.error('this token is wrong' , 402)
        }else 
        if(!result){
            return res.error('this token is not exist' , 402);
        }
            delete result.exp;
            delete result.iat;
        
        const { token , refreshtoken}  = generateToken(result);
        
        return res.success({token:token , refreshtoken:refreshtoken} , 'this is info token')

    });
    
            
        
        
    }