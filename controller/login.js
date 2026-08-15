require('dotenv').config()
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const handlelogin = async (req,res)=>{

    const {username,password}=req.body;
    
    try{
    if(!username || !password){
        return res.json({"message":"enter all the given fields to login"})
 }
    const current_user = await User.findOne({name:username});
    if(!current_user){
        return res.json({message:"user not register yet signup first"});
 }
    if(!current_user.isVerified){
         return res.json({message:"user is not verified"});
   }
    const istrue = await bcrypt.compare(password,current_user.password);
    if(!istrue){
          return res.json({message:"wrong password"});
 }

    let token = jwt.sign({name:current_user.name,
                          email : current_user.email},process.env.SECRET);
    res.cookie(`user`,token);

    return res.status(200).json({ message: "Login successful" });
    } catch (error) {

        console.error("Login route error:", error);
        return res.status(500).json({ message: "An unexpected server error occurred" });
    }

}

module.exports= {handlelogin}