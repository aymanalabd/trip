                                const custumer = require('../models/custumer');
                                const nodecache = require('node-cache');
                                const cache = new nodecache();
                                const {validationResult} = require('express-validator')

                                const jwt = require('jsonwebtoken');
                                const crypto = require('crypto')
                                const bcrypt = require('bcryptjs');
                                const con = require('../conn/conn');
                                const nodemailer = require('nodemailer');
                                const { json } = require('body-parser');
                                const transporter = nodemailer.createTransport({
                                    
                                    service:'gmail',
                                    auth:{
                                        user:"aymanite22@gmail.com",
                                        pass: 'ttlucuertvciwcwv'
                                    }
                                    })
                                exports.l =(req , res ,next )=>{
                                
                                }

                                exports.logincus = (req , res , next)=>{
                                    const email = req.body.email;
                                    const password = req.body.password;
                                   const result = validationResult(req);
                                   if(!result.isEmpty()){
                                    return res.error(result);
                                   }else{
                                    custumer.findOne({where:{cusemail:email}}).then(result=>{
                                
                                        if(!result){
                                            res.error('error in email or password',400)
                                        }
                                        bcrypt.compare(password , result.password).then(ok=>{
                                            if(!ok){
                                            return res.error("error in email or password",400)
                                            }
                                            const token = jwt.sign({email:email,isadmin:result.isadmin , password:password} , 'mysecret')
                                        
                                            res.success({result:result , token : token},"successfull")
                                            // res.json({msg:'successfull', result:result , token : token})
                                        }).catch(err=>{
                                            res.error(err)
                                        })
                                    
                                        
                                        
                                    }).catch(err=>{
                                        res.error(err)
                                    })
                                   }
                                  
                                   
                                }


                                exports.signup = (req , res , next)=>{
                                    const{email , password , confirmpassword } = req.body;
                                    
                                    const result = validationResult(req);
                                   if(!result.isEmpty()){
                                   return res.error(result);
                                   }
                                    custumer.findOne({where :{cusemail:email}}).then(customer=>{
                                        if (customer){
                                            return res.error("this email is exist please enter other email")
                                        }else{
                                            const code = Math.floor(Math.random() * 100000);
                                            console.log(code)
                                            if(password!==confirmpassword){
                                               return res.error('passwords is not same ')
                                            }
                                        bcrypt.hash(password , 10).then((hash)=>{
                                            bcrypt.hash(confirmpassword , 10).then(r=>{
                                                const m ={ email ,hash , code , r};
                                                const j =jwt.sign(m , 'secret' , {expiresIn:'10m'})
                                            return j
                                    
                                            }).then(j=>{
                                                res.success({token: j});
                                            }).catch(err=>{
                                                res.error(err)
                                        })
                                            const mailoptions = {
                                                from : "aymanite22@gmail.com",
                                                to:email,
                                                subject : "Ayman's services to transport :)",
                                                text:`code is : ${code}`
                                            }
                                            transporter.sendMail(mailoptions , (error , info)=>{
                                                if(error){
                                                    console.log(error)
                                                }else{
                                                    console.log('ok')
                                                }
                                            })
                                              
                                            })
                                        
                                        }
                                }).catch(err=>{
                                    res.error(err);
                                })
                                }
                                exports.verifycodecustumer = (req , res , next)=>{
                                    const ver = req.body.ver;
                                    const t = req.headers.authorization.split(" ")[1];
                                    
                                    const token1 = jwt.verify( t , 'secret');
                                    const email = token1.email;
                                    custumer.findOne({where:{cusemail:email}}).then(result=>{
                                        
                                        if(result){
                                            res.error("this email exist ")
                                        }
                                        else{
                                            if(ver == token1.code){
                                                custumer.create({
                                                    // firstname:fname,
                                                    // lastname:lname,
                                                    // localnumber:localnumber,
                                                    // fathes   r:father,
                                                    // mather:mather,
                                                    cusemail:token1.email,
                                                    password:token1.hash,
                                                    confirmpassword:token1.r
                                                }).then(custume=>{
                                                
                                res.success(custume,'complete sign in successfull')
                                            
                                            }).catch(err=>{
                                                res.error(err);
                                            })
                                            }
                                            else{
                                                res.error("code is wrong ")
                                            }
                                        }
                                    }).catch(err=>{
                                        res.error(err);
                                    })
            
                                    
            
                                    }


                                exports.coderesetpassword = (req , res , next)=>{
                                    const result = validationResult(req);
                                    if(!result.isEmpty()){
                                    return res.error(result);
                                    }else{
                                    const email = req.body.email;
                                    const code = Math.floor(Math.random() * 100000);
                                   
                                    const m = {email , code};
                                    custumer.findOne({where:{cusemail: email}}).then(user=>{
                                        if(!user){
                                            res.error('please enter correct email')
                                        }else{
                                            if(!email){
                                                res.error(' please enter your email first ')
                                            }else{
                                            const j =   jwt.sign(m , 'verify' , {expiresIn: '10m'});
                                            res.success({token: j , code : code});
                                            const mailoptions = {
                                                from : "aymanite22@gmail.com",
                                                to:email,
                                                subject : "Ayman's services to transport :)",
                                                text:`code is : ${code}`
                                            }
                                            transporter.sendMail(mailoptions , (error , info)=>{
                                                if(error){
                                                    console.log(error)
                                                }else{
                                                    res.success(info.response,'email sent '  )
                                                }
                                            })
                                        }
                                        }
                                    }).catch(err=>{
                                        res.error(err);
                                    })
                                }
                                }
                                exports.verifycodepassword = (req , res , next)=>{
                                    const result = validationResult(req);
                                    if(!result.isEmpty()){
                                    return res.error(result);
                                    }else{
                                        const t = req.headers.authorization.split(" ")[1];
                                        const code = req.body.code;
                                const ok =  jwt.verify(t , 'verify');
                                const code1 = ok.code;
                                const email = ok.email;
                                if(code==code1){
                                    const m ={code , email };
                                const j = jwt.sign(m , 'reset' , {expiresIn:'10m'})
                                return res.success(j,'complete reset password successfully' );
                                }else {
                                    res.error('code is not correct')
                                }
                            }

                                }
                                exports.resetpassword = (req, res , next)=>{
                                    const result = validationResult(req);
                                    if(!result.isEmpty()){
                                    return res.error(result);
                                    }else{
                                        const t = req.headers.authorization.split(" ")[1];
                                        const j = jwt.verify(t , 'reset')
                                    console.log(j)
                                    const confirm = req.body.confirmpassword;
                                    const password = req.body.password;
                                const pass =  bcrypt.hash(password , 12).then((hash=>{
                                        if(password === confirm){
                                        custumer.findOne({where:{cusemail : j.email}}).then((user)=>{
                                            console.log(user)
                                            user.password = hash
                                            user.save();
                                        }).then((ok)=>{
                                            res.success({},'تم تغيير كلمة السر بنجاح')
                                        })
                                    }else{  
                                        res.error('الكلمات غير متطابقة')
                                    }

                                })).catch(err=>{
                                    res.error(err);
                                });
                            }
                                }