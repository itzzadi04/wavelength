const  { sendVerificationEmail } = require(`./sendmail`)
const User = require("../models/users");
const otpGenerator = require('otp-generator');


const sendotp = async (req,res)=>{
    try{
    const{name}=req.body
    
    const currentuser = await User.findOne({name:name});
    if(!currentuser){ return res.json({ error: "Enter correct user" });}
    const email = currentuser.email;
  

    const otp = otpGenerator.generate(6, { 
         digits: true, 
         lowerCaseAlphabets: false, 
         upperCaseAlphabets: false, 
         specialChars: false 
       });
    
    
       const expiryTime = new Date(Date.now() + 10 * 60 * 1000); 
    
      await User.updateOne(
   { name: name }, 
   { $set: { verificationCode: otp, verificationCodeExpires: expiryTime } } // 2. Update: Specify fields to change
)

    await sendVerificationEmail(email,otp);
    return res.status(200).json({ message: "OTP sent successfully" });
    }catch(err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Internal server error" });
}
}

module.exports= {sendotp};