const mongoose = require("mongoose");
const AttendanceEntryModel = mongoose.model("AttendanceEntry");
const AttendanceModel = mongoose.model("UserAttendance");
const UserModel = mongoose.model("User");
const TimeEntryHelper =  require('../helpers/timeEntry.helper');
const AttendanceEntryHelper =  require('../helpers/attendance.helper');
const UserHelper =require('../helpers/user.helper');
var Promise = require('promise');
var async = require("async");
const attendanceEntryModel = require("../models/attendanceEntry.model");


module.exports.addAttendanceEntry = (req, res) => {  
    var timeEntry = new AttendanceEntryModel();
    timeEntry.Date = req.body.date;
    timeEntry.StartTime = req.body.startTime;
    timeEntry.EndTime = req.body.endTime;
    timeEntry.Device = req.body.device;

    timeEntry.save((error, timeEntryDoc) => {
        if(!error)
        {
            AttendanceModel.findOne({UserID : req.ID}, function(err, result) {
                if(err) 
                {
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
                else if (!result)
                {
                    var userTimeEntry = new AttendanceModel();
                    userTimeEntry.UserID = req.ID;
                    userTimeEntry.AttendanceEntries = [timeEntryDoc];
                    userTimeEntry.save((err, doc) => {
                    if(!err)
                        return res.status(200).json({ attendanceEntryID: timeEntryDoc._id, message: 'Attendance recorded successfully' });
                    else 
                    {
                        if (err.code == 11000)
                            res.status(409).send({message: 'Attendance record already exists'});
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        }
                    });
                }
                else {
                    result.AttendanceEntries.push(timeEntryDoc);
                    result.save((err, doc) => {
                        if(!err)
                            return res.status(200).json({attendanceEntryID: timeEntryDoc._id, message: 'Attendance recorded successfully' });
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                    });
                }
            });
        }

        else 
        {
            if (error.code == 11000)
                res.status(409).send({message: 'Attendance record already exists'});
            else
                return res.status(500).send({message: 'Internal Server Error: ' + error});
        }
    });     
}
module.exports.updateAttendanceEntry = (req, res) => {  
    if(!req.body.hasOwnProperty('attendanceEntryID'))
        return res.status(400).send({message: 'No attendance entry ID given'});
    
    AttendanceEntryModel.findOne({ _id: req.body.attendanceEntryID},(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'Attendance entry not found'});
        else
        {

            if(req.body.hasOwnProperty('startTime'))
                result.StartTime =  req.body.startTime;

            if(req.body.hasOwnProperty('endTime'))
                result.EndTime =  req.body.endTime;
    

            if(req.body.hasOwnProperty('date'))
                result.Date =  req.body.date;
                
        
                AttendanceEntryModel.updateOne({ _id: req.body.attendanceEntryID},{StartTime: result.StartTime,EndTime: result.EndTime,Date: result.Date, Description: result.Description },(err, result) => {
                    if (err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else
                        return res.status(200).json({message: 'Attendance entry successfully updated'});
                
                });
            
        }
    
    });
        
}

/**
 * This function returns all time entries for the user.
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} returns all time entries and entry information in an array ie - name, email
 */  
module.exports.getOwnAttendanceEntries = (req, res) => {  
    var count = true;
    var count3 = 0;
    AttendanceModel.findOne({  UserID : req.ID},(err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No attendance entries for the given user were found' }); 
        }
        else{
            var attendanceEntries=[];
            var times = result.AttendanceEntries.length
           
            if(times == 0){
                return res.status(404).json({ message: 'No attendance entries were found' });
            }
            else{
                if(req.query.hasOwnProperty("minDate"))
                {
                    var min = new Date(req.query.minDate).getTime();
                    if(req.query.hasOwnProperty("maxDate"))
                    {
                        var max = new Date(req.query.maxDate);
                        max.setDate(max.getDate() + 1);
                        max = max.getTime()
                    }
                    else
                     var max = new Date().getTime(); 
                
                    for(var a=0; a<times; a++){
                        AttendanceEntryModel.findOne({_id: result.AttendanceEntries[a], StartTime: {$gte: min,$lte: max}},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                attendanceEntries.push({attendanceEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, device: val.Device});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No attendance entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({attendanceEntries}); 
                            }
                        });
                    }
                }
                else{
                    for(var a=0; a<times; a++){
                        AttendanceEntryModel.findOne({_id: result.AttendanceEntries[a]},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                attendanceEntries.push({attendanceEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, device: val.Device});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No attendance entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({attendanceEntries}); 
                            }
                        });
                    }
                }
            }
        }
    });
}
/**
 * This function returns all time entries for the user.
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} returns all time entries and entry information in an array ie - name, email
 */  
