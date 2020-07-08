login();
const token = "";
const name = "";
const surname = "";

function login() {
    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/user/login';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var data = JSON.parse(http.responseText);
            token = data.token;
            // get user name and surname using token and store in maybe a cookie
        }
        else {
            console.log(http.responseText);     //error => should not track time if user not logined
        }
    }
    var text = '{ "email":"tester1@gmail.com" , "password":"Abcd@1234" }';
    http.send(text);
} 


function AddTimeEntry(url,startTime, endTime) {
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
            return true;
        }
        else {  //error in recording time
            console.log(http.responseText);
            return false;
        }
    }
    http.send(text);
}

function isString(str) {
    return typeof str == "string";
}