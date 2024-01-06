module.exports = (req , res , next)=>{
    if(req.isadmin==true){
        next();
    }
    else{
        console.log('error')
    }
}