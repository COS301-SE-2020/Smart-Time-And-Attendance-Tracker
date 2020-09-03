/**
  * @file STAT-server/controllers/predictive.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding predictive analysis
  * @date  26 August 2020
 */

/**
* Filename:             STAT-server/controllers/predictive.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   26 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the predictive analysis
*
*/

const mongoose = require("mongoose");
const TaskHelper = require("../helpers/task.helper");
const ProjectHelper = require("../helpers/project.helper");
const UserTimeEntryModel = mongoose.model("UserTimeEntry");
const TimeEntryModel = mongoose.model("TimeEntry");
const UserModel = mongoose.model("User");
const TimeEntryHelper = require('../helpers/timeEntry.helper');
const UserHelper = require('../helpers/user.helper');
const ProjectModel = mongoose.model("Project");
var Promise = require('promise');
var async = require("async");
const {calendar} = require("googleapis/build/src/apis/calendar");

const AnalysisHelper = require('../helpers/analysis.helper');
/**
 * this function receives user id and calculates users average time
 * @param {user id} req 
 * @param {average time} res 
 */
module.exports.getUserAverageTime = (req, res) => {
    var count = true;
    var count3 = 0;
    if (!req.query.hasOwnProperty("userID") || !req.query.hasOwnProperty("minDate") || !req.query.hasOwnProperty("maxDate")) 
        return res.status(400).send({message: 'Provide correct detail. Check minDate,maxDate and userID'});
    

    UserTimeEntryModel.findOne({
        UserID: req.query.userID
    }, (err, result) => {
        if (err) {
            return res.status(500).send({
                message: 'Internal Server Error: ' + err
            });
        } else if (!result) {
            return res.status(404).json({message: 'No time entries for the given user were found'});
        } else {
            var averageTime = 0;
            var times = result.TimeEntries.length;

            if (times == 0) { // /return average  = 0;
                return res.status(404).json({message: 'No time entries for the given user were found'});
            } else { // /set dates
                var min = new Date(req.query.minDate).getTime();
                var max = new Date(req.query.maxDate);
                max.setDate(max.getDate() + 1);
                max = max.getTime();

                if (req.query.hasOwnProperty("projectID")) { // /return average on a certain project
                    var totalEntries = 0;

                    for (var a = 0; a < times; a++) {
                        TimeEntryModel.findOne({
                            _id: result.TimeEntries[a],
                            ProjectID: req.query.ProjectID
                        }, (err, val) => {
                            count3 = count3 + 1;
                            if (err) {
                                return res.status(500).send({
                                    message: 'Internal Server Error: ' + error
                                });

                            } else if (val) {
                                count = false;
                                totalEntries = totalEntries + 1;
                                // console.log(totalEntries)
                                averageTime = averageTime + val.ActiveTime;

                            };
                            if (count3 == times && count) {
                                return res.status(404).json({message: 'No time entries were found'});
                            } else if (count3 == times) {
                                averageTime = averageTime / totalEntries;
                                return res.status(200).json({averageTime});
                            }
                        });
                    }
                } else {

                    for (var a = 0; a < times; a++) {
                        TimeEntryModel.findOne({
                            _id: result.TimeEntries[a]
                        }, (err, val) => {
                            count3 = count3 + 1;
                            if (err) {
                                return res.status(500).send({
                                    message: 'Internal Server Error: ' + error
                                });

                            } else if (val) {
                                count = false;
                                averageTime = averageTime + val.ActiveTime;
                            };
                            if (count3 == times && count) {
                                return res.status(404).json({message: 'No time entries were found'});
                            } else if (count3 == times) {
                                averageTime = averageTime / times;
                                return res.status(200).json({averageTime});
                            }
                        });
                    }
                }

            }
        }
    });
}


/*
 * this function gets a device breakdown for a project - checks each users device usage
 * @param {projectID, minDate, maxDate } req 
 * @param { Total: 72, Browser: 40, Website: 32 } res 
 */

