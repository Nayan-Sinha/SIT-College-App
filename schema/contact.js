var mongoose=require("mongoose");

var ContactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },

})
//module.exports=mongoose.model("User",UserSchema);
mongoose.model("Contact",ContactSchema);