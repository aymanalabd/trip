const config = require('dotenv').config();
const jwt = require('jsonwebtoken')

exports.verifyToken = (token)=>{
    return (req , res , next)=>{
        
    jwt.verify(token , process.env.ACCESSTOKEN , (err , result)=>{
        console.log(err)
        if(err){
            return res.error('this token is wrong' , 401)
        }else 
         if(!result){
            return res.error('this token is not exist' , 401);
          }
           next()
          
          
}
        
)

    }

}