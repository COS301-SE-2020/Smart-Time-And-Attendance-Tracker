const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

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
            return res.status(200).send({message: 'Task Created'});
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}