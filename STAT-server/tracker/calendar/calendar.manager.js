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
const googleCalendar = require('googleCalendar.manager');

/**
 * This function gets credentials for the appropriate calendar application
 * @param {HTTP Request} req Request - ID of user
 * @param {HTTP Response} res 
 * @param {Function} next The next function to call
 * @return {Http Response} - Value of Authenticated attribute or an error message
 */
module.exports.getCalendarCredentials = (req, res) => {
    if(!req.query.hasOwnProperty('calendar'))
        return res.status(400).send({message: 'No calendar application specified'});
    else
    {
        if((req.query.calendar).toLower() == "google")
            googleCalendar.getCredentials();
    }
}