login();
var token = "";
function login() {
    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/user/login';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDA3NDI5ZjFjYzlhNDViYzk4YjQ5YSIsImF1dGhlbnRpY2F0ZSI6dHJ1ZSwicm9sZXMiOls1LDNdLCJpYXQiOjE1OTM4NjY1MzYsImV4cCI6MTU5Mzk1MjkzNn0.Gzj8FIIcmyQHaEUXZBSQF7fVez1_41gz42DIY-xNQcs");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            token = data.token;
        }
        else if(http.readyState == 4 && http.status == 500) {
            console.log(http.responseText);
        }
        else if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
        }
    }
    var text = '{ "email":"tester1@gmail.com" , "password":"Abcd@1234" }';
    http.send(text);
} 


function AddTimeEntry(url,startTime, endTime) {
    console.log("startTime " + startTime.getTime() + "   endTime " + endTime.getTime());
    var http = new XMLHttpRequest();
    var apiURL = 'http://localhost:3000/api/userTimeEntry/addTimeEntry';
    var text = '{ "Description": "'+ url + '",'
        + '"StartTime": "'+ startTime.getTime() + '",' 
        + '"EndTime": "'+ endTime.getTime() + '",' 
        + '"TaskID": "abcd1234",' 
        + '"Device": "Browser",' 
        + '"Date": "'+ new Date() + '"' 
        + '}';

    http.open('POST', apiURL, true);

    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token "+token);
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
        }
        else if(http.readyState == 4 && http.status == 500) {
            console.log(http.responseText);
        }
    }
    http.send(text);
}

function isString(str) {
    return typeof str == "string";
}