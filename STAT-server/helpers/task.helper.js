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
    });
}

module.exports.getName = (id, done)=>{
    TaskModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result.TaskName);
        
    });
}

module.exports.getTaskName = (id, done)=>{
    TaskModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done("Task not found",false);
        else if(result)
        {
            var text = {
                'ID': result._id,
                'taskName': result.TaskName,
                'taskStatus': result.Status,
                'dueDate': result.DueDate
            }
            done(null, text);
        }        
    });
}

/*
projects: [
    {
        ID: "abcd122hsj1",
        ProjectName: "P1",
        tasks: [
            {
                ID: "ajn62hcw",
                taskName: "A",
                tastStatus: "IN PROGRESS"
            }
        ]
    },
    {
        ID: "abcd122hsh7",
        ProjectName: "P2",
        tasks: [
            {
                ID: "ajn62hgw",
                taskName: "V",
                tastStatus: "IN PROGRESS"
            },
            {
                ID: "ajnt6v78ji",
                taskName: "Z",
                tastStatus: "IN PROGRESS"
            }
        ]
    }
]
*/
