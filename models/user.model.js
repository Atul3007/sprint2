const mongoose= require("mongoose")

const userschema= new mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{type:String, enum:["user","manager"],default:"user"}  //enum tells only customer nas seller can be add as role
})

const userModel=mongoose.model("user",userschema);

module.exports={
    userModel
}