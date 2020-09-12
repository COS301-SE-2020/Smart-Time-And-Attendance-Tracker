/**
  * @file STAT-server/iotManager/iotdevice.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the IOT Device  model in our database
  * @date 19 August 2020
 */

/**
* Filename:             STAT-server/iotManager/iotdevice.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   19 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the IOT Device  model in our database
*
*/ 

const mongoose = require("mongoose");
const IOTDeviceModel = mongoose.model("IOTDevice");



/**
 * This function registers an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address
 * @param {HTTP Response} res 
 */
module.exports.register = (req, res) => {
    if(!req.body.hasOwnProperty("deviceName"))
        return res.status(400).send({message: 'No device name provided'});
    if(!req.body.hasOwnProperty("macAddress"))
        return res.status(400).send({message: "No device's Mac address ID provided"});

    IOTDeviceModel.findOne({MACAddress : req.body.macAddress, DeviceName : req.body.deviceName}, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
        {
            var now = new Date;
            var IOTDevice = new IOTDeviceModel();
            IOTDevice.DeviceName = req.body.deviceName;
            IOTDevice.MACAddress = req.body.macAddress;
            IOTDevice.RegisteredBy = req.ID;
            if(req.body.hasOwnProperty("description"))
                IOTDevice.Description = req.body.description;
            IOTDevice.RegisteredOn = (now.toISOString().slice(0,10)).replace(/-/g,"/");
            IOTDevice.save((err, doc) => {
                if(!err){
                    return res.status(200).json({ IOTDeviceID : doc._id, message: 'IOT Device successfully registered.' });
                }
                else{
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
            });
        }
        else
        {
            IOTDeviceModel.updateOne({_id : result._id},{DeregisteredOn:"", DeregisteredBy : null }, function(err, result) {
                if(err) 
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else if (!result)
                    return res.status(404).send({message: 'IOT Device not found'});
                else
                    return res.status(200).send({message: 'Re-registered IOT Device'});                
            });
        }
    });
    // check if device is registered, activate it again
}


/**
 * This function deregisters an IOT Device from the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 */
