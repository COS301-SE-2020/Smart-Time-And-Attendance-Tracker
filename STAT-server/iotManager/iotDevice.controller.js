/**
  * @file STAT-server/controllers/project.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the Project model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/controllers/project.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the Project model in our database
*
*/ 

const mongoose = require("mongoose");
const IOTDeviceModel = mongoose.model("IOTDevice");



/**
 * This function registers an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.register = (req, res, next) => {
    var now = new Date;
    //console.log(req.ID);
    //console.log(req.body);
    var IOTDevice = new IOTDeviceModel();
    IOTDevice.DeviceName = req.body.deviceName;
    IOTDevice.MACAddress = req.body.macAddress;
    IOTDevice.RegisteredBy = req.ID;
    IOTDevice.RegisteredOn = (now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate());
    IOTDevice.save((err, doc) => {
        if(!err){
            return res.status(200).json({ IOTDeviceID : doc._id, message: 'IOT Device successfully registered.' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })

    // check if device is registered, activate it again
}


/**
 * This function deregisters an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.deregister = (req, res, next) => {
    var now = new Date;
    var date = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate();

    if(req.body.deviceName && req.body.macAddress)
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
    else if(req.body.deviceID)
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
 * This function deregisters an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.getAllDevices = (req, res, next) => {
    IOTDeviceModel.find({  DeregisteredBy : null, DeregisteredOn : ""},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No IOT Device found' }); 
        else
        {
            devices=[];
            console.log(result);
            for(var a=0; a<result.length; a++)
            {
                devices.push({'ID' : result[a]._id, 'deviceName' : result[a].DeviceName, 'macAddress' : result[a].MACAddress});
                    
                if(devices.length == result.length)
                    return res.status(200).json({ iotDevices: devices});        
            }
        }
    });
}


/**
 * This function deregisters an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.stopTimer = (req, res, next) => {
    // var now = new Date;

    // var IOTDevice = new IOTDeviceModel();
    // IOTDevice.DeviceName = req.body.deviceName;
    // IOTDevice.MACAddress = req.body.macAddress;
    // IOTDevice.RegisteredBy = req.ID;
    // IOTDevice.RegisteredOn = (now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate());
    // IOTDevice.save((err, doc) => {
    //     if(!err){
    //         return res.status(200).json({ IOTDeviceID : doc._id, message: 'IOT Device successfully registered.' });
    //     }
    //     else{
    //         return res.status(500).send({message: 'Internal Server Error: ' + err});
    //     }
    // })
}

/**
 * This function let the IOT Device to start the timer is started.
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.startTimer = (req, res, next) => {
    // var now = new Date;

    // var IOTDevice = new IOTDeviceModel();
    // IOTDevice.DeviceName = req.body.deviceName;
    // IOTDevice.MACAddress = req.body.macAddress;
    // IOTDevice.RegisteredBy = req.ID;
    // IOTDevice.RegisteredOn = (now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate());
    // IOTDevice.save((err, doc) => {
    //     if(!err){
    //         return res.status(200).json({ IOTDeviceID : doc._id, message: 'IOT Device successfully registered.' });
    //     }
    //     else{
    //         return res.status(500).send({message: 'Internal Server Error: ' + err});
    //     }
    // })
}