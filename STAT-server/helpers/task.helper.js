/**
  * @file STAT-server/helper/task.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles some of the requests regarding Task model in our database. 
  * This is a helper file to handle Task related requests.
  * @date 15 July 2020
 */

/**
* Filename:             STAT-server/helper/task.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   15 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding Task model in our database. 
*                       This is a helper file to handle Task related requests.
*
*/
const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

/**
 * 
 * @param {HTTP Request} req Request body - Task name, due date of Task, time spent on Task, start date of Task and Monetary Value
 * @param {*} res Success or error message
 * @param {*} next 
 */
module.exports.add = (req, res, next) => {
    var task = new TaskModel();
    task.TaskName = req.body.taskName;
    task.DueDate = req.body.dueDate;
    task.TimeSpent = req.body.timeSpent;    //SHOULDN'T timeSpent BE 0??
    task.StartDate = req.body.startDate;
    task.MonetaryValue = req.body.monetaryValue;    
    task.updateOne((err, doc) => {
        if(!err){
            return res.status(200).send({message: 'Task Created'});
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    });
}

/**
 * 
 * @param {String} id ID of task
 * @param {*} done 
 * @return {String} - Name of Task.
 */
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

/**
 * 
 * @param {String} id ID of task
 * @param {*} done 
 * @return {Array} - Name of Task, Id of Task, status of Task, due date oF Task.
 */
module.exports.getTaskName = (id, done)=>{
    TaskModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
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

/**
 * 
 * @param {*} ids ID of tasks
 * @param {*} done 
 * @returns {String} error message else void
 */
module.exports.deleteTask= (ids, done) => {      
       
    TaskModel.deleteMany({_id: {$in: ids}},(err,val)=>{     
        if(err) 
            done(err);
        else
            done(null);
    });            

}

