const mongoose=require("mongoose")
const schema=mongoose.Schema;

const userotpSchema=new mongoose.Schema({
    userId:{
        type: String,
        
      },
    otp: {
        type: String,
        default: 0,
      },
    created: Date,
    expires:Date,
});

const userotp=mongoose.model(
    "userotp",userotpSchema
);

module.exports=userotp;