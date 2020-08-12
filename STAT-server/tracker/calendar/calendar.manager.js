/**
  * @file STAT-server/tracker/calendar/calendar.manager.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles the requests regarding Calendar applications. 
  * @date 11 August 2020
 */

/**
* Filename:             STAT-server/tracker/calendar/calendar.manager.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles the requests regarding Calendar applications. 
*
*/
const googleCalendar = require('./googleCalendar.manager');
const mongoose = require("mongoose");
const calendarModel = mongoose.model("calendarEvents");
/**
 * This function gets credentials for the appropriate calendar application
 * @param {HTTP Request} req Request - ID of user
 * @param {HTTP Response} res 
 */
module.exports.getCredentials = (req, res) => {
    if(!req.query.hasOwnProperty('calendar'))
        return res.status(400).send({message: 'No calendar application specified'});
    else
    {
        if((req.query.calendar).toLowerCase() == "google")
        {
            googleCalendar.getCredentials((err,val)=>
            {
                if(err)
                    return res.status(500).json({message: 'Internal server error: ' + err});
                else 
                    return res.status(200).json(val);
            });
        }
        else
            return res.status(400).send({message: 'Invalid calendar application specified'});
    }
}

/**
 * This function gets events for the last week for the appropriate calendar application
 * @param {HTTP Request} req Request - ID of user
 * @param {HTTP Response} res 
 */
module.exports.getEvents = (req, res) => {  
    if(!req.body.hasOwnProperty('calendar'))
        return res.status(400).send({message: 'No calendar application specified'});
    else
    {
        if((req.body.calendar).toLowerCase() == "google")
        {
            googleCalendar.getEvents(req,(err,val)=>
            {
                if(err)
                    return res.status(500).json({message: 'Internal server error: ' + err});
                else if(val == false)
                    return res.status(404).json({message: 'No events found'});
                else
                {
                    removeDuplicateEvents(val, (err,val)=>
                    {
                        if(err)
                            return res.status(500).json({message: 'Internal server error: ' + err});
                        else
                            return response.status(200).json({ events: val});
                    });

                }
            });
        }
        else
            return res.status(400).send({message: 'Invalid calendar application specified'});
    }
}
/**
 * This function checks the database for duplicate events, adds new events and removes events older than a week
 * @param {HTTP Request} req Request - ID of user
 * @param {HTTP Response} res 
 */
removeDuplicateEvents = (events) =>
{
    for(a in events)
    {
        calendarModel.findOne({ID :a.id}, {StartTime: 1},(err, result) => {
            if (err) 
                return res.status(500).send({message: 'Internal Server Error: ' + err});
            else if (!result)
            {
                var entry = new calendarModel();
                entry.ID= a.id;
                entry.Endtime = a.endTime;

                entry.save((err, doc) => {
                    if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                });
            }
            else
            {
                
            }
        });
    }

}