module.exports.getAllProjectDevices = async (req, res) => {
    if (!req.query.hasOwnProperty("projectID")) 
        return res.status(400).send({message: 'No project ID provided'});
    
    var projectID = req.query.projectID;
    var count4 = 0;

    var min = new Date(req.query.minDate).getTime();
    if (req.query.hasOwnProperty("maxDate")) {
        var max = new Date(req.query.maxDate);
        max.setDate(max.getDate() + 1);
        max = max.getTime()
    } else 
        var max = new Date().getTime();
     TimeEntryModel.find({
        ProjectID: req.query.projectID,
        StartTime: {
            $gte: min,
            $lte: max
        }
    }, async (err, result) => {
        if (err) {
            return res.status(500).send({
                message: 'Internal Server Error: ' + err
            });
        } else if (!result) {
            return res.status(404).json({message: 'No time entries for the given project were found'});
        } else {
            var timeentries = result.length;
            console.log(timeentries)
            if (result.length == 0) {
                return res.status(404).json({message: 'No time entries for the given user were found'});
            } else {
                var browsers = 0;
                var websites = 0;
                for (var a = 0; a < timeentries; a++) {
                    if (val.Device == "Browser") {
                        browsers++;
                    } else if (val.Device == "Website") {
                        websites++;
                    } else if (val.Device == "Google calendar") {
                        calendar ++;
                    } else if (val.Device == "Manual entry") {
                        manual ++;
                    } else if (val.Device == "IOT Device") {
                        iot ++;
                    } else {
                        others ++
                    }
                }
                return res.status(200).json({Total: timeentries, Browser: browsers, Website: websites});
            }
        }
    });
}


/**
 * receives userid and returns device breakdown, add projectid to get auser project device breakdown
 * @param {} req 
 * @param {*} res 
 */

module.exports.getUserDevices = async (req, res) => {
    if (!req.query.hasOwnProperty("userID")) 
        return res.status(400).send({message: 'No user ID provided'});
    

    var count4 = 0;

    var min = new Date(req.query.minDate).getTime();
    if (req.query.hasOwnProperty("maxDate")) {
        var max = new Date(req.query.maxDate);
        max.setDate(max.getDate() + 1);
        max = max.getTime()
    } else {
        var max = new Date().getTime();
    }

    var browsers = 0;
    var websites = 0;
    var others = 0;
    var calendar = 0;
    var iot = 0;
    var manual = 0;
    UserTimeEntryModel.findOne({
        UserID: req.query.userID
    }, async (err, result) => { // console.log(result);
        if (err) {
            return res.status(500).send({
                message: 'Internal Server Error: ' + err
            });
        } else if (!result) {
            return res.status(404).json({message: 'No time entries for the given user were found'});
        } else {

            var times = result.TimeEntries.length;
            var count3 = 0;
            if (times == 0) {
                return res.status(404).json({message: 'No time entries for the given user were found'});
            } else {


                if (req.query.hasOwnProperty("projectID")) { // //device for project
                    var totalEntries = 0;

                    result.TimeEntries.forEach(async function (myDoc) { // console.log(myDoc);
                        TimeEntryModel.findOne({
                            _id: myDoc,
                            ProjectID: req.query.ProjectID,
                            StartTime: {
                                $gte: min,
                                $lte: max
                            }
                        }, async (err, val) => {
                            count3 = count3 + 1;
                            // console.log(count3);
                            if (err) {
                                return res.status(500).send({
                                    message: 'Internal Server Error: ' + error
                                });

                            } else if (!val) {
                                others++;
                            } else if (val) {
                                if (val.Device == "Browser") {
                                    browsers++;
                                } else if (val.Device == "Website") {
                                    websites++;
                                } else if (val.Device == "Google calendar") {
                                    calendar++;
                                } else if (val.Device == "Manual entry") {
                                    manual++;
                                } else if (val.Device == "IOT Device") {
                                    iot++;
                                } else {
                                    others++
                                }
                            }
                            if (count3 == times - 1) {
                                return res.status(200).json({
                                    Total: count3,
                                    Browser: browsers,
                                    Website: websites,
                                    Calendar: calendar,
                                    IOT: iot,
                                    Manual: manual,
                                    Others: others
                                });
                            }
                        });
                    });

                } else { // //without project

                    result.TimeEntries.forEach(async function (myDoc) { // console.log(myDoc);
                        TimeEntryModel.findOne({
                            _id: myDoc,
                            StartTime: {
                                $gte: min,
                                $lte: max
                            }
                        }, async (err, val) => {
                            count3 = count3 + 1;
                            // console.log(count3);
                            if (err) {
                                return res.status(500).send({
                                    message: 'Internal Server Error: ' + error
                                });

                            } else if (!val) {
                                others++;
                            } else if (val) {
                                if (val.Device == "Browser") {
                                    browsers++;
                                } else if (val.Device == "Website") {
                                    websites++;
                                } else if (val.Device == "Google calendar") {
                                    calendar++;
                                } else if (val.Device == "Manual entry") {
                                    manual++;
                                } else if (val.Device == "IOT Device") {
                                    iot++;
                                } else {
                                    others++
                                }
                            }
                            if (count3 == times - 1) {
                                return res.status(200).json({
                                    Total: count3,
                                    Browser: browsers,
                                    Website: websites,
                                    Calendar: calendar,
                                    IOT: iot,
                                    Manual: manual,
                                    Others: others
                                });
                            }
                        });
                    });

                }

            }
        }
    });
}


