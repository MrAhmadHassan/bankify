


const checkAdmin = (req,res,next)=>{
    console.log(req.user);
    if(req.user && !req.user.isAdmin){
        return res.status(403).send({message:"Access denied"});
    }
    next();
    
     
    
    
}

module.exports = checkAdmin;