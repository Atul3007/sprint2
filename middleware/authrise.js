//closure function

const authrise=(role_arr)=>{
    return (req,res,next)=>{
         const userrole=req.body.userrole;
           if(role_arr.includes(userrole)){
            next();
           }else{
            res.send("not authrise");
           }
    }
    }
    
    module.exports={
        authrise
    }