/**
  * @file STAT-server/tracker/calendar/googleCalendar.manager.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles the requests regarding Google Calendar API. 
  * @date 27 July 2020
 */

/**
* Filename:             STAT-server/tracker/calendar/googleCalendar.manager.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   27 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles the requests regarding Google Calendar API. 
*
*/
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const CREDENTIAL_PATH = './config/credentials.json';


/**
 * Gets all the events from your calender
 * @param {HTTP-Request} req 
 * @param {Function} done Return to this function when done
 */
module.exports.getEvents = (req, done) => {  
  fs.readFile(CREDENTIAL_PATH, (err, content) => {

    if (err) {
      done(err);
    }
    // Authorize a client with credentials, then call the Google Calendar API.
    const calendarCredentials = JSON.parse(content);
    
    let auth = new google.auth.OAuth2(
      calendarCredentials.web.client_id,
      calendarCredentials.web.client_secret,
      calendarCredentials.web.redirect_uris[0]
    );

    let credentials = {
      access_token: req.body.accessToken,
      token_type: req.body.tokenType, 
      refresh_token: req.body.accessToken,
      expiry_date: req.body.expiryDate
    };
    auth.setCredentials(credentials);

    //Get events on calendar
    var minDate=new Date();
    var maxDate=new Date();
    //date.setDate(date.getDate() - 7)
    ///console.log( date.toISOString());
    //console.log((new Date( date.setDate(date.getDate() - 7) )).toISOString());
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date( minDate.setDate(minDate.getDate() - 7) )).toISOString(),
      timeMax:maxDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        done(err);
      }
      const events = res.data.items;
      if (events.length) {
        console.log(events);
        var EventList = [];
        
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          const end = event.end.dateTime || event.end.date;
          var EventItem= {
              'event': event.summary,
              'startTime': start,
              'endTime': end,
              'id': event.id
          }
          EventList.push(EventItem);
        });
        done(null, EventList);
      } 
      else {
        done(null, false);
      }
    });  
  });
}

/**
 * This function gets the appropriate credentials for the Google API authentication
 * @param {Function} done Return to this function when done
 */
 module.exports.getCredentials = (done) => {
  fs.readFile(CREDENTIAL_PATH, (err, content) => {
    if (err) {
      done(err);
    }
    // Authorize a client with credentials, then call the Google Calendar API.
    const credentials = JSON.parse(content);
    returnBody = {clientId: credentials.web.client_id, apiKey: credentials.web.api_key, scopes: SCOPES };
    done(null, returnBody);    
  });
}
