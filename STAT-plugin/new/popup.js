var user = new User();

function showTime() {

    var currentID =0; //
    var now = new Date();
    var timer = document.getElementById("timer");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        if(tabs[0].url.includes("localhost:4200"))
        {
            document.getElementById("select_task_form").style.display="none";
            document.getElementById("reselect_task").style.display="none";
            document.getElementById("start_stop").style.display = "none";
            document.getElementById("timer").innerHTML = "-";
        }
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        setInterval(showTime, 1000);   //call showTime function every second

        //if(window.localStorage.hasOwnProperty('token'))
        //{
            var displayDuration = parseInt(chrome.extension.getBackgroundPage().History[currentID][0][0]);// + parseInt(getCookie("historyTime"+currentID));
            timer.innerHTML = FormatDuration(displayDuration).slice(0,5) + "\n";            
        //}
        //else
        //    desc.innerHTML = "00:00:00\n";
    });    
}
window.addEventListener('online', () => console.log('came online'));
window.addEventListener('offline', () => console.log('came offline'));
var SelectTask = document.getElementById("select_task");
var ReselectTask = document.getElementById("reselect_task");
var tasksDropdown = document.getElementById("tasks");
var projectsDropdown = document.getElementById("projects");

var stopStartBtn = document.getElementById("start_stop");

ReselectTask.onclick = function() {
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
    opt.appendChild( document.createTextNode("unspecified") );
    opt.value = "";
    tasksDropdown.appendChild(opt); 

}

SelectTask.onclick = function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = tabs[0].url;
        if(tabs[0].url.includes("localhost:4200"))
        {
            document.getElementById("select_task_form").style.display="none";
            document.getElementById("reselect_task").style.display="none";
            document.getElementById("start_stop").style.display = "none";
            document.getElementById("timer").innerHTML = "-";
        }
        url = url.split("://")[1];
        url = url.split("/")[0];

        if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")   //timer is still running
        {
            var ProjectName = projectsDropdown.options[projectsDropdown.selectedIndex].innerHTML;
            var TaskName = tasksDropdown.options[tasksDropdown.selectedIndex].innerHTML;
            if(chrome.extension.getBackgroundPage().History[currentID][0][2]!="")
            {
                if(tasksDropdown.value == "")
                    updateTask(currentID, projectsDropdown.value, ProjectName, "", "")
                else
                    updateTask(currentID, projectsDropdown.value, ProjectName, tasksDropdown.value, TaskName)
            }
            else
            {
                var text = '{'
                + '"projectName": "'+ ProjectName+ '",'  
                + '"projectID": "'+ projectsDropdown.value+ '",' 
                + '"taskName": "'+ TaskName + '",'  
                + '"taskID": "'+ tasksDropdown.value+ '",'
                + '"processed": "false"' 
                + '}';
                chrome.extension.getBackgroundPage().History[currentID][0][4] = text;
                //store in local storage
                localStorage.setItem('currentlyTrackingDetails', text);

                document.getElementById("select_task_form").style.display="none";
                document.getElementById("selected_task").style.display="block";
                document.getElementById("reselect_task").style.display="block";
          
                document.getElementById("project").innerHTML = "Project: " + ProjectName;
                if(TaskName != "unspecified")
                  document.getElementById("task").innerHTML = "Task: "+ TaskName;
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
        var url = tabs[0].url
        if(tabs[0].url.includes("localhost:4200"))
        {
            document.getElementById("select_task_form").style.display="none";
            document.getElementById("reselect_task").style.display="none";
            document.getElementById("start_stop").style.display = "none";
            document.getElementById("timer").innerHTML = "-";
        }
        url = url.split("://")[1];
        url = url.split("/")[0];
        var now  = new Date();

        if(chrome.extension.getBackgroundPage().History[currentID][0][3]  == "false")
        {
            console.log("Stopeed tracking " + url);
            var currentDuration = parseInt(chrome.extension.getBackgroundPage().History[currentID][0][0]);
            if(currentDuration>60)
            {
                UpdateTimeEntry(now, currentID, currentDuration, true);
                //startTimer.style.display = "block";
                //stopTimer.style.display = "none";
                
            }
            else
            {
                stopStartBtn.name = "start";
                stopStartBtn.innerHTML = "Start";
                chrome.extension.getBackgroundPage().History[currentID][0][2] = "";  
                chrome.extension.getBackgroundPage().History[currentID][0][3] = "true"; 
                chrome.extension.getBackgroundPage().History[currentID][0][0] = "0";
                
            }
            hideProjects();
        }
        else{
            //setCookie("historyTime"+currentID, "0", 1);        
            setTimeout (() => {
                if(chrome.extension.getBackgroundPage().History[currentID])
                {
                    if(chrome.extension.getBackgroundPage().History[currentID][0][3] == "false")
                    {
                        AddTimeEntry(url, now , new Date(), currentID);
                    }
                }
            }, 60000);
            console.log("Started tracking " + url);
            //stopTimer.style.display = "block";
            //startTimer.style.display = "none";
            chrome.extension.getBackgroundPage().History[currentID][0][0] = 0;
            chrome.extension.getBackgroundPage().History[currentID][0][3] = "false";
            stopStartBtn.name = "stop";
            stopStartBtn.innerHTML = "Stop";
            getProjects();
        }
    });   
    
    
}


function displayButton() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        if(tabs[0].url.includes("localhost:4200"))
        {
            document.getElementById("select_task_form").style.display="none";
            document.getElementById("reselect_task").style.display="none";
            document.getElementById("start_stop").style.display = "none";
            document.getElementById("timer").innerHTML = "-";
        }
        
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
            hideProjects();
            console.log("sToP!!!!!!!!");
            //startTimer.style.display = "block";
            //stopTimer.style.display = "none";
        }
        
    }); 
}
displayButton();

function hideProjects() 
{
    document.getElementById("select_task_form").style.display="none";
    document.getElementById("reselect_task").style.display="none";
}