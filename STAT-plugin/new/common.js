
var user = new User();

var userLogin = document.getElementById("login");
document.getElementById("select_task_form").style.display="none";

processDisplay();
    ///////check if name and token exist - if not keep showing form -if they do, hide form and move on
  function processDisplay()
  {
    if(!user.getInstance().allProject && localStorage.hasOwnProperty('token'))
      getProjects();
    else
      processProjects(user.getInstance().allProject, false);
    if (localStorage.hasOwnProperty('name') && localStorage.hasOwnProperty('token'))
    {
        if(!user.getInstance().allProject && localStorage.hasOwnProperty('token'))
          getProjects();
        else
          processProjects(user.getInstance().allProject, false);
        //cookie exists - hide form
        
        document.getElementById("userName").innerHTML = localStorage.getItem("name") + " " + localStorage.getItem("surname");
        document.getElementById("userEmail").innerHTML = localStorage.getItem("email");
        document.getElementById("errorMessage").innerHTML= "";
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("popup").style.display = "block";
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
          currentID = tabs[0].id;
          if(tabs[0].url.includes("localhost:4200"))
          {
              document.getElementById("select_task_form").style.display="none";
              document.getElementById("start_stop").style.display = "none";
              document.getElementById("timer").innerHTML = "-";
              document.getElementById("reselect_task").style.display="none";
              document.getElementById("loading_projects").style.display="none";
              
              return;
          }
        });
    }
    else
    {  ///hide everything except the login form
        document.getElementById("errorMessage").innerHTML= "Login to start tracking";
        document.getElementById("popup").style.display = "none";
    }
  }
  userLogin.onclick = function() {
    document.getElementById("errorMessage").innerHTML= "Loading...";
    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/user/login';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function()
    {
      if(http.readyState == 4 && http.status == 200)
      {
        var data = JSON.parse(http.responseText);
        localStorage.setItem('token', data.token);
        getUserName();

        getProjects();
        console.log(chrome.extension.getBackgroundPage().History);
        for(tabID in chrome.extension.getBackgroundPage().History)
        {
          chrome.extension.getBackgroundPage().History[tabID][0][0] = 0;
          setTimeout (() => {
            if(chrome.extension.getBackgroundPage().History[tabID][0][3] == "false" && localStorage.hasOwnProperty('token') && chrome.extension.getBackgroundPage().History[tabID][0][2] == "")
            {
              var duration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]);
              AddTimeEntry(chrome.extension.getBackgroundPage().History[tabID][0][1], now , new Date(), tabID, duration);

            }
          }, 60000);
        }

      }
      else if( http.readyState == 4 && http.status != 200)
      {
        var data = JSON.parse(http.responseText);
        document.getElementById("errorMessage").innerHTML=data.message;
        console.log(data);
      }
    }
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var userData = '{ "email": "'+ email + '",' + '"password": "'+ password + '"' +'}';
    localStorage.setItem('email', email);

    console.log(userData);
    http.send(userData);
}

function getUserName(){
  var http = new XMLHttpRequest();
  var url = 'http://localhost:3000/api/user/getName';
  http.open('GET', url, true);
  http.setRequestHeader('Authorization', `Bearer ${localStorage.getItem("token")}` );
  http.onreadystatechange = function()
  {
    if(http.readyState == 4 && http.status == 200)
    {
      var data = JSON.parse(http.responseText);
      console.log(data);
      localStorage.setItem('name', data.name);
      localStorage.setItem('surname', data.surname);
      document.getElementById("userName").innerHTML = data.name + " " + data.surname;
      document.getElementById("userEmail").innerHTML = localStorage.getItem('email');
      
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("popup").style.display = "block";
      document.getElementById("errorMessage").innerHTML= "";
    }
    else if (http.readyState == 4 && http.status != 200) 
    {
      var data = JSON.parse(http.responseText);
      document.getElementById("errorMessage").style.display = "block";
      document.getElementById("errorMessage").innerHTML = data.message;
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("popup").style.display = "none";

      console.log(data);
    }
  }
  http.send();
}

var stopStartBtn = document.getElementById("start_stop");

