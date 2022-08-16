const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middlewares/checkLogin");



// Get Active Todos using async await
router.get("/active",  async(req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
  data,
  })
});

// Get Inactive Todos using callback pattern
router.get("/inactive",  (req, res) => {
  const todo = new Todo();
 todo.findInactive((err,data)=>{ res.status(200).json({
  data,
  })
});
 
});

// Get All Title containing  js  
router.get("/js", async(req, res) => {
  const data = await Todo.findByJs();
  res.status(200).json({
    data,
    })
});

// Get Todos by Language  
router.get("/language", async(req, res) => {
  const data = await Todo.find().byLanguage("react");
  res.status(200).json({
    data,
    })
});

// Get All The Todos
router.get("/",checkLogin,  (req, res) => {

   Todo.find({})
   .populate("user","name userName")
   .select({
  _id:0,
  _v:0,
  date:0
  })
  // .limit(10)
  .exec((err,data)=>{
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
     
      res.status(200).json({ result: data, message: "Success" });
    }
  });
});

//get a todo by id
router.get("/:id", async (req, res) => {
  
    try{
      const data = await Todo.find({_id: req.params.id});
      res.status(200).json({ result: data, message: "Success" });
    }
    catch(err){
      res.status(500).json({
        error: "There was a server side error!",
      }); 
    }
});

//post a todo
router.post("/", checkLogin, async(req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId
  });
  try{
  const todo = await newTodo.save();
  await User.updateOne({
  _id: req.userId
  },{
  $push:{
  todos: todo._id,
  }
  });
  res.status(200).json({ message: "Todo was inserted successfully..." });
  } catch(err){
    res.status(500).json({
      error: "There was a server side error!",
    });
  }

});

//post multiple todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({ message: "Todos were inserted successfully..." });
    }
  });
});

//put  todo
router.put("/:id", async (req, res) => {
  const result = await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        new:true,
        status: "inactive",
      },
    },
    {useFindAndModify:false},
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({ message: "Todos was updated successfully..." 
      });
      }
    }).clone();
    console.log(result);
    // .
});


// delete todo 
router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({_id: req.params.id},(err)=>{
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
     
      res.status(200).json({message: "Todo Was Deleted Successfully!" });
    }
  }).clone()
});
module.exports = router;
