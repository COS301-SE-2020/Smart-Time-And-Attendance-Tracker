var token = "";
var name = "";
var surname = "";
var status=false; 
var userLogin = document.getElementById("login");

var userName="";
    ///////check if name and token exist - if not keep showing form -if they do, hide form and move on
  if (document.cookie.indexOf('name') > -1 && document.cookie.indexOf('token') > -1) {
      //cookie exists - hide form
      getProjects();
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("popup").style.display = "block";
      document.getElementById("userName").innerHTML=getCookie("name");
      document.getElementById("userEmail").innerHTML=getCookie("email");
      document.getElementById("errorMessage").innerHTML= "";

      displayButton();
  }
  else{  ///hide everything except the login form
      document.getElementById("errorMessage").innerHTML= "Login to start tracking";
      document.getElementById("popup").style.display = "none";
  }
  userLogin.onclick = function(){
        console.log("sdvdsdfsdf");
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/user/login';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                ////set name and token into cookies
                console.log(data);
                setCookie("token", data.token, 1);
                window.localStorage.setItem('token', data.token);
                setCookie("name", data.name, 1);
                setCookie("email", data.email, 1);
                console.log(data);
                setCookie("stop", "false", 1); 
                document.getElementById("userName").innerHTML=data.name;
                document.getElementById("userEmail").innerHTML=data.email;
                document.getElementById("loginForm").style.display = "none";
                document.getElementById("popup").style.display = "block";
                document.getElementById("errorMessage").innerHTML= "";
                /////look for name 
                getUserName();
                /////get tasks to display
                getProjects();
                ///show start and stop buttons
                 setInterval(showTime, 1000);
                ////start tracking
                ////show starts and stop
                 displayButton();
                 for(tabID in chrome.extension.getBackgroundPage().History) {
                    alert("tab ID " + tabID);
                    chrome.extension.getBackgroundPage().History[tabID][0][0] = 0;

                    if(chrome.extension.getBackgroundPage().History[tabID][0][2] == "")
                    {
                      var displayDuration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID));
                      AddTimeEntry(url, now, new Date(), tabID, displayDuration);
                    }
                 }
            }
            else {
                   var data = JSON.parse(http.responseText);
                   document.getElementById("errorMessage").innerHTML=data.message;
                   console.log(data);
            }
        }
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        console.log(password);
        console.log(email);
        var userData = '{ "email": "'+ email + '",' + '"password": "'+ password + '"' +'}';
        console.log(userData);
        http.send(userData);
}

/////get name and email
function getUserName(){
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/user/getName';
        http.open('GET', url, true);
        http.setRequestHeader('Authorization', `Bearer ${getCookie("token")}` );
        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                console.log(data);
                //setCookie("token", data.token, 1);
                setCookie("name", data.name, 1);
                setCookie("email", data.surname, 1);
                console.log(data);
                //alert(http.responseText);
                console.log("token");
                document.getElementById("userName").innerHTML=data.name;
                document.getElementById("userEmail").innerHTML=data.surname;
            }
            else {
                   var data = JSON.parse(http.responseText);
                   document.getElementById("errorMessage").style.display="block";
                   document.getElementById("errorMessage").innerHTML=data.message;
                   
                   console.log(data);
            }
        }
        http.send();
}

var stopStartBtn = document.getElementById("start_stop");

function AddTimeEntry(url,startTime, endTime,currentID, duration ) {
  var http = new XMLHttpRequest();
  var apiURL = 'http://localhost:3000/api/userTimeEntry/addTimeEntry';
  var text = '{ "description": "'+ url + '",'
          + '"startTime": "'+ startTime.getTime() + '",' 
          + '"endTime": "'+ endTime.getTime() + '",' 
          + '"device": "Browser",' 
          + '"projectName": "Un-specified",' 
          + '"taskName": "Un-specified",' 
          + '"activeTime": 0,' 
          + '"ActiveTime":' + duration + ',' 
          + '"date": "'+ new Date() + '"' 
          + '}';

  http.open('POST', apiURL, true);

  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader("authorization", "token "+ getCookie("token"));
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      const obj = JSON.parse(http.responseText);
      chrome.extension.getBackgroundPage().History[currentID][0][2] = obj.timeEntryID;
      window.localStorage.setItem('currentlyTracking', obj.timeEntryID);
    }
    else if(http.readyState == 4 && http.status != 200) {  //error in recording time
      AddTimeEntry(url, startTime, endTime, currentID, duration);
    }
  }
  http.send(text);
}

