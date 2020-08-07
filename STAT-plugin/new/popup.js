var user = new User();

user.getInstance().name = "hello"; 
function showTime() {

    var currentID =0; //
    var now = new Date();
    var desc = document.getElementById("desc");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        setInterval(showTime, 1000);   //call showTime function every second

        //if(window.localStorage.hasOwnProperty('token'))
        //{
            var displayDuration = parseInt(chrome.extension.getBackgroundPage().History[currentID][0][0]) + parseInt(getCookie("historyTime"+currentID));
            desc.innerHTML = FormatDuration(displayDuration).slice(0,5) + "\n";            
        //}
        //else
        //    desc.innerHTML = "00:00:00\n";
    });    
}
var SelectTask = document.getElementById("select_task");
var ReselectTask = document.getElementById("reselect_task");
var tasksDropdown = document.getElementById("tasks");
var projectsDropdown = document.getElementById("projects");

var stopStartBtn = document.getElementById("start_stop");

ReselectTask.onclick = function() {
    document.getElementById("select_task_form").style.display="block";
    ReselectTask.style.display="none";
    processProjects(user.getInstance().allProject, true);
}

projectsDropdown.onchange = function() {
    //remove all children tasksDropdown
    while(tasksDropdown.hasChildNodes())
    {
        tasksDropdown.removeChild(tasksDropdown.firstChild);
    }
    var userTasks = user.getInstance().getTasks(projectsDropdown.value);

    var opt = document.createElement('option');
    for( t in userTasks)
    {
        opt = document.createElement('option');
        opt.appendChild( document.createTextNode(userTasks[t].taskName) );
        opt.value = userTasks[t].ID;
        tasksDropdown.appendChild(opt); 
    }
    opt = document.createElement('option');
    opt.appendChild( document.createTextNode("Un-specified") );
    opt.value = "";
    tasksDropdown.appendChild(opt); 

}

SelectTask.onclick = function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];

        if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")   //timer is still running
        {
            if(chrome.extension.getBackgroundPage().History[currentID][0][2]!="")
            {
                var ProjectName = projectsDropdown.options[projectsDropdown.selectedIndex].innerHTML;
                var TaskName = tasksDropdown.options[tasksDropdown.selectedIndex].innerHTML;
                if(tasksDropdown.value == "")
                    updateTask(currentID, projectsDropdown.value, ProjectName, "", "")
                else
                    updateTask(currentID, projectsDropdown.value, ProjectName, tasksDropdown.value, TaskName)
            }
        }
        else{
           
           document.getElementById("task_error").innerHTML = "Sart timer to select task";
        }
    });  
}

//var startTimer = document.getElementById("start");
showTime();
stopStartBtn.onclick = function(){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        var now  = new Date();

        if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
        {
            console.log("Stopeed tracking " + url);
            var currentDuration = parseInt(chrome.extension.getBackgroundPage().History[currentID][0][0]) + parseInt(getCookie("historyTime"+currentID)); 
            if(currentDuration>60)
            {
                UpdateTimeEntry(now, currentID, currentDuration, true);
                //startTimer.style.display = "block";
                //stopTimer.style.display = "none";
            }
            else
            {
                document.getElementById("errorMessage").style.display="block";
                document.getElementById("errorMessage").innerHTML= "Time < 60 seconds";
            }
        }
        else{
            setCookie("historyTime"+currentID, "0", 1);        
            setTimeout (() => {
                if(chrome.extension.getBackgroundPage().History[currentID][0][3] == "false")
                {
                alert("made time entry");
                AddTimeEntry(url, now , new Date(), currentID);
                }
            }, 60000);
            console.log("Started tracking " + url);
            //stopTimer.style.display = "block";
            //startTimer.style.display = "none";
            chrome.extension.getBackgroundPage().History[currentID][0][0] = 0;
            chrome.extension.getBackgroundPage().History[currentID][0][3] = "false";
            stopStartBtn.name = "stop";
            stopStartBtn.innerHTML = "Stop";
        }
    });   
    
    
}


function displayButton() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        //alert(stopStartBtn.name + "  " + stopStartBtn.value + "  " + stopStartBtn.innerHTML);

        if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
        { 
            stopStartBtn.name = "stop";
            stopStartBtn.innerHTML = "Stop";
            //stopTimer.style.display = "block";
            //startTimer.style.display = "none";
        }
        else
        {
            stopStartBtn.name = "start";
            stopStartBtn.innerHTML = "Start";
            //startTimer.style.display = "block";
            //stopTimer.style.display = "none";
        }
        
    }); 
}
displayButton();

