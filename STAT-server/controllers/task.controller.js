const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

module.exports.startTask = (req, res, next) => {
    TaskModel.findOne({_id : (req.body.taskID)}, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else 
        {
            TaskModel.update({ _id: req.body.taskID},{Status: 'IN PROGRESS'},(err, result) => {
                if (err) 
                    return res.status(500).send({message: 'Internal Server Error: ' + error});
                else if (!result)
                    return res.status(404).send({message: 'Internal Server Error: ' + error});
                else
                    return res.status(200).json({message: 'Task status updated to "IN PROGRESS"'});
                       
            });
        }
    });
}


module.exports.completeTask = (req, res, next) => {
    TaskModel.findOne({_id : (req.body.taskID)}, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else 
        {
            TaskModel.update({ _id: req.body.taskID},{Status: 'COMPLETED'},(err, result) => {
                if (err) 
                    return res.status(500).send({message: 'Internal Server Error: ' + error});
                else if (!result)
                    return res.status(404).send({message: 'Internal Server Error: ' + error});
                else
                    return res.status(200).json({message: 'Task status updated to "COMPLETED"'});
                       
            });
        }
    });
}

/*router.get("/", (req, res)=>{
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
*/