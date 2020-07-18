
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

module.exports.startTask = (req, res, next) => {
  
    TaskModel.updateOne({ _id: req.body.taskID},{Status: 'In Progress'},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
           return res.status(404).send({message: 'Task not found'});
        else
            return res.status(200).json({message: 'Task status updated to "In Progress'});

    });

}


module.exports.completeTask = (req, res, next) => {
   
    TaskModel.update({ _id: req.body.taskID},{Status: 'COMPLETED'},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).send({message: 'Task not found'});
        else
            return res.status(200).json({message: 'Task status updated to "COMPLETED"'});

    });
}


module.exports.update = (req, res) => {
    var error;
    var updated = false;
    if(req.body.taskName)
    {
        TaskModel.update({ _id: req.body.taskID},{TaskName: req.body.taskName},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(req.body.timeSpent)
    {
        TaskModel.update({ _id: req.body.taskID},{TimeSpent: req.body.timeSpent},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(req.body.dueDate)
    {
        TaskModel.update({ _id: req.body.taskID},{DueDate: req.body.dueDate},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(req.body.monetaryValue)
    {
        TaskModel.update({ _id: req.body.taskID},{MonetaryValue: req.body.monetaryValue},(err, result) => {
            if (err) 
             error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(err)
        return res.status(500).send({message: 'Internal Server Error: ' + error});
    else if(updated)
        return res.status(200).json({message: 'Task successfully updated'});
    else
        return res.status(404).json({message: 'Task not found'}); 
}


/*
  DESCRPTION
*/

module.exports.add = (req, res, next) => {
    var task = new TaskModel();
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


module.exports.deleteTask= (req, res) => {           
TaskModel.deleteOne({_id: req.query.taskID},(err,val)=>{
    if(err)
        return res.status(500).send({message: 'Internal Server Error: ' + err});
    else if (!val) 
        return res.status(404).json({ message: 'Task not found' });
    else 
        return res.status(200).json({ message: 'Task successfully deleted '});
    });            
}

