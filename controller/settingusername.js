const User = require(`../models/users`)
const settingusername = async (req,res)=>{
    try{
    const {username} = req.body

    if(!username){
    return res.json({error:`should have a username`})
    }
    const newUser= await User.create({name:username})
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
    }catch(e){res.json({error:e.message})}
}

module.exports={settingusername};