/**
 * This project returns the websites a users has visited
 * 
 */


module.exports.getUserWebsites = async (req, res) => {
    if (!req.query.hasOwnProperty("userID")) 
        return res.status(400).send({message: 'No user ID provided'});
    

    var count4 = 0;

    var min = new Date(req.query.minDate).getTime();
    if (req.query.hasOwnProperty("maxDate")) {
        var max = new Date(req.query.maxDate);
        max.setDate(max.getDate() + 1);
        max = max.getTime()
    } else {
        var max = new Date().getTime();
    }

    var urlArray = [];
    var websites = [];
    UserTimeEntryModel.findOne({
        UserID: req.query.userID
    }, async (err, result) => { // console.log(result);
        if (err) {
            return res.status(500).send({
                message: 'Internal Server Error: ' + err
            });
        } else if (!result) {
            return res.status(404).json({message: 'No time entries for the given user were found'});
        } else {

            var times = result.TimeEntries.length;
            var count3 = 0;
            if (times == 0) {
                return res.status(404).json({message: 'No time entries for the given user were found'});
            } else {


                if (req.query.hasOwnProperty("projectID")) { // //device for project
                    var totalEntries = 0;

                    result.TimeEntries.forEach(async function (myDoc) { // console.log(myDoc);
                        TimeEntryModel.findOne({
                            _id: myDoc,
                            ProjectID: req.query.ProjectID,
                            StartTime: {
                                $gte: min,
                                $lte: max
                            }
                        }, async (err, val) => {
                            count3 = count3 + 1;

                            if (err) {
                                return res.status(500).send({
                                    message: 'Internal Server Error: ' + error
                                });

                            } else if (!val) { // others++;
                            } else if (val) {
                                var pathArray = val.Description.split('/');
                                var protocol = pathArray[0];
                                var host = pathArray[2];
                                var url = protocol + '//' + host;
                                // console.log(val.Description)
                                // console.log(host)
                                urlArray.push(host);
                            }
                            if (count3 == times - 1) {


                                var arr = urlArray;
                                for (var b = 0; b < arr.length; b++) {
                                    if (arr[b] == undefined) {
                                        arr[b] = "others";
                                    }

                                }


                                // console.log(arr);
                                // console.log(arr.length);
                                var arrayLength = urlArray.length;
                                for (var a = 0; a < arrayLength; a++) {

                                    AnalysisHelper.mostVisitedWebsite(arr, async (err, val) => {
                                        // console.log(err)
                                        // console.log(val)
                                        console.log(val)

                                        if (val) {
                                            websites.push(val);
                                            AnalysisHelper.deleteFromArray(arr, val.element, async (err, result) => {
                                                // console.log(err);
                                                // arrayLength=arr.le
                                            });
                                        }
                                        /* else{ ///error value
                                                   console.log("error = "+err);
                                                   AnalysisHelper.deleteFromArray( arr,"undefined", async (err, result) => {
                                                    //console.log(err);
                                                });
                                               }*/
                                    });
                                    // console.log(a);
                                    if (arr.length == 1) {
                                        return res.status(200).json({url: websites});
                                    }
                                }


                            }
                        });
                    });

                } else { // //without project

                    result.TimeEntries.forEach(async function (myDoc) { // console.log(myDoc);
                        TimeEntryModel.findOne({
                            _id: myDoc,
                            StartTime: {
                                $gte: min,
                                $lte: max
                            }
                        }, async (err, val) => {
                            count3 = count3 + 1;

                            if (err) {
                                return res.status(500).send({
                                    message: 'Internal Server Error: ' + error
                                });

                            } else if (!val) { // others++;
                            } else if (val) {
                                var pathArray = val.Description.split('/');
                                var protocol = pathArray[0];
                                var host = pathArray[2];
                                var url = protocol + '//' + host;
                                // console.log(val.Description)
                                console.log(host)
                                urlArray.push(host);
                            }
                            if (count3 == times - 1) {
                                return res.status(200).json({url: urlArray});
                            }
                        });
                    });

                }

            }
        }
    });
}


