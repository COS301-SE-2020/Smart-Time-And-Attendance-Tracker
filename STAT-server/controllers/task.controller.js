
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

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
    })
}


module.exports.deleteTask= (req, res) => {  
    console.log(req.query.taskID);
    TaskModel.findOne({_id : req.query.taskID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'Task doesnt exist' }); 
        else
        {
              
            TaskModel.deleteOne({_id: req.query.taskID},(err,val)=>{
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + error});
                        else if (!val) 
                            return res.status(404).json({ message: 'Task not found' });
                        else 
                        {
                            return res.status(200).json({ message: 'Task deleted successfully'});
                        }
                    });
                
            }

    });
}

