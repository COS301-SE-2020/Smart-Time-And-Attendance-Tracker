function showTime() {
    var currentID =0;
    var now = new Date();
    var desc = document.getElementById("desc");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        if(chrome.extension.getBackgroundPage().History[currentID][0][0] != -1)
        {
            var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
            url = url.split("://")[1];
            url = url.split("/")[0];
            desc.innerHTML = url + ": ";
            desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
        }
    });    
}

var stopTimer = document.getElementById("stop");
var startTimer = document.getElementById("start");

stopTimer.onclick = function(){
    var now  = new Date();
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        desc.innerHTML = url + ": ";
        desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
        console.log("Stoped timer. Saving data  " + chrome.extension.getBackgroundPage().History[currentID][0][0]);
        AddTimeEntry(url, chrome.extension.getBackgroundPage().History[currentID][0][0].getTime(), now.getTime());
        chrome.extension.getBackgroundPage().History[currentID][0][0] = -1;
        startTimer.style.display = "block";
        stopTimer.style.display = "none";
        
    });   
}

function updateTimeEntryPeriodically()
{
    console.log("TABS: ");
    for(tabID in chrome.extension.getBackgroundPage().History) {
        console.log("tab ID " + tabID);
        var url = chrome.extension.getBackgroundPage().History[tabID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        console.log("Saving data  " + chrome.extension.getBackgroundPage().History[tabID][0][0]);
        AddTimeEntry(url, chrome.extension.getBackgroundPage().History[tabID][0][0].getTime(), (new Date()).getTime());    
    }
}

setInterval(showTime, 1000);    //calling function every second
setInterval(updateTimeEntryPeriodically, 60*1000); //calling function every minute (60 seconds)

