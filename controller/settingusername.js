const User = require("../models/users");
const bcrypt = require("bcrypt");
  

const { sendVerificationEmail } = require(`./sendmail`)



const settingUsername = async (req, res) => {
  try {
    const saltRounds = 10;
    const { username, password, email} = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Submit both fields" });
    }
   

 

    // Hash the password with await
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //create user
    const newUser = await User.create({
      name: username,
      password: hashedPassword,
      email: email,
     
    });

    return res.status(201).json({
      message: "User created successfully",
      user: { email: newUser.email, name: newUser.name },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = { settingUsername };
