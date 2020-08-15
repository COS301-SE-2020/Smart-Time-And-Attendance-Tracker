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
const calendarModel = mongoose.model("userCalendarSyncing");
const trackerManager = require('../tracker.manager'); 
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
module.exports.syncEvents = async(req, res) => {  
    if(!req.body.hasOwnProperty('calendar'))
        return res.status(400).send({message: 'No calendar application specified'});
    else
    {
        if((req.body.calendar).toLowerCase() == "google")
        {
            googleCalendar.getEvents(req, async(err,entries,date)=>
            {
                if(err)
                    return res.status(500).json({message: 'Internal server error: ' + err});
                else if(entries == false)
                    return res.status(404).json({message: 'No events found'});
                else
                {
                    updateLastSynced(req.ID, date, async (err,val)=>
                    {
                        if(err)
                            return res.status(500).json({message: 'Internal server error: ' + err});
                        else
                        {
                            try {
                                const  final = await trackerManager.addTimeEntries(entries, req.ID);
                                return res.status(200).json({message: 'Calendar successfully synced'});
                            } catch (error) {
                                return res.status(500).send({message: 'Internal Server Error: ' + err})
                            }

                        }
                    });

                }
            });
        }
        else
            return res.status(400).send({message: 'Invalid calendar application specified'});
    }
}
/**
 * This function gets the last synced time.
 * @param {HTTP Request} req Request - ID of user
 * @param {HTTP Response} res 
 * @param {Function} next The next function on the route 
 */
module.exports.getLastSynced = (req,res,next) =>
{
    calendarModel.findOne({UserID :req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
        {
            var entry = new calendarModel();
            entry.UserID= req.ID;
            entry.LastSynced = null;
            entry.save((err, doc) => {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else
                {
                    req.lastSynced = null;
                    next();
                }
            });
        }
        else
        {
            req.lastSynced = result.LastSynced;
            next();
        }

    });

}

/**
 * This function updates the last synced time.
 * @param {String} id ID of user
 * @param {String} date New date
 * @param {Function} done Function to return to after execution
 */
updateLastSynced = (id,date,done) =>
{
    calendarModel.updateOne({UserID :id},{LastSynced: date},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (result.n==0)
            return res.status(404).send({message: 'User not found'});
        else
            done();

    });

}