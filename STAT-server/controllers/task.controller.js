
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

/*router.post("/add", (req, res) => {
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
});*/

