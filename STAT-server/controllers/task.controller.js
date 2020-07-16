const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");


const passport = require("passport");
const bodyParser = require("body-parser");

router.get("/", (req, res)=>{
    res.send("Task controller");
});




/*
  DESCRPTION
*/


module.exports.add = (req, res, next) => {
    var task = new TaskModel();
    task.TaskName = req.body.taskName;
    task.DueDate = req.body.dueDate;
    task.TimeSpent = req.body.timeSpent;
    task.StartDate = req.body.startDate;
    task.MonetaryValue = req.body.monetaryValue;    
    task.save((err, doc) => {
        if(!err){
            return res.status(200).send({message: 'Created Task'});
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}
