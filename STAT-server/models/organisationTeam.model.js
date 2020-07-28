/**
  * @file STAT-server/models/organisationTeam.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the Organisation Team model in our database
  * @date 28 June 2020
 */

/**
* Filename:             STAT-server/models/organisationTeam.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   28 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Organisation Team model in our database
*
*/
const mongoose = require("mongoose")

var OrganisationTeamSchema = new mongoose.Schema({
    TeamMembers:[
        { 
            _id : {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            Role: {
                type: String
            }
        }
    ],
});

mongoose.model("organisationTeams", OrganisationTeamSchema);