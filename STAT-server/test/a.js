var server = require ('../index.js')
var assert = require ('assert')
//var http = require ('http');


let chai =require('chai')
let chaiHttp =require('chai-http');

let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)
const request = require("supertest");

//server.listen();
//const mongoose = require('mongoose');
/*require("../config/config.js");

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'); }
    else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
});
*/
//require ('./project.js')
//require ('./cover.js')
//require ('./test')
//require ('./userTimeEntries')
//require ('./z.js')


describe('test file 1', function() {
/*
    before(function () {
       server.listen();
    });

    after(function () {
        server.close();
    }); 
*/

    
    describe('test USER', function() {
     // require ('./user.js')
    })
    describe('test PROJECT', function() {
       // require ('./project.js')
      })
    describe('test USER TIME ENTRIES', function() {
       // require ('./userTimeEntries.js')
      })
    describe('test TEAM', function() {
       // require ('./team.js')
      })
    describe('test TASK', function() {
        //require ('./task.js')
      })
    describe('iotDevice', function() {
        require ('./iotDevice.js')
      })
    /*

    describe('test USER TIME ENTRIES', function() {
      require ('./userTimeEntries.js')
    })

  

    describe('test TEAM', function() {
      require ('./team.js')
    })

    describe('test ROLE', function() {
      require ('./role.js')
    })

    describe('test ROLE', function() {
      require ('./task.js')
    })

  

    describe('iotDevice', function() {
        require ('./iotDevice.js')
      })
*/


      
   /*
    
      describe('test file 2', function() {
        require ('./cover.js')
      })
    
      describe('test file 2', function() {
        require ('./userTimeEntries.js')
      })
    
      describe('test file 2', function() {
        require ('./z.js')
        //server.close();
      })
*/

  })