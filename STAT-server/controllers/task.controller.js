/**
  * @file STAT-server/controllers/task.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the Task model in our database
  * @date 11 June 2020
 **/

/**
* Filename:             STAT-server/controllers/task.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the Task model in our database
*
*/ 

const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

/**
 * 
 * @param {HTTP Request} req Request body - ID of task
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.startTask = (req, res) => {
    TaskModel.updateOne({ _id: req.body.taskID},{Status: 'In Progress'},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (result.n ==0)
           return res.status(404).send({message: 'Task not found'});
        else
            return res.status(200).json({message: 'Task status updated to "In Progress"'});

    });

}

/**
 * 
 * @param {HTTP Request} req Request body - ID of task
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.completeTask = (req, res) => {
   
    TaskModel.updateOne({ _id: req.body.taskID},{Status: 'Completed'},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (result.n ==0)
            return res.status(404).send({message: 'Task not found'});
        else
            return res.status(200).json({message: 'Task status updated to "Completed"'});

    });
}

/**
 * 
 * @param {HTTP Request} req Request body - ID of task
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.reset = (req, res) => {
   
    TaskModel.updateOne({ _id: req.body.taskID},{Status: 'Not Started'},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (result.n ==0)
            return res.status(404).send({message: 'Task not found'});
        else
            return res.status(200).json({message: 'Task status updated to "Not Started"'});

    });
}

/**
 * 
 * @param {HTTP Request} req Request body - ID of task, task name, time spent on task, due date of task,
 * monetary value associated with task, start date of task.
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.update = (req, res) => {
    TaskModel.findOne({ _id: req.body.taskID},(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'Task not found'});
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

/**
 * 
 * @param {HTTP Request} req Request body - Task name, start date of task, due date of task.
 * @param {HTTP Response} res 
 * @param {Function} next Next function to be called.
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

/**
 * 
 * @param {HTTP Request} req Request query - Task ID.
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.deleteTask= (req, res) => {     
    if(!req.query.taskID)
        return res.status(400).send({message: 'No task ID provided'});      
TaskModel.deleteOne({_id: req.query.taskID},(err,val)=>{
    if(err)
        return res.status(500).send({message: 'Internal Server Error: ' + err});
    else if (val.n==0) 
        return res.status(404).json({ message: 'Task not found' });
    else 
        return res.status(200).json({ message: 'Task successfully deleted '});
    });            
}

