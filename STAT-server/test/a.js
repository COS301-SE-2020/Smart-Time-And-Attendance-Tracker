var server = require ('../index.js'),
    assert = require ('assert'),
    http = require ('http');
var port = 8085;

let chai =require('chai')
let chaiHttp =require('chai-http');

let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)
const request = require("supertest");

//server.listen();


//require ('./project.js')
//require ('./cover.js')
//require ('./test')
//require ('./userTimeEntries')
//require ('./z.js')


describe('test file 1', function() {

    before(function () {
       server.listen();
    });

    after(function () {
        server.close();
    }); 

    
    describe('test USER', function() {
      require ('./test.js')
    })

    describe('test USER TIME ENTRIES', function() {
      require ('./userTimeEntries.js')
    })

    describe('test PROJECT', function() {
      require ('./project.js')
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
