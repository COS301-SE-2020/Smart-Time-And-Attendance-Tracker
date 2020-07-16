const mongoose = require("mongoose");
const timeEntryModel = require("../models/timeEntry.model");
const TimeEntryHelper = require("../helpers/timeEntry.helper");
const UserTimeEntryModel = mongoose.model("UserTimeEntry");
const TimeEntryModel = mongoose.model("TimeEntry");

module.exports.addTimeEntry = (req, res) => {  
    var timeEntry = new TimeEntryModel();
    timeEntry.Date = req.body.Date;
    timeEntry.TaskID = req.body.TaskID;
    timeEntry.StartTime = req.body.StartTime;
    timeEntry.EndTime = req.body.EndTime;
    timeEntry.Description = req.body.Description;
    timeEntry.Device = req.body.Device;
    timeEntry.ActiveTime = timeEntry.EndTime-timeEntry.StartTime;
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
                        return res.status(200).json({ message: 'Time recorded successfully', "TimeEntryID": timeEntryDoc._id });
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
                            return res.status(200).json({ message: 'Time recorded successfully', "TimeEntryID": timeEntryDoc._id });
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
       
module.exports.updateTimeEntry = (req, res) => {  
    return res.status(200).send({message: 'Time record updated'});
}


module.exports.getDailyTimeEntries = (req, res) => {  
    UserTimeEntryModel.findOne({  UserID : req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No time entries for the given user were found' }); 
        else
        {
                    var date = req.query.date;
                    var TimeEntries=[];
                    var times = result.TimeEntries.length
                    for(var a=0; a<times; a++)
                    {
                        timeEntryModel.findOne(result.TimeEntries[a]._id,(err,val)=>
                        {
                            if(err)
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            else if (!val) 
                                return res.status(404).json({ message: 'Time entry not found' });
                            else 
                            {
                                if(date == val.Date)
                                    TimeEntries.push({"TimeEntryID": val.ID,"Date":val.Date, "StartTime":val.StartTime, "EndTime":val.EndTime, "Duration":val.Duration, "Task":"TBA", "Project":"TBA", "Description": val.Description});
                                console.log(TimeEntries.length);

                                if(TimeEntries.length == 0)
                                    return res.status(404).json({ message: 'No time entries found for date given' }); 
                                else if(TimeEntries.length == times)
                                    return res.status(200).json({TimeEntries}); 
                            }
                        });
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
                            return res.status(404).json({ message: 'Time entry not found --' });
                        else 
                        {
                            return res.status(200).json({ message: 'Time entry deleted' });
                        }

                        
                    })
                   
               // }
           // });    
        }
    });
}