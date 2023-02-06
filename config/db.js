const mongoose=require("mongoose");
const connection =mongoose.connect("mongodb+srv://Atul:Dwivedi@cluster0.t89moyx.mongodb.net/social_media?retryWrites=true&w=majority");
module.exports={
    connection
}