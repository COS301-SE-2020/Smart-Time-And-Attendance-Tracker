const mongoose = require("mongoose");
const TaskHelper = require("../helpers/task.helper");
const ProjectHelper = require("../helpers/project.helper");
const UserTimeEntryModel = mongoose.model("UserTimeEntry");
const TimeEntryModel = mongoose.model("TimeEntry");

module.exports.addTimeEntry = (req, res) => {  
    var timeEntry = new TimeEntryModel();
    timeEntry.Date = req.body.Date;
    timeEntry.TaskID = req.body.TaskID;
    timeEntry.ProjectID = req.body.TaskID;
    timeEntry.StartTime = req.body.StartTime;
    timeEntry.ProjectName = req.body.ProjectName;
    timeEntry.TaskName = req.body.TaskName;
    if(req.body.ActiveTime)
        timeEntry.ActiveTime = req.body.ActiveTime;
    else
        timeEntry.ActiveTime = 0;
    if(req.body.EndTime)
        timeEntry.EndTime = req.body.EndTime;
        /*if(timeEntry.ActiveTime == 0)
            timeEntry.ActiveTime = req.body.EndTime - req.body.StartTime;*/
    else
        timeEntry.EndTime = 0;
    if(req.body.MonetaryValue)
            timeEntry.MonetaryValue = req.body.MonetaryValue;
    else
        timeEntry.MonetaryValue = 0;

    timeEntry.Description = req.body.Description;
    timeEntry.Device = req.body.Device;

    timeEntry.save((error, timeEntryDoc) => {
        if(!error)
        {
            UserTimeEntryModel.findOne({UserID : req.ID}, function(err, result) {
                if(err) 
                {
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
                else if (!result)
                {
                    var userTimeEntry = new UserTimeEntryModel();
                    userTimeEntry.UserID = req.ID;
                    userTimeEntry.TimeEntries = [timeEntryDoc];
                    userTimeEntry.save((err, doc) => {
                    if(!err)
                        return res.status(200).json({ timeEntryID: timeEntryDoc._id,  message: 'Time recorded successfully' });
                    else 
                    {
                        if (err.code == 11000)
                            res.status(409).send({message: 'Time record already exists'});
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        }
                    });
                }
                else {
                    result.TimeEntries.push(timeEntryDoc);
                    result.save((err, doc) => {
                        if(!err)
                            return res.status(200).json({timeEntryID: timeEntryDoc._id, message: 'Time recorded successfully' });
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                    });
                }
            });
        }

        else 
        {
            if (error.code == 11000)
                res.status(409).send({message: 'Time record already exists'});
            else
                return res.status(500).send({message: 'Internal Server Error: ' + error});
        }
    });     
}
//Update the time enty
//Request body - Has values to update
//Response - Success or error message       
module.exports.updateTimeEntry = (req, res) => {  
    let error;
    let resultReturn = true;
    if(req.body.TaskID)
        {
            TimeEntryModel.updateOne({ _id: req.body.TimeEntryID},{TaskID: req.body.TaskID},(err, result) => {
                if (err) 
                    error= err;
                else if (!result)
                    resultReturn = false;
                        
            });
        }
        if(req.body.StartTime)
        {
            TimeEntryModel.updateOne({ _id: req.body.TimeEntryID},{StartTime: req.body.StartTime},(err, result) => {
                if (err) 
                    error= err;
                else if (!result)
                    resultReturn = false;                       
            });
        }
        if(req.body.EndTime)
        {
            TimeEntryModel.updateOne({ _id: req.body.TimeEntryID},{EndTime: req.body.EndTime},(err, result) => {
                if (err) 
                    error= err;
                else if (!result)
                    resultReturn = false;              
            });
        }
        //update monetary value too
        if(req.body.ActiveTime)
        {
            TimeEntryModel.updateOne({ _id: req.body.TimeEntryID},{ActiveTime: req.body.ActiveTime},(err, result) => {
                if (err) 
                    error= err;
                else if (!result)
                    resultReturn = false;              
            });
        }

        if(req.body.Date)
        {
            TimeEntryModel.updateOne({ _id: req.body.TimeEntryID},{Date: req.body.Date},(err, result) => {
                if (err) 
                    error= err;
                else if (!result)
                    resultReturn = false;      
            });
        }
        if(error)
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        if(!resultReturn)
            return res.status(404).json({ message: 'Time entry not found' }); 
        else
            return res.status(200).json({message: 'Time entry updated'});
}


// Finds al time entries for specified date. Uses TaskHelper to get TaskName from TaskID.
//Parameters - Date string
// Returns - Array of time entry objects
module.exports.getDailyTimeEntries = (req, res) => {  
    var count = true;
    var count3 = 0;
    UserTimeEntryModel.findOne({  UserID : req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
        {
            var date = req.query.date;
            var timeEntries=[];
            var times = result.TimeEntries.length
            if(times == 0)
                return res.status(404).json({ message: 'No time entries for the given user were found' });
            else
            {
                for(var a=0; a<times; a++)
                {
                    TimeEntryModel.findOne({_id: result.TimeEntries[a]},(err,val)=>
                    {   
                        count3= count3+1; 
                        
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + error});

                        else if(val)
                        {
                            if(date == val.Date)
                            {
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, project: val.ProjectName,task: val.TaskName, description: val.Description, monetaryValue:val.MonetaryValue});
                            }
            
                        };
                        if(count3 == times && count)
                            return res.status(404).json({ message: 'No time entries for the given day were found' });
                        else if(count3== times)
                            return res.status(200).json({timeEntries}); 

                    
                    });
                }
            }
        }
    });
}


/* This function receives user ID, jwtTOKEN and a time entry ID
   it authenthenticates ID and the token from the index.router and 
   then deletes the item
*/
module.exports.deleteTimeEntry = (req, res) => {  
    UserTimeEntryModel.findOne({  UserID : req.query.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No time entries for the given user were found' }); 
        else
        {          
            console.log(req.query.timeEntry);
            console.log(result.TimeEntries);
            /*timeEntryModel.findOne({_id:{$type:req.query.timeEntry}},(err,val)=>
            {
                console.log(val)
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else if (!val) 
                    return res.status(404).json({ message: 'Time entry not found' });
                else 
                { */
                    timeEntryModel.deleteOne({"_id":req.query.timeEntry},(errs,vals) =>{
                        //console.log(errs);
                        //return res.status(200).json({ message: 'Time entry deleted' });
                        if(errs)
                            return res.status(500).send({message: 'Internal Server Error: ' + errs});
                        else if (!vals) 
                            return res.status(404).json({ message: 'Time entry not found' });
                        else 
                            return res.status(200).json({ message: 'Time entry deleted' });
        

                        
                    })
                   
               // }
           // });    
        }
    });
}