function AddTimeEntry(url,startTime, endTime,currentID, duration ) {
  var today = new Date();
  //alert(today);
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
  var yyyy = today.getFullYear();

  var http = new XMLHttpRequest();
  var apiURL = 'http://localhost:3000/api/userTimeEntry/addTimeEntry';
  var text = '{ "description": "'+ url + '",'
          + '"startTime": "'+ startTime.getTime() + '",'
          + '"endTime": "'+ endTime.getTime() + '",'
          + '"device": "Browser",'
          + '"activeTime":' + getMinutesFromSeconds(duration) + ','
          + '"date": "'+  (yyyy + '/' + mm + '/' + dd) + '"'
          + '}';

  http.open('POST', apiURL, true);

  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader("authorization", "token "+ localStorage.getItem("token"));
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      var obj = JSON.parse(http.responseText);
      chrome.extension.getBackgroundPage().History[currentID][0][2] = obj.timeEntryID;
      localStorage.setItem('currentlyTracking', obj.timeEntryID);
      //alert(obj.timeEntryID);

      //updating tasks
      if(chrome.extension.getBackgroundPage().History[currentID][0][4] != "" || localStorage.hasOwnProperty('currentlyTrackingDetails'))
      {
        //if in local storage only
        if(localStorage.hasOwnProperty('currentlyTrackingDetails') && chrome.extension.getBackgroundPage().History[currentID][0][4] == "")
          chrome.extension.getBackgroundPage().History[currentID][0][4] = localStorage.getItem('currentlyTrackingDetails');

        obj = JSON.parse(chrome.extension.getBackgroundPage().History[currentID][0][4]);
        if(obj.processed == "false")
        {
          if(obj.taskID == "")
            updateTask(currentID, obj.projectID, obj.projectName, "", "");
          else
            updateTask(currentID, obj.projectID, obj.projectName, obj.taskID, obj.taskName);
        }
      }
    }
    else if(http.readyState == 4 && http.status == 403) //login again => token expired
    {
      //alert("token expired");
      localStorage.removeItem('token');
      processDisplay();
    }
    else if(http.readyState == 4 && http.status != 200) {  //error in recording time
      //maybe can be change to retry only when there is an internal server error

      setTimeout (() => {
        if(chrome.extension.getBackgroundPage().History[currentID][0][3] == "false" && localStorage.hasOwnProperty('token'))
        {
          var duration = parseInt(chrome.extension.getBackgroundPage().History[currentID][0][0]);
          AddTimeEntry(url, startTime , new Date(), currentID, duration);

        }
      }, 60 *1000);  //try again after 1 minute
    }
  }
  http.send(text);
}

function UpdateTimeEntry(endTime,currentID, duration, stop) {
  //alert("currentID  " + currentID)
  var http = new XMLHttpRequest();
  var apiURL = 'http://localhost:3000/api/userTimeEntry/updateTimeEntry';
  var text = '{'
          + '"timeEntryID": "'+ chrome.extension.getBackgroundPage().History[currentID][0][2] + '",'
          + '"endTime": "'+ endTime.getTime() + '",'
          + '"activeTime":'+ getMinutesFromSeconds(duration)
          + '}';

  http.open('POST', apiURL, true);
  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader("authorization", "token "+ localStorage.getItem("token"));
  http.onreadystatechange = function() {
    //alert(http.readyState + "  " + http.status);
    if(http.readyState == 4 && http.status == 200) {
      const obj = JSON.parse(http.responseText);
      //alert("message :   " + obj.message);
      if(stop)
      {
        stopStartBtn.name = "start";
        stopStartBtn.innerHTML = "Start";
        chrome.extension.getBackgroundPage().History[currentID][0][2] = "";
        chrome.extension.getBackgroundPage().History[currentID][0][3] = "true";
        chrome.extension.getBackgroundPage().History[currentID][0][0] = "0";
      }
    }
    else if(http.readyState == 4 && http.status == 403) //login again => token expired
    {
      //alert("token expired");
      localStorage.removeItem('token');
      processDisplay();
    }
    else if(http.readyState == 4 && http.status != 200) {  //error in recording time
      //alert(http.responseText);
    }
  }
  http.send(text);
}

projectsDropdown = document.getElementById("projects");

