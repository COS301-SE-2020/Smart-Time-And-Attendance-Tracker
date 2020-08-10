/**
  * @file STAT-server/calendar/googleCalendar.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles some of the requests regarding Google Calendar API. 
  * @date 27 July 2020
 */

/**
* Filename:             STAT-server/calendar/googleCalendar.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   27 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding Google Calendar API. 
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
 * @param {HTTP-Response} res 
 */
module.exports.getEvents = (req, response) => {  
  fs.readFile(CREDENTIAL_PATH, (err, content) => {

    if (err) {
      response.status(400).json({message: 'Error loading credentials. ' + err});
      return;
    }
    // Authorize a client with credentials, then call the Google Calendar API.
    const calendarCredentials = JSON.parse(content);
    
    let auth = new google.auth.OAuth2(
      calendarCredentials.web.client_id,
      calendarCredentials.web.client_secret,
      calendarCredentials.web.redirect_uris[0]
    );

    let credentials = {
      access_token: req.query.accessToken,
      token_type: req.query.tokenType, 
      refresh_token: req.query.accessToken,
      expiry_date: req.query.expiryDate
    };
    auth.setCredentials(credentials);

    //Get events on calendar
    var date=new Date();
    //date.setDate(date.getDate() - 7)
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date( date.setDate(date.getDate() - 7) )).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        response.status(400).json({message: 'The API returned an error: ' + err});
        return;
      }
      const events = res.data.items;
      if (events.length) {
        var EventList = [];
        
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          const end = event.end.dateTime || event.end.date;
          var EventItem= {
              'Event': event.summary,
              'StartTime': start,
              'EndTime': end
          }
          EventList.push(EventItem);
        });
        response.status(200).json({message: 'Upcoming events:' , Events: EventList});
      } 
      else {
        response.status(200).json({message: 'No upcoming events found.'});
        return 
      }
    });  
  });
}

/**
 * 
 * @param {HTTP-Request} req HTTP Request Body - authentication code
 * @param {HTTP-Response} response 
 */
 module.exports.getCredentials = (req, response) => {
  fs.readFile(CREDENTIAL_PATH, (err, content) => {
    if (err) {
      response.status(400).json({message: 'Error loading credentials. ' + err});
      return;
    }
    // Authorize a client with credentials, then call the Google Calendar API.
    const credentials = JSON.parse(content);
    response.status(200).json({clientId: credentials.web.client_id, apiKey: credentials.web.api_key, scopes: SCOPES });    
  });
}
