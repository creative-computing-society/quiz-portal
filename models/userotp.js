const mongoose=require("mongoose")
const schema=mongoose.Schema;

const userotpSchema=new mongoose.Schema({
    userId:String,
    otp: String,
    created: Date,
    expires:Date,
});

const userotp=mongoose.model(
    "userotp",userotpSchema
);

module.exports=userotp;