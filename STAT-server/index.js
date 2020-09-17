/**
  * @file STAT-server/index.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file initializes the middleware and starts the server.
  * @date 14 June 2020
 */

/**
* Filename:             STAT-server/index.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   14 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file initializes the middleware and starts the server.
*
*/
require('./config/config');
require('./models/db');
require('./config/passportConfig');
const port = process.env.PORT || 3000

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const routes = require('./routes/index.router');


const application = express();

// middleware
application.use(bodyParser.json());
application.use(cors());
application.use(passport.initialize());
application.use('/api', routes);

application.listen(port), ()=>{
  console.log("Server started");
}; 


/*
// error handler
application.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    
});*/

// start server
/*const mongoose = require('mongoose');
var server
exports.listen = function (){
    server = application.listen("3000", function () {
    console.log('Server available listening at: 3000');
    })
 };

exports.close = function () {
    server.close(function (){
      console.log('Server Closed')
    }); 
    mongoose.connection.close()
};*/

  /*application.get('/', (req, res) => {
    var valErrors = [1,2,3,4,5,6];
    res.status(200).send(valErrors)
  }); */