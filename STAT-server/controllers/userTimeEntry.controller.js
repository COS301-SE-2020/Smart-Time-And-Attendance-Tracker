const mongoose = require("mongoose");
const UserTimeEntryModel = mongoose.model("UserTimeEntry");
const TimeEntryModel = mongoose.model("TimeEntry");

module.exports.addTimeEntry = (req, res) => {  
    var timeEntry = new TimeEntryModel();
    timeEntry.Date = req.body.Date;
    timeEntry.TaskID = req.body.TaskID;
    timeEntry.Duration = req.body.Duration;
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
                    userTimeEntry.TimeEntry = [timeEntryDoc];
                    userTimeEntry.save((err, doc) => {
                    if(!err)
                        return res.status(404).json({ message: 'Time recorded successfully.', "Time Entry ID": timeEntryDoc._id });
                    else 
                    {
                        if (err.code == 11000)
                            res.status(409).send({message: 'User already exists'});
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        }
                    });
                }
                else {
                    result.TimeEntry.push(timeEntryDoc);
                    result.save((err, doc) => {
                        if(!err)
                            return res.status(404).json({ message: 'Time recorded successfully.', "Time Entry ID": timeEntryDoc._id });
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                    });
                }
            });
        }
        else 
        {
            if (error.code == 11000)
                res.status(409).send({message: 'Time record already exists.'});
            else
                return res.status(500).send({message: 'Internal Server Error: ' + error});
        }
    });            

}
       
module.exports.updateTimeEntry = (req, res) => {  
    return res.status(200).send({message: 'Updating entry!'});
}


