const jwt = require('jsonwebtoken')
module.exports = (req , res , next)=>{
    const token = req.headers.authorization.split(" ")[1];
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
    req.companies = decode;
    console.log(req.companies)

next()
}