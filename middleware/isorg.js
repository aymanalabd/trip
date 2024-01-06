const jwt = require('jsonwebtoken')
module.exports = (req , res , next)=>{
    const token = req.headers.mytoken;
    if(!token){
        res.json({msg :'token is required'})
    }
    let decode;
    try{
        decode = jwt.verify(token , 'mytoken');

    }catch(err){
        console.log(err);
    }
    if(!decode){
        res.json({msg:'token is wrong'})
    }
    // req.email = decode.email;
    req.isadmin = decode.isadmin;
    req.orgid = decode.orgid;
next()
}