function getProjects() {
  if(!user.getInstance().allProject)
  {
    var http = new XMLHttpRequest();
    var apiURL = 'http://localhost:3000/api/user/getProjects';
    http.open('GET', apiURL, true);

    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token "+ localStorage.getItem("token"));
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            if(user.getInstance().allProject == undefined)
              user.getInstance().allProject = http.responseText;
            console.log(http.responseText);

            processProjects(http.responseText, false);

        }
        else if(http.readyState == 4 && http.status == 403) //login again => token expired
        {
          //alert("token -- expired");
          localStorage.removeItem('token');
          processDisplay();
        }
        else if(http.readyState == 4 && http.status != 200) {  //error in getting projects
            console.log(http.responseText);
        }
    }
    http.send();
  }
  else
  {
    processProjects(user.getInstance().allProject, false);
  }
}

function processProjects(responseText, display)
{
  //alert("1");
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var currentID = tabs[0].id;
    while(projectsDropdown.hasChildNodes())
      {
        projectsDropdown.removeChild(projectsDropdown.firstChild);
      }
      while(tasksDropdown.hasChildNodes())
      {
          tasksDropdown.removeChild(tasksDropdown.firstChild);
      }
    if(display == true && user.getInstance().allProject)
    {
      //alert("2.1");
      const obj = JSON.parse(user.getInstance().allProject);
      for( p in obj.projects)
      {
        var opt = document.createElement('option');
        opt.appendChild( document.createTextNode(obj.projects[p].projectName));
        var val = '{'
          + '"projectID": "'+ obj.projects[p].ID + '",'
          + '"projectName": "'+ obj.projects[p].projectName + '",'
          + '"taskID": "",'
          + '"taskName": ""'
          + '}';
        opt.value = obj.projects[p].ID;
        projectsDropdown.appendChild(opt);
      }

      var userTasks = user.getInstance().getTasks(document.createTextNode(obj.projects[0].ID));

      var opt = document.createElement('option');
      for( t in userTasks)
      {
          opt = document.createElement('option');
          opt.appendChild( document.createTextNode(userTasks[t].taskName) );
          opt.value = userTasks[t].ID;
          tasksDropdown.appendChild(opt);
      }
      opt = document.createElement('option');
      opt.appendChild( document.createTextNode("Unspecified") );
      opt.value = "";
      tasksDropdown.appendChild(opt);

      if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
      {
        document.getElementById("loading_projects").style.display="none";
        document.getElementById("select_task_form").style.display="block";
      }
    }
    else if(chrome.extension.getBackgroundPage().History[currentID][0][4])
    {
      //alert("2.2");
        var obj = JSON.parse(chrome.extension.getBackgroundPage().History[currentID][0][4]);
        document.getElementById("project").innerHTML = "Project: " + obj.projectName;
        if(obj.taskName != "" && obj.taskName != "Unspecified")
          document.getElementById("task").innerHTML = "Task: "+ obj.taskName;

          if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
          {
            document.getElementById("reselect_task").style.display="block";
          }
          document.getElementById("select_task_form").style.display="none";
          document.getElementById("loading_projects").style.display="none";
          document.getElementById("selected_task").style.display="block";


    }
    else if(localStorage.getItem('currentlyTrackingDetails'))
    {
      //alert("2.3");
      chrome.extension.getBackgroundPage().History[currentID][0][4] = localStorage.getItem('currentlyTrackingDetails');
      var obj = JSON.parse(chrome.extension.getBackgroundPage().History[currentID][0][4]);
      document.getElementById("select_task_form").style.display="none";
      document.getElementById("selected_task").style.display="block";
      document.getElementById("loading_projects").style.display="none";

      if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
      {
        document.getElementById("reselect_task").style.display="block";
      }

      document.getElementById("project").innerHTML = "Project: " + obj.projectName;
      if(obj.taskName != "" && obj.taskName  != "Unspecified")
        document.getElementById("task").innerHTML = "Task: "+ obj.taskName;
      else
        document.getElementById("task").innerHTML = "";
    }
    else
    {
      //alert("2.4");
      const obj = JSON.parse(responseText);
      for( p in obj.projects)
      {
        var opt = document.createElement('option');
        opt.appendChild( document.createTextNode(obj.projects[p].projectName));
        var val = '{'
          + '"projectID": "'+ obj.projects[p].ID + '",'
          + '"projectName": "'+ obj.projects[p].projectName + '",'
          + '"taskID": "",'
          + '"taskName": ""'
          + '}';
        opt.value = obj.projects[p].ID;
        projectsDropdown.appendChild(opt);
      }
      var userTasks = user.getInstance().getTasks(document.createTextNode(obj.projects[0].ID));

      var opt = document.createElement('option');
      for( t in userTasks)
      {
          opt = document.createElement('option');
          opt.appendChild( document.createTextNode(userTasks[t].taskName) );
          opt.value = userTasks[t].ID;
          tasksDropdown.appendChild(opt);
      }
      opt = document.createElement('option');
      opt.appendChild( document.createTextNode("Unspecified") );
      opt.value = "";
      tasksDropdown.appendChild(opt);
      document.getElementById("loading_projects").style.display="none";

      if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
      {
        document.getElementById("select_task_form").style.display="block";
      }
    }
  });
}