function UpdateTimeEntry(endTime,currentID, duration) {
  alert("updaing time entry  " + duration);
  alert(chrome.extension.getBackgroundPage().History[currentID][0][2]);
  var http = new XMLHttpRequest();
  var apiURL = 'http://localhost:3000/api/userTimeEntry/updateTimeEntry';
  var text = '{'
          + '"timeEntryID": "'+ chrome.extension.getBackgroundPage().History[currentID][0][2] + '",'  
          + '"endTime": "'+ endTime.getTime() + '",'  
          + '"activeTime":'+ duration  
          + '}';

  http.open('POST', apiURL, true);
  alert(text);
  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader("authorization", "token "+ getCookie("token"));
  http.onreadystatechange = function() {
    alert(http.readyState + "  " + http.status);
    if(http.readyState == 4 && http.status == 200) {
      const obj = JSON.parse(http.responseText);
      alert("message :   " + obj.message);
      stopStartBtn.name = "start";
                stopStartBtn.innerHTML = "Start";
                setCookie("historyTime"+currentID, duration, 1);        
                chrome.extension.getBackgroundPage().History[currentID][0][2] = "";  
                chrome.extension.getBackgroundPage().History[currentID][0][3] = "true"; 
                chrome.extension.getBackgroundPage().History[currentID][0][0] = "0";
    }
    else if(http.readyState == 4 && http.status != 200) {  //error in recording time
      alert(http.responseText);              
    }
  }
  http.send(text);
}

function getProjects() {
  tasksDropdown = document.getElementById("tasks");
  if(tasksDropdown.childElementCount == 0)
  {
    var http = new XMLHttpRequest();
    var apiURL = 'http://localhost:3000/api/user/getProjects';

    var text = '{ "token": "'+ getCookie("token") + '"' + '}';
    http.open('GET', apiURL, true);

    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token "+getCookie("token"));
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            const obj = JSON.parse(http.responseText);
            for( p in obj.projects)
            {
              var opt = document.createElement('option');
              opt.appendChild( document.createTextNode("Project " + obj.projects[p].projectName + " - Task un-specified"));
              var val = '{'
              + '"projectID": "'+ obj.projects[p].ID + '",'  
              + '"projectName": "'+ obj.projects[p].projectName + '",'  
              + '"taskID": "",'
              + '"taskName": ""' 
              + '}';
              opt.value = val;
              tasksDropdown.appendChild(opt); 

              if(obj.projects[p].tasks.length != 0)
              {
                for( t in obj.projects[p].tasks)
                {
                  opt = document.createElement('option');
                  opt.appendChild( document.createTextNode("Project " +obj.projects[p].projectName + " - Task " + obj.projects[p].tasks[t].taskName) );
                  var val = '{'
                          + '"projectID": "'+ obj.projects[p].ID + '",'  
                          + '"projectName": "'+ obj.projects[p].projectName + '",'  
                          + '"taskID": "'+ obj.projects[p].tasks[t].ID + '",'  
                          + '"taskName": "'+ obj.projects[p].tasks[t].taskName + '"'  
                          + '}';
                  opt.value = val;
                  tasksDropdown.appendChild(opt); 
                }
              }
            }
        }
        else if(http.readyState == 4 && http.status != 200) {  //error in getting projects
            console.log(http.responseText);
        }
    }
    http.send(text);
  }
}

function isString(str) {
    return typeof str == "string";
}

function getCookie(cname) {
    //alert(cname.includes("historyTime"));
    if(document.cookie.includes(cname) == false && cname.includes("historyTime"))
      return "0:0:0";
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function FormatDuration(d) {
    if (d < 0) {
      return "?";
    }
    // 2hr 1min 5sec  == 7265
      var hours = parseInt(d/3600);
      if(hours<10) hours="0"+ hours;

      var minutes = d%3600;
      minutes = parseInt(minutes/60);
      if(minutes<10) minutes="0"+ minutes;

      var seconds = d%3600;
      seconds = seconds%60;
      if(seconds<10) seconds="0"+ seconds;
      return hours + ":" + minutes + ":" + seconds;
    
  }
