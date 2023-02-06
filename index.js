const express=require("express");
const {connection}=require("./config/db");
const {userModel}=require("./models/user.model");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const {authenticate}=require("./middleware/authenticate")
const app=express();
const fs=require("fs");
const {authrise}=require("./middleware/authrise");
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Welcome");
})


app.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    const user=await userModel.findOne({email});
    const hash_pwd=user.pass;
    bcrypt.compare(pass, hash_pwd, function(err, result) {
       if(result){
        const token = jwt.sign({ id: user._id,role:user.role}, 'normalsecret',{expiresIn:60});
        const refresh_token = jwt.sign({ id: user._id}, 'refreshsecret',{expiresIn:3000});
        res.send({msg:"log in successful",token,refresh_token});
       }else{
        res.send("login failed");
       }
    });
})

app.get("/logout",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
   const blacklisted_data=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
   blacklisted_data.push(token);
   fs.writeFileSync("./blacklist.json",JSON.stringify(blacklisted_data));
   res.send("Logged out");
})


app.post("/signup",(req,res)=>{
    const {name,email,pass,role}=req.body;
    bcrypt.hash(pass, 5, async function(err, hash) {
        const user=new userModel({
            name,
            email,
            pass:hash,
            role
        })
        await user.save();
        res.send("signup successful")
    });
    res.send("signup");
})

app.get("/getnewtoken",(req,res)=>{
    const refresh_token = req.headers.authorization.split(" ")[1];
    if(!refresh_token){
        res.send("Login first");
       }
       jwt.verify(refresh_token, 'refreshsecret', function(err, decoded) {
        if(err){
            res.send({msg:"login again",err:err.message});
        }
        else{
            console.log(decoded)
            const token = jwt.sign({ id: decoded.id}, 'normalsecret',{expiresIn:5000});
            res.send({msg:"log in successful",token});
        }
      });
})

//user
app.get("/goldrate",authenticate,(req,res)=>{   //putting role in array both seller and customer can access
    res.send("Goldrates");
})


//manager
app.get("/userstats",authenticate,authrise(["manager"]),(req,res)=>{
    res.send("selling products")
})


app.listen(8080,async()=>{
   try {
    await connection;
    console.log("connection established from DB");
   } catch (error) {
    console.log(error);
    console.log("Unable to connect with db");
   }
    console.log("8080 running");
})