module.exports.getUserAttendanceEntries = (req, res) => {  
    var count = true;
    var count3 = 0;
    if(!req.query.hasOwnProperty("userID"))
        return res.status(400).send({message: 'No user ID provided'});

    AttendanceModel.findOne({  UserID : req.query.userID},(err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No attendance entries for the given user were found' }); 
        }
        else{
            var attendanceEntries=[];
            var times = result.AttendanceEntries.length;
           
            if(times == 0){
                return res.status(404).json({ message: 'No attendance entries for the given user were found' });
            }
            else{
                if(req.query.hasOwnProperty("minDate"))
                {
                    var min = new Date(req.query.minDate).getTime();
                    if(req.query.hasOwnProperty("maxDate"))
                    {
                        var max = new Date(req.query.maxDate);
                        max.setDate(max.getDate() + 1);
                        max = max.getTime()
                    }
                    else
                        var max = new Date().getTime(); 
                
                    for(var a=0; a<times; a++){
                        AttendanceEntryModel.findOne({_id: result.AttendanceEntries[a], StartTime: {$gte: min,$lte: max}},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                attendanceEntries.push({attendanceEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, device: val.Device});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No attendance entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({attendanceEntries}); 
                            }
                        });
                    }
                }
                else{
                    for(var a=0; a<times; a++){
                        AttendanceEntryModel.findOne({_id: result.AttendanceEntries[a]},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                attendanceEntries.push({attendanceEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, device: val.Device});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No attendance entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({attendanceEntries}); 
                            }
                        });
                    }
                }
                
            }
        }
    });
}


/**
 * This function returns all attendance entries for an IOT device.
 * @param {HTTP Request} req Parameters - Device ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} returns all time entries and attendance information in an array ie - name, email
 */  
module.exports.getIOTAttendanceEntries = (req, res) => {  
    if(!req.query.hasOwnProperty("deviceID"))
        return res.status(400).send({message: 'No device ID provided'});

        AttendanceEntryModel.findOne({  Device : req.query.deviceID},(err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No attendance entries were found' }); 
        }
        else{
            var timeEntries=[];
            var times = result.TimeEntries.length;
           
            if(times == 0){
                return res.status(404).json({ message: 'No attendance entries were found' });
            }
            else{
                if(req.query.hasOwnProperty("minDate"))
                {
                    var min = new Date(req.query.minDate).getTime();
                    if(req.query.hasOwnProperty("maxDate"))
                    {
                        var max = new Date(req.query.maxDate);
                        max.setDate(max.getDate() + 1);
                        max = max.getTime()
                    }
                    else
                        var max = new Date().getTime(); 
                
                    for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a], StartTime: {$gte: min,$lte: max}},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, description: val.Description,project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({timeEntries}); 
                            }
                        });
                    }
                }
                else{
                    for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a]},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, description: val.Description,project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({timeEntries}); 
                            }
                        });
                    }
                }
                
            }
        }
    });
}

/**
 * This function returns returns an array with all users + time entries for each user
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} 
 */  
module.exports.getAllUsersAttendanceEntries = async function(req, res) {  
    var count4 =0;
    UserHelper.getAllUsers(async (err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error:1 ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No users found' }); 
        }
        else{
            var finalobject=[];
            var allcounts=result.length;
            result.forEach( async function(myDoc){ 
                count4=count4+1;
                var userid=myDoc.ID;
                var name =myDoc.name;
                var surname=myDoc.surname;
                var email=myDoc.email;

                AttendanceModel.findOne({  UserID :userid},async (err, result) => {
                    if (err) {
                        return res.status(500).send({message: 'Internal Server Error:2 ' + err});
                    }
                    else if (!result){ ///no time entries for this user
                        finalobject.push({ name:name, surname:surname, email:email, attendanceEntries:[] });
    
                        if (count4 == allcounts && finalobject.length == allcounts)  {
                            return res.status(200).json({results: finalobject}); 
                         }

                    }
                    else{
                        if(result.AttendanceEntries.length == 0){  
                            finalobject.push({ name:name, surname:surname, email:email, attendanceEntries:[] });
                            if (count4 == allcounts && finalobject.length == allcounts)  {
                                return res.status(200).json({finalobject}); 
                             }
                        }
                        else{
                            try {
                                const  val = await AttendanceEntryHelper.getAllEntries(result.AttendanceEntries,req.query);
                                var filtered = val.filter(function (el) {
                                    return el != null;
                                  });
                                finalobject.push({ name:name, surname:surname, email: email, attendanceEntries: filtered });
                                
                                if (count4 == allcounts && finalobject.length == allcounts)  {
                                return res.status(200).json({results: finalobject});
                                }
                            } 
                            catch (error) {
                                return res.status(500).send({message: 'Internal Server Error: 3' + err})
                           }
                        }
                    }
                });
            });
        }
    });
}