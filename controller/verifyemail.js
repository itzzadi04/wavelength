const  { sendVerificationEmail } = require(`./sendmail`)
const User = require("../models/users");

const verifyEmail = async (req,res)=>{

    const{userotp,useremail}= req.body;

    const currentuser= await User.findOne({email:useremail});
    if(!currentuser){return res.json({"message":"user not found"})}
    if (Date.now() > currentuser.verificationCodeExpires) {
    return res.status(400).json({ message: "code expired, request a new one" });
    };
    const original_otp = currentuser.verificationCode ;
    
    if(!(userotp==original_otp)){
     currentuser.verificationCode=null;
     currentuser.verificationCodeExpires=null;
     return res.json({"message":`failed to verify`})
    }

    currentuser.isVerified=true;
    currentuser.verificationCode=null;
    currentuser.verificationCodeExpires=null;
    await currentuser.save();
    res.json({"message":`${currentuser.name} verified successfully`})
    console.log(`${currentuser.email} is verified successfully`)
    };

    module.exports= {verifyEmail};