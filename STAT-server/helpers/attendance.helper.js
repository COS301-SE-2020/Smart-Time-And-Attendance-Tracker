const mongoose = require("mongoose");
const AttendanceModel = mongoose.model("AttendanceEntry");
var Promise = require('promise');
var async = require("async");

/**
 * Returns info for all the time entries of the user.
 * @param {Array} ids IDs of time entries.
 * @param {Object} user The user who's time entries are being fetched.
 * @param {*} done 
 * @returns {Object} Time Entry document(object).
 * ///
 */

module.exports.getAllEntries = async (ids,req)=> {
    return new Promise(function(resolve, reject) { 
        entries = [];
        if(req.hasOwnProperty("minDate"))
        {
            var min = new Date(req.minDate).getTime();
            if(req.hasOwnProperty("maxDate"))
            {
                var max = new Date(req.maxDate);
                max.setDate(max.getDate() + 1);
                max = max.getTime()
            }
            else
                var max = new Date().getTime(); 

             ids.forEach((id) => { 
                entries.push(
                        AttendanceModel.findOne({_id: id,  StartTime: {$gte: min,$lte: max}}).then((result) => {
                            if(result){
                                var text = {
                                    'attendanceEntryID': result._id,
                                    'date': result.Date,
                                    'startTime': result.StartTime,
                                    'endTime': result.EndTime,
                                    'device': result.Device           
                                    } 
                                return text;
                            }
                        }).catch((err) => reject(err)));
            });
            Promise.all(entries).then((result) => {
                resolve(result);  
            }).catch((err) => reject(err));
        }
        else
        {
            ids.forEach((id) => { 
            entries.push(
                    AttendanceModel.findOne({_id: id}).then((result) => {
                        if(result){
                            var text = {
                                'attendanceEntryID': result._id,
                                'date': result.Date,
                                'startTime': result.StartTime,
                                'endTime': result.EndTime,
                                'device': result.Device  
                                } 
                            return text;
                        }
                    }).catch((err) => reject(err)));
            });
            Promise.all(entries).then((result) => {
                resolve(result);  
            }).catch((err) => reject(err));
            
        }
    });
}