/**
  * @file STAT-server/config/config.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles the processing of the environment variables.
  * @date 14 June 2020
 */

/**
* Filename:             STAT-server/helper/config.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   14 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles the processing of the environment variables.
*
*/

// check env.
var env = process.env.NODE_ENV || 'development';
// fetch env. config
//var config = require('./config.json');
var config = require('./conf.json'); 
var envConfig = config[env];
// add env. config values to process.env
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