/**
 * 
 * this function receives a project id and dates 
 * returns project device breakdown
 */

module.exports.getProjectDevices = async (req, res) => {
    if (!req.query.hasOwnProperty("projectID")) 
        return res.status(400).send({message: 'No project ID provided'});
    

    var count4 = 0;

    var min = new Date(req.query.minDate).getTime();
    if (req.query.hasOwnProperty("maxDate")) {
        var max = new Date(req.query.maxDate);
        max.setDate(max.getDate() + 1);
        max = max.getTime()
    } else {
        var max = new Date().getTime();
    }

    var browsers = 0;
    var websites = 0;
    var others = 0;
    var calendar = 0;
    var iot = 0;
    var manual = 0;
    var totalCount = 0;
    var members = 0;
    ProjectHelper.getProject(req.query.projectID, async (err, result) => {
        if (err) {
            return res.status(500).send({
                message: 'Internal Server Error: ' + err
            });
        } else if (!result) {
            return res.status(404).json({message: 'Project not found'});
        } else {
            var teamMembers = result.TeamMembers.length;
            console.log(teamMembers)
            result.TeamMembers.forEach(async function (myDoc) {
                console.log(myDoc)
                UserTimeEntryModel.findOne({
                    UserID: myDoc._id
                }, async (err, result) => {
                    /*members=members+1;
                        console.log(members)*/
                    // console.log(result);
                    if (err) {
                        return res.status(500).send({
                            message: 'Internal Server Error: ' + err
                        });
                    } else if (!result) { // return res.status(404).json({ message: 'No time entries for the given user were found' });
                        members = members + 1;
                        console.log(members)

                        if (members == teamMembers) {
                            return res.status(200).json({
                                Total: totalCount,
                                Browser: browsers,
                                Website: websites,
                                Calendar: calendar,
                                IOT: iot,
                                Manual: manual,
                                Others: others
                            });
                        }
                    } else {

                        var times = result.TimeEntries.length;
                        var count3 = 0;
                        if (times == 0) { // return res.status(404).json({ message: 'No time entries for the given user were found' });
                            members = members + 1;
                            console.log(members)
                            if (members == teamMembers) {
                                return res.status(200).json({
                                    Total: totalCount,
                                    Browser: browsers,
                                    Website: websites,
                                    Calendar: calendar,
                                    IOT: iot,
                                    Manual: manual,
                                    Others: others
                                });
                            }
                        } else {


                            if (req.query.hasOwnProperty("projectID")) { // //redundant
                                var totalEntries = 0;

                                result.TimeEntries.forEach(async function (myDoc) { // console.log(myDoc);
                                    TimeEntryModel.findOne({
                                        _id: myDoc,
                                        ProjectID: req.query.ProjectID,
                                        StartTime: {
                                            $gte: min,
                                            $lte: max
                                        }
                                    }, async (err, val) => {
                                        count3 = count3 + 1;
                                        totalCount = totalCount + 1;
                                        // console.log(count3);
                                        if (err) {
                                            return res.status(500).send({
                                                message: 'Internal Server Error: ' + error
                                            });

                                        } else if (!val) {
                                            others++;
                                        } else if (val) {
                                            console.log("ndani")
                                            if (val.Device == "Browser") {
                                                browsers++;
                                            } else if (val.Device == "Website") {
                                                websites++;
                                            } else if (val.Device == "Google calendar") {
                                                calendar++;
                                            } else if (val.Device == "Manual entry") {
                                                manual++;
                                            } else if (val.Device == "IOT Device") {
                                                iot++;
                                            } else {
                                                others++
                                            }
                                        }
                                        if (count3 == times - 1) { /* return res.status(200).json({Total: count3, Browser: browsers, 
                                                        Website: websites, Calendar:calendar, IOT: iot, Manual: manual, Others: others});*/
                                            count3 = 0;
                                            // console.log("got in")
                                            members = members + 1;
                                            console.log(members)
                                            if (members == teamMembers) {
                                                return res.status(200).json({
                                                    Total: totalCount,
                                                    Browser: browsers,
                                                    Website: websites,
                                                    Calendar: calendar,
                                                    IOT: iot,
                                                    Manual: manual,
                                                    Others: others
                                                });
                                            }

                                        }
                                    });
                                });

                            }

                        }
                    }
                });

                console.log("lalalalalaal")


            });
        }

    });
}


