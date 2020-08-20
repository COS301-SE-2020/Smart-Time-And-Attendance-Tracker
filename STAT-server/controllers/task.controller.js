const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");
router.get("/", (req, res)=>{
    res.send("Task controller");
});


router.post("/add", (req, res) => {
    var task = new TaskModel();
    task.ID = db.Task.find().Count()+1;
    task.ProjectID = req.body.projectID;
    task.ClientName = req.body.clientName;
    task.TaskName = req.body.taskName;
    task.StartTime = req.body.startTime;
    task.TimeSpent = req.body.timeSpent;
    task.ExpectedCost = req.body.expectedCost;
    task.MonetaryValue = req.body.monetaryValue;    
    task.save((err, doc) => {
        if(!err){
            res.send("Created Task");
        }
        else{
            res.send("Error Occured");
        }
    })
});

module.exports = router;
