function showTime() {
    var currentID =0; //
    var now = new Date();
    var desc = document.getElementById("desc");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];

        if(document.cookie.indexOf("token")>-1)
        {
            var displayDuration = parseInt(chrome.extension.getBackgroundPage().History[currentID][0][0]) + parseInt(getCookie("historyTime"+currentID));
            desc.innerHTML = FormatDuration(displayDuration).slice(0,5) + "\n";            
        }
        else
            desc.innerHTML = "00:00:00\n";
    });    
}
var SelectTask = document.getElementById("select_task");
var tasksDropdown = document.getElementById("tasks");

var stopStartBtn = document.getElementById("start_stop");
var pauseResumeBtn = document.getElementById("pause_resume");

//var startTimer = document.getElementById("start");
setInterval(showTime, 1000);

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
                UpdateTimeEntry(now, currentID, currentDuration);
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