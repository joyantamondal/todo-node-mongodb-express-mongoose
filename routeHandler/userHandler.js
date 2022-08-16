const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schemas/userSchema");

const User = new mongoose.model("User", userSchema);

// Signup
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "Signup was Successfull..." });
  } catch {
    res.status(500).json({ message: "Signup failed!" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try{
  const user = await User.find({ userName: req.body.userName });
  if (user && user.length > 0) {
    const isValidPassword = await bcrypt.compare(req.body.password,user[0].password);
    if(isValidPassword){
      //Generate Token
    const token = jwt.sign({
    userName: user[0].userName,
    userId: user[0]._id,
    },process.env.JWT_SECRET,{
    expiresIn: '1h'
    }); 
    res.status(200).json({
    "access_token": token,
    "message":"Login Successfull..."
    })
    }
    else{
      res.status(401).json({
        error: "Authentication Failed!",
      });
    }
  } else {
    res.status(401).json({
      error: "Authentication Failed!",
    });
  } }
  catch{
    res.status(401).json({
      error: "Authentication Failed!",
    });
  }
});

// Get All Users 
router.get('/all', async(req,res)=>{
try{
  const users= await User.find({
  status: 'active'
  }).populate("todos");
  res.status(200).json({
    data: users,
  message: "Success"
  })
} catch(err){
  console.log(err);
  res.status(500).json({
  message: "There was an error on the server side!"
  })
}
})
module.exports = router;
