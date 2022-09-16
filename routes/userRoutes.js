const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const userotp = require('../models/userotp');
const User = require('../models/userModel');

const router = express.Router();

//otp verify
router.post('/verifyEmail',async (req,res)=>{
  try{
    let { userId, otp}=req.body;
    if(!userId || !otp){
      throw Error("blank otp not allowed");
    }
    else{
      const userotpRecords = userotp.find({
        userId,
      });
      if(userotpRecords.length<=0){
        //no record 
        throw new Error(
          "record doesnt exist or is already verified. please signup/login"
        );
      }
      else{
        //find rec
        const { expires }= userotpRecords[0].expires;
        const thisotp= userotpRecords[0].otp;

        if(expires< Date.now()){
          //expired
          await userotp.deleteMany({ userId });
          throw new Error("otp expired,please try again");
        }else{
               const vaidotp=(thisotp==otp);
               if(!validotp){
                //wrong otp
                throw new Error("invalid otp, check inbox and retry");
               }
               else{
                //success
                User.updateOne({_id:userId},{verified: true});
                userotp.deleteMany({ userId });
                




    createSendToken(newUser, 201, res);
    
                res.json({
                  status:"verified",
                  message: "verify success",
                });
               }
        }
      }

    }
  }
    catch(error){
      res.json({
        status:"failed",
        message: error.message,
      });

    }
  
});
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(authController.protect);

router.get('/profile', userController.getMe, userController.getUserProfile);
router.get('/getPoints', userController.getMe, userController.getPoints);
router.patch(
  '/cheatAttempt',
  userController.getMe,
  userController.cheatAttempt
);

module.exports = router;