/**
 * receives projectid and dates
 * returns websites and the number of times the users on the project accessed
 * 
 */


module.exports.getProjectWebsites = async (req, res) => {
    if (!req.query.hasOwnProperty("projectID")) 
        return res.status(400).send({message: 'No project ID provided'});
    

    var count4 = 0;

    var min = new Date(req.query.minDate).getTime();
    if (req.query.hasOwnProperty("maxDate")) {
        var max = new Date(req.query.maxDate);
        max.setDate(max.getDate() + 1);
        max = max.getTime()
    } else {
        var max = new Date().getTime();
    }

    var totalCount = 0;
    var members = 0;
    var urlArray = [];
    var websites = [];
    ProjectHelper.getProject(req.query.projectID, async (err, result) => {
        if (err) {
            return res.status(500).send({
                message: 'Internal Server Error: ' + err
            });
        } else if (!result) {
            return res.status(404).json({message: 'Project not found'});
        } else {
            var teamMembers = result.TeamMembers.length;
            console.log(teamMembers)
            result.TeamMembers.forEach(async function (myDoc) { // console.log(myDoc)
                UserTimeEntryModel.findOne({
                    UserID: myDoc._id
                }, async (err, result) => {
                    /*members=members+1;
                        console.log(members)*/
                    // console.log(result);
                    if (err) {
                        return res.status(500).send({
                            message: 'Internal Server Error: ' + err
                        });
                    } else if (!result) { // return res.status(404).json({ message: 'No time entries for the given user were found' });
                        members = members + 1;
                        console.log(members)

                        if (members == teamMembers) {
                            console.log(urlArray);
                        }
                    } else {

                        var times = result.TimeEntries.length;
                        var count3 = 0;
                        if (times == 0) { // return res.status(404).json({ message: 'No time entries for the given user were found' });
                            members = members + 1;
                            console.log(members)
                            if (members == teamMembers) {
                                console.log(urlArray)
                            }
                        } else {


                            var totalEntries = 0;

                            result.TimeEntries.forEach(async function (myDoc) {


                                TimeEntryModel.findOne({
                                    _id: myDoc._id,
                                    ProjectID: req.query.ProjectID,
                                    StartTime: {
                                        $gte: min,
                                        $lte: max
                                    }
                                }, async (err, val) => {
                                    count3 = count3 + 1;

                                    if (err) {
                                        return res.status(500).send({
                                            message: 'Internal Server Error: ' + error
                                        });

                                    } else if (!val) { // others++;
                                    } else if (val) {
                                        var pathArray = val.Description.split('/');
                                        var protocol = pathArray[0];
                                        var host = pathArray[2];
                                        var url = protocol + '//' + host;
                                        urlArray.push(host);
                                    }
                                    if (count3 == times - 1) {


                                        count3 = 0;

                                        var arr = urlArray;
                                        for (var b = 0; b < arr.length; b++) { // take care of all "undefined" - avoid null
                                            if (arr[b] == undefined) {
                                                arr[b] = "others";
                                            }

                                        }

                                        var arrayLength = urlArray.length;
                                        for (var a = 0; a < arrayLength; a++) {

                                            AnalysisHelper.mostVisitedWebsite(arr, async (err, val) => {
                                                console.log(val)

                                                if (val) {
                                                    websites.push(val);
                                                    AnalysisHelper.deleteFromArray(arr, val.element, async (err, result) => {});
                                                }

                                            });

                                            if (arr.length == 1) {
                                                var object = {
                                                    "element": arr[0],
                                                    "number": 1
                                                }
                                                websites.push(object);
                                                members = members + 1;
                                                console.log(members)
                                                if (members == teamMembers) {
                                                    return res.status(200).json({url: websites});
                                                }
                                                break;

                                            }


                                        }


                                    }
                                });


                            });


                        }
                    }
                });

                // console.log("lalalalalaal")


            });
        }

    });
}

