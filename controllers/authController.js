// const crypto = require('crypto');
const { promisify } = require('util');

const userotp = require('./../models/userotp');


const  nodemailer= require('nodemailer');


const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const { response } = require('express');
const Question = require('./../models/questionModel');
 let transporter= nodemailer.createTransport({
  host:"smtp-mail.outlook.com",
  auth:{
    user:process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,

  }
 });



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

//session occ by current user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};




// ROUTE TO SIGN UP
exports.signup = async (req, res, next) => {
  try {
    // GET ALL QUESTIONS
    const easy = Question.find({ difficulty: 'easy' });
    const medium = Question.find({ difficulty: 'medium' });
    const hard = Question.find({ difficulty: 'hard' });

    // RESOLVE PROMISES SIMULTANEOUSLY TO REDUCE WAITING TIME
    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      easy,
      medium,
      hard,
    ]);

    const assignedQuestions = [
      shuffleArray(easyQuestions).slice(0, 4),
      shuffleArray(mediumQuestions).slice(0, 3),
      shuffleArray(hardQuestions).slice(0, 3),
    ];

    




    

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      branch: req.body.branch,
      password: req.body.password,
      techStack: req.body.techStack,
      assignedQuestions,
      verified:false,
      
    });
    
    newUser.save().then((result)=>{
      //send otp 
      otpverifyemail(req.body.email,res);
    }).catch((err) =>{
      console.log(err);
      res.json({
        status: 'failed',
        message: 'error while saving details',
      })
    });

   
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};





// ROUTE TO LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password ) {
      res.status(400).json({
        status: 'failed',
        message: 'Please provide email and password!',
      });
      return next();
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (!user || !(user.password === password)) {
      res.status(401).json({
        status: 'failed',
        message: 'Incorrect email or password',
      });
      return next();
    }
    if (!user.verified) {
      res.status(401).json({
        status: 'failed',
        message: 'not verified',
      });
      return next();
    }

    if (user.cheatAttempts >= 3) {
      res.status(401).json({
        status: 'failed',
        message:
          'You have been disqualified as you have been caught cheating three times.',
      });
      return next();
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err.message,
    });
  }
};

// ROUTE TO LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// ROUTE TO CHECK WHETHER THE USER IS LOGGED IN
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      res.status(401).json({
        status: 'failed',
        message: 'You are not logged in! Please log in to get access.',
      });
      return next();
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        status: 'failed',
        message: 'The user belonging to this token does no longer exist.',
      });
      return next();
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged in! Please log in to get access.',
    });
    return next();
  }
};
//global
let otp=20463;

const otpverifyemail= async (email,res)=> {
try{
//const otp= `${Math.floor(Math.random()*9000)}`;
otp+=1;
const mailoptions = {
  from: process.env.AUTH_EMAIL,
  to:email,
  subject: "verify email",
  html:`<p>enter <b>${otp} </b>to verify your email</p><br><p>expires in an hour</p>`,
};
console.log("sent otp ",otp,"to",email);
// const newuserotp= await new userotp({
//   userId:email,
//   otp: otp,
//   created: Date.now(),
//   expires: Date.now()+3600000,
// });

// await newuserotp.save();
// console.log(newuserotp);
await transporter.sendMail(mailoptions);
res.json({
  status:"PENDING",
  message:"otp verification mail sent",
  data:{
    userId:email,
    
  },
});
}catch(err){
  res.json({
    status:"FAILED",
    message: err.message,
  });

}

};

exports.verifyEmail= async (req,res)=>{
  try{
    let { thisuserId, thisotp}=req.body;
    
    if(!thisuserId || !otp){
      throw Error("blank otp not allowed");
    }
    
    else{
      
      // const userotpRecords = userotp.find({
      //   userId: thisuserId,
      // });
      
      
      
      // if(userotpRecords.length<=0){
      //   console.log("not there");
      //   //no record 
      //   throw new Error(
      //     "record doesnt exist or is already verified. please signup/login"
      //   );
      // }
      // else{
        //find rec
        //const { expires }= userotpRecords[0];
        //const thisotp= userotpRecords[0].otp;

        // if(expires< Date.now()){
        //   //expired
        //   await userotp.deleteMany({ userId });
        //   throw new Error("otp expired,please try again");
        // }else
        console.log(thisotp,otp);
               const validotp=(thisotp==otp);
               if(!validotp){
                //wrong otp
                throw new Error("invalid otp, check inbox and retry");
               }
               else{
                //success
                User.updateOne({email:thisuserId},{verified: true});
                //userotp.deleteMany({ userId });
                




    createSendToken(newUser, 201, res);
    
                res.json({
                  status:"verified",
                  message: "verify success",
                });
               }
        
      }

    }
  
    catch(error){
      res.json({
        status:"failed",
        message: error.message,
      });

    }
  
}