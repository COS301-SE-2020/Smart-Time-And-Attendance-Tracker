
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
   
    TaskModel.updateOne({ _id: req.body.taskID},{Status: 'COMPLETED'},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).send({message: 'Task not found'});
        else
            return res.status(200).json({message: 'Task status updated to "COMPLETED"'});

    });
}


module.exports.update = (req, res) => {
    TaskModel.findOne({ _id: req.body.taskID},(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'Project not found'});
        else
        {
            if(req.body.hasOwnProperty('taskName'))
                 result.TaskName = req.body.taskName;

            if(req.body.hasOwnProperty('timeSpent'))
                result.TimeSpent =  req.body.timeSpent;

            if(req.body.hasOwnProperty('dueDate'))
                result.DueDate =  req.body.dueDate;

            if(req.body.hasOwnProperty('monetaryValue'))
                result.MonetaryValue =  req.body.monetaryValue;

            if(req.body.hasOwnProperty('startDate'))
                result.StartDate =  req.body.startDate;

        
                TaskModel.updateOne({ _id: req.body.taskID},{TaskName: result.TaskName,TimeSpent:result.TimeSpent,
                DueDate : result.DueDate, MonetaryValue: result.MonetaryValue, StartDate: result.StartDate},(err, result) => {
                    if (err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else
                        return res.status(200).json({message: 'Task successfully updated'});
                
                });
           
        }
    });
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

