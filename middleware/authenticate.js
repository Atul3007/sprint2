const jwt=require("jsonwebtoken");
const fs=require("fs");
const authenticate=(req,res,next)=>{
       const token = req.headers.authorization.split(" ")[1];
       if(!token){
        res.send("Login first");
       }
       const blacklisted_data=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
       if(blacklisted_data.includes(token)){
           res.send("Please login first");
       }
       jwt.verify(token, 'normalsecret', function(err, decoded) {
        if(err){
            res.send({msg:"login again",err:err.message});
        }
        else{
            const userrole=decoded.role;
            req.body.userrole=userrole;
            next();
        }
      });
}

module.exports={
    authenticate
}