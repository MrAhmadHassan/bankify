const config  = require("../config/config.json");
const jwt = require("jsonwebtoken");



function auth(req,res,next){
    const token = req.header("x-auth-token");
    if(!token){
        return res.status(401).send({message:"Access denied. NO token provided"})
    }
    try{
    var decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = decoded;
    next();
    }catch(exc){
        return res.status(401).send({message:"Invalid token"})
    }
}



module.exports = auth;