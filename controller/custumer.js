                        const custumer = require('../models/custumer');
                        const nodecache = require('node-cache');
                        const cache = new nodecache();


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

                            custumer.findOne({where:{cusemail:email}}).then(result=>{
                            console.log(result)
                                if(!result){
                                    res.json('wrong email or password')
                                }
                                bcrypt.compare(password , result.password).then(ok=>{
                                    if(!ok){
                                    return res.json("wrong in email or password")
                                    }
                                    const token = jwt.sign({email:email,isadmin:result.isadmin , password:password} , 'mysecret')
                                res.json({msg:'successfull', result:result , token : token})
                                }).catch(err=>{
                                    console.log(err)
                                })
                            
                                
                                
                            })
                        }

                        exports.verify = (req , res , next)=>{
                        const ver = req.body.ver;
                        const t = req.params.token;

                        const token1 = jwt.verify( t , 'secret');
                        const email = token1.email;
                        custumer.findOne({where:{cusemail:email}}).then(result=>{
                            
                            if(result){
                                res.json({msg:"this email exist in database"})
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
                                        password:token1.hash
                                    }).then(custume=>{
                                    
                    res.json({msg:'created custumer',custume})
                                
                                })
                                }
                                else{
                                    res.json("code is wrong")
                                }
                            }
                        })

                        

                        }

                        exports.signup = (req , res , next)=>{
                            const{email , password } = req.body;
                            custumer.findOne({where :{cusemail:email}}).then(customer=>{
                                if (customer){
                                    return res.json("this email is exist please enter other email")
                                }else{
                                    const code = Math.floor(Math.random() * 100000);
                                    console.log(code)
                                bcrypt.hash(password , 10).then((hash)=>{
                                        const m ={ email ,hash , code};
                                        const j =jwt.sign(m , 'secret' , {expiresIn:'10m'})
                                    return j
                            
                                    }).then(j=>{
                                        res.json({token: j});
                                    })
                                    const mailoptions = {
                                        from : "aymanite22@gmail.com",
                                        to:email,
                                        subject : "خدمات الايمن للسياحة والسفر",
                                        text:`كود انشاء الحساب في تطبيق السفر هو ${code}`
                                    }
                                    transporter.sendMail(mailoptions , (error , info)=>{
                                        if(error){
                                            console.log(error)
                                        }else{
                                            res.json('email sent '  , info.response)
                                        }
                                    })
                                
                                }
                        })
                        }


                        exports.coderesetpassword = (req , res , next)=>{
                            const email = req.body.email;
                            const code = Math.floor(Math.random() * 100000);
                            console.log(code);
                            const m = {email , code};
                            if(!email){
                                res.json('please enter email')
                            }else{
                            const j =   jwt.sign(m , 'verify' , {expiresIn: '10m'});
                            console.log(j)
                            const mailoptions = {
                                from : "aymanite22@gmail.com",
                                to:email,
                                subject : "خدمات الايمن للسياحة والسفر",
                                text:`كود تغيير كلمة السر الحساب في تطبيق السفر هو ${code}`
                            }
                            transporter.sendMail(mailoptions , (error , info)=>{
                                if(error){
                                    console.log(error)
                                }else{
                                    res.json('email sent '  , info.response)
                                }
                            })
                        }
                        }
                        exports.verifycode = (req , res , next)=>{
                            const t = req.params.token;
                            const code = req.body.code;
                           const ok =  jwt.verify(t , 'verify');
                           const code1 = ok.code;
                           const email = ok.email;
                           if(code==code1){
                            const m ={code , email };
                           const j = jwt.sign(m , 'reset' , {expiresIn:'10m'})
                           console.log(j)
                           }else {
                            res.json('code is wrong')
                           }


                        }
                        exports.resetpassword = (req, res , next)=>{
                            const t = req.params.token;
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
                                    res.json('complete reset password')
                                })
                            }else{  
                                res.json('error')
                            }

                           }));
                           
                        }