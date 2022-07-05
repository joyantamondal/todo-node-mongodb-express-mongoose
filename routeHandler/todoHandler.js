const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");

const Todo = new mongoose.model("Todo", todoSchema);

// Get All The Todos
router.get("/", async (req, res) => {
  await Todo.find({status: "active"}).select({
  _id:0,
  _v:0,
  date:0
  })
  // .limit(2)
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
router.get("/:id", async (req, res) => {});
//post a todo
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({ message: "Todo was inserted successfully..." });
    }
  });
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
router.delete("/:id", async (req, res) => {});
module.exports = router;