module.exports.deregister = (req, res) => {
    var now = new Date;
    var date = (now.toISOString().slice(0,10)).replace(/-/g,"/");

    if(req.body.hasOwnProperty("deviceName") && req.body.hasOwnProperty("macAddress"))
    {
        IOTDeviceModel.findOne({MACAddress : req.body.macAddress, DeviceName : req.body.deviceName}, function(err, result) {
            if(err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
                return res.status(404).send({message: 'Project not found'});
            else if(result.DeregisteredBy == null && result.DeregisteredOn == "")
            {
                IOTDeviceModel.updateOne({_id : result._id},{DeregisteredOn:date, DeregisteredBy : req.ID }, function(err, result) {
                    if(err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else if (!result)
                        return res.status(404).send({message: 'IOT Device not found'});
                    else
                        return res.status(200).send({message: 'Deregistered IOT Device'});                
                });
            }
            else
                return res.status(200).send({message: 'Device already deregistered'});   
        });
    }
    else if(req.body.hasOwnProperty("deviceID"))
    {
        IOTDeviceModel.findOne({_id : req.body.deviceID}, function(err, result) {
            if(err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
                return res.status(404).send({message: 'Project not found'});
            else if(result.DeregisteredBy == null && result.DeregisteredOn == "")
            {
                IOTDeviceModel.updateOne({_id : req.body.deviceID},{DeregisteredOn:date, DeregisteredBy : req.ID }, function(err, result) {
                    if(err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else if (!result)
                        return res.status(404).send({message: 'IOT Device not found'});
                    else
                        return res.status(200).send({message: 'Deregistered IOT Device'});                
                });
            }
            else
                return res.status(200).send({message: 'Device already deregistered'});                
        });
    }
    else
        return res.status(400).send({message: 'No project ID provided or device MAC Address provided'});

    
}


/**
 * This function returns all an IOT Devices registered with the organisation
 * @param {HTTP Request} req Request body - empty
 * @param {HTTP Response} res 
 */
module.exports.getAllDevices = (req, res) => {
    IOTDeviceModel.find({  DeregisteredBy : null, DeregisteredOn : ""},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No IOT devices found' }); 
        else
        {
            devices=[];
            for(var a=0; a<result.length; a++)
            {
                devices.push({'ID' : result[a]._id, 'deviceName' : result[a].DeviceName, 'macAddress' : result[a].MACAddress, 'description': result[a].Description});
                    
                if(devices.length == result.length)
                    return res.status(200).json({ iotDevices: devices});        
            }
        }
    });
}


/**
 * This function lets the IOT Device to stop the timer.
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID, AND user's id(the user being tracked)
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.stopTimer = (req, res, next) => {
    //change req.ID
    if(!req.body.hasOwnProperty("timeEntryID"))
        return res.status(400).send({message: 'No time entry ID provided'});

    if(!req.body.hasOwnProperty("userID"))
        return res.status(400).send({message: 'No user ID provided'});

    if(req.body.hasOwnProperty("deviceName") && req.body.hasOwnProperty("macAddress"))
    {
        IOTDeviceModel.findOne({MACAddress : req.body.macAddress, DeviceName : req.body.deviceName}, function(err, result) {
            if(err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
                return res.status(404).send({message: 'IOT Device not found'});
            else if(result.DeregisteredBy == null && result.DeregisteredOn == "")
            {
                req.body.endTime = new Date().getTime();
                req.ID = req.body.userID;
                next();
            }
            else
                return res.status(200).send({message: 'Device is deregistered'});   
        });
    }
    else if(req.body.hasOwnProperty("deviceID"))
    {
        IOTDeviceModel.findOne({_id : req.body.deviceID}, function(err, result) {
            if(err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
                return res.status(404).send({message: 'IOT Device not found'});
            else if(result.DeregisteredBy == null && result.DeregisteredOn == "")
            {
                req.body.endTime = new Date().getTime();
                req.ID = req.body.userID;
                next();
            }
            else
                return res.status(200).send({message: 'Device is deregistered'});                
        });
    }
    else
        return res.status(400).send({message: 'No device ID or device MAC Address provided'});
}

/**
 * This function let the IOT Device to start the timer is started.
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID, AND user's id(the user being tracked)
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.startTimer = (req, res, next) => {
    //change req.ID
    if(!req.body.hasOwnProperty("userID"))
        return res.status(400).send({message: 'No user ID provided'});
    var now = new Date;
    var date = (now.toISOString().slice(0,10)).replace(/-/g,"/");

    if(req.body.hasOwnProperty("deviceName") && req.body.hasOwnProperty("macAddress"))
    {
        IOTDeviceModel.findOne({MACAddress : req.body.macAddress, DeviceName : req.body.deviceName}, function(err, result) {
            if(err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
                return res.status(404).send({message: 'IOT Device not found'});
            else if(result.DeregisteredBy == null && result.DeregisteredOn == "")
            {
                req.body.date = date;
                req.body.startTime = now;
                req.body.endTime = now;
                req.body.description =  req.body.deviceName;
                req.body.device = req.body.macAddress;
                req.ID = req.body.userID;
                next();
            }
            else
                return res.status(200).send({message: 'Device is deregistered'});   
        });
    }
    else if(req.body.hasOwnProperty("deviceID"))
    {
        IOTDeviceModel.findOne({_id : req.body.deviceID}, function(err, result) {
            if(err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
                return res.status(404).send({message: 'IOT Device not found'});
            else if(result.DeregisteredBy == null && result.DeregisteredOn == "")
            {
                req.body.date = date;
                req.body.startTime = now;
                req.body.endTime = now;
                req.body.description = result.DeviceName;
                req.body.device = result.MACAddress;
                req.ID = req.body.userID;
                next();
            }
            else
                return res.status(200).send({message: 'Device is deregistered'});                
        });
    }
    else
        return res.status(400).send({message: 'No device ID or device MAC Address provided'});
}
