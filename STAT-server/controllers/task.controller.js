
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");


module.exports.update = (req, res) => {
    if(req.body.TaskName)
    {
        TaskModel.update({ _id: req.body.TaskName},{TaskName: req.body.TaskName},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Task not found' }); 
            else
                return res.status(200).json({message: 'Task name updated'});
                    
        });
    }
    if(req.body.TimeSpent)
    {
        TaskModel.update({ _id: req.body.ProjectID},{TimeSpent: req.body.TimeSpent},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Task not found' }); 
            else
                return res.status(200).json({message: 'Task time updated'});
                    
        });
    }
    if(req.body.DueDate)
    {
        TaskModel.update({ _id: req.body.ProjectID},{DueDate: req.body.DueDate},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Task not found' }); 
            else
                return res.status(200).json({message: 'Task due date updated'});
                    
        });
    }
    if(req.body.MonetaryValue)
    {
        TaskModel.update({ _id: req.body.ProjectID},{MonetaryValue: req.body.MonetaryValue},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + error});
            else if (!result)
                return res.status(404).json({ message: 'Task not found' }); 
            else
                return res.status(200).json({message: 'Task monetary value updated'});
                    
        });
    }
}


/*
  DESCRPTION
*/

module.exports.add = (req, res, next) => {
    var task = new TaskModel();
    console.log(req.body);
    task.TaskName = req.body.taskName;
    task.DueDate = req.body.dueDate;
    task.StartDate = req.body.startDate;
    task.TimeSpent = 0;
    task.MonetaryValue = 0;
    task.save((err, doc) => {
        if(!err){
            req.TaskID = doc._id;
            next();
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    });
}

