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
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../config/token.json';
const CREDENTIAL_PATH = '../config/credentials.json';

/**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback, res) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, res);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client, res);
    });
  }

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, res) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.status(200).json({message: 'Authorize this app by visiting this url.', url: authUrl, oAuth2Client: oAuth2Client});
    return;
  }

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, response) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
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
        var EventItem= {
            'Event': event.summary,
            'Time': start
        }
        EventList.push(EventItem);
      });
      response.status(200).json({message: 'Upcoming 10 events:' , Events: EventList});
    } 
    else {
      response.status(200).json({message: 'No upcoming events found.'});
      return 
    }
  });
}


/**
 * Gets all the events from your calender
 * @param {HTTP-Request} req 
 * @param {HTTP-Response} res 
 */
module.exports.getEvents = (req, res) => {  
    // Load client secrets from a local file.
    fs.readFile(CREDENTIAL_PATH, (err, content) => {
      if (err) 
      {
        res.status(400).json({message: 'Error loading client secret file', error: err});
        return;
      }
      // Authorize a client with credentials, then call the Google Calendar API.
      authorize(JSON.parse(content), listEvents, res);
    });
  }

/**
 * 
 * @param {HTTP-Request} req HTTP Request Body - authentication code
 * @param {HTTP-Response} response 
 */
module.exports.authenticate = (req, response) => {
  var code = (req.body.code);
  fs.readFile('credentials.json', (err, content) => {
    if (err) {
      response.status(400).json({message: 'Error loading client secret file. ' + err});
      return;
    }
    // Authorize a client with credentials, then call the Google Calendar API.
    const credentials = JSON.parse(content);
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.getToken(code, (err, token) => {
      if (err) 
      {
        response.status(400).json({message: 'Error retrieving access token', error: err});
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) 
        {
          response.status(400).json({message: 'Error', error: err});
          return;
        }
        console.log('Token stored to', TOKEN_PATH);
        listEvents(oAuth2Client, response);
      });
    });
  });
}
