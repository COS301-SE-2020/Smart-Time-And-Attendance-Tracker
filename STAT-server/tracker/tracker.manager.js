/**
  * @file STAT-server/tracker/tracker.manager.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file processes time entry requests.  
  * @date 11 August 2020
 */

/**
* Filename:             STAT-server/tracker/tracker.manager.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file processes time entry requests. 
*
*/
const userTimeEntry = require('../controllers/userTimeEntry.controller');

/**
 * This function gets events for the last week for the appropriate calendar application
 * @param {Array} entries An array with the time entries to add.
 * @param {String} id The user's ID.
 */
module.exports.addTimeEntries = async (entries, id)=> {
  return new Promise(function(resolve, reject) { 
      entries.forEach((entry) => { 
        var date = new Date(entry['startTime']);
        entry['date']= (date.toISOString().slice(0,10)).replace(/-/g,"/");
        entry['activeTime']= Math.floor((entry['endTime']-entry['startTime']) /60000);
        userTimeEntry.addTimeEntryFromManager(entry,id).then((result) => {}).catch((err) => reject(err));
      });
      Promise.all(entries).then((result) => {
          resolve();  
      }).catch((err) => reject(err));
  });
}

