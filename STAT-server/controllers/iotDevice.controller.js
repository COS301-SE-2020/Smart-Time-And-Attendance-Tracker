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
}


/**
 * This function deregisters an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.deregister = (req, res, next) => {
    var now = new Date;

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
}


/**
 * This function deregisters an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.getAllDevices = (req, res, next) => {
    var now = new Date;

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
}


/**
 * This function deregisters an IOT Device with the organisation
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.stopTimer = (req, res, next) => {
    var now = new Date;

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
}

/**
 * This function let the IOT Device to start the timer is started.
 * @param {HTTP Request} req Request body - IOT Devices's name, IOT Devices's MAC address OR IOTDevice ID
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.startTimer = (req, res, next) => {
    var now = new Date;

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
}