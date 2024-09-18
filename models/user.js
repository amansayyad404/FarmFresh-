const { required } = require("joi");
const mongoose =require("mongoose");
const Schema =mongoose.Schema;
const passportLocalMongoose =require("passport-local-mongoose");//it is Authentication middleware for node.js 

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
    
});

userSchema.plugin(passportLocalMongoose); //it Automatically creates [username,password,hashing,salting]

module.exports = mongoose.model('User',userSchema);