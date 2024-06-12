const jwt = require('jsonwebtoken')
module.exports = (req , res , next)=>{
    const token =  req.headers.authorization.split(" ")[1];
    if(!token){
       return res.success('token is require');
    }
    let decode;
    try{
        decode = jwt.verify(token , process.env.ACCESSTOKEN);

    }catch(err){
        return res.error(err , 500)
    }
    if(!decode){
       return res.success('token is wrong');
    }
    // req.email = decode.email;
    req.driver  = decode;
next()
}