function updateTask(currentID, ProjectID, ProjectName, TaskID, TaskName){
  var taskDetails = "";
  if(TaskID != "")
  {
    taskDetails = ','
      + '"taskID": "'+TaskID+ '",'
      + '"taskName": "'+ TaskName+ '"';
  }
  var text = '{'
    + '"timeEntryID": "'+ chrome.extension.getBackgroundPage().History[currentID][0][2]+ '",'
    + '"projectID": "'+ ProjectID+ '",'
    + '"projectName": "'+ ProjectName + '"'
    + taskDetails + '}';

  var http = new XMLHttpRequest();
  var apiURL = 'http://localhost:3000/api/userTimeEntry/updateTimeEntry';
  http.open('POST', apiURL, true);
  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader("authorization", "token "+ localStorage.getItem("token"));
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      text = '{'
        + '"projectName": "'+ ProjectName+ '",'
        + '"projectID": "'+ ProjectID+ '",'
        + '"taskName": "'+ TaskName + '",'
        + '"taskID": "'+ TaskID+ '",'
        + '"processed": "true"'
        + '}';
      chrome.extension.getBackgroundPage().History[currentID][0][4] =text;

      text = '{'
        + '"projectName": "'+ ProjectName+ '",'
        + '"projectID": "'+ ProjectID+ '",'
        + '"taskName": "'+ TaskName + '",'
        + '"taskID": "'+ TaskID+ '",'
        + '"processed": "false"'
        + '}';
      localStorage.setItem('currentlyTrackingDetails', text);

      document.getElementById("project").innerHTML = "Project: " + ProjectName;
      if(TaskID != "")
        document.getElementById("task").innerHTML = "Task: "+ TaskName;
      else
        document.getElementById("task").innerHTML = "";
      document.getElementById("select_task_form").style.display="none";
      document.getElementById("selected_task").style.display="block";
      document.getElementById("reselect_task").style.display="block";
      document.getElementById("loading_projects").style.display="none";
    }
    else if(http.readyState == 4 && http.status == 403) //login again => token expired
    {
      //alert("token expired");
      localStorage.removeItem('token');
      processDisplay();
    }
    else if(http.readyState == 4 && http.status != 200) {  //error in recording time
      const obj = JSON.parse(http.responseText);
      document.getElementById("task_error").innerHTML = obj.message;
    }
  }
  http.send(text);

}

var LogoutBtn = document.getElementById("logout_btn");

LogoutBtn.onclick = function() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("errorMessage").innerHTML= "Login to start tracking";
  document.getElementById("popup").style.display = "none";
  localStorage.removeItem("name");
  localStorage.removeItem("surname");
  localStorage.removeItem("token");
  localStorage.removeItem("currentlyTracking");
  user.getInstance().allProject = "";

  document.getElementById("timer").innerHTML = "0:00";
  for(tabID in chrome.extension.getBackgroundPage().History)
    chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabID), 'text': FormatDuration("0:00")});

}


  function getMinutesFromSeconds(t)
  {
    var minutes = parseInt(t/60);

    return minutes;
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
