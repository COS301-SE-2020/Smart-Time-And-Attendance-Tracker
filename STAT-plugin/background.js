var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);

var History = {};
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

setInterval(UpdateBadges, 1000);

chrome.tabs.onUpdated.addListener(HandleUpdate);
chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);
var stopTimer = document.getElementById("stop");
var startTimer = document.getElementById("start");

stopTimer.style.display = "block";
startTimer.style.display = "none";

function Update(t, tabId, url) {
    if (!url) {
        return;
    }
    console.log("url " + url);
    if (tabId in chrome.extension.getBackgroundPage().History) {
        if (url == chrome.extension.getBackgroundPage().History[tabId][0][1]) {
         
            return;
        }
    }
    else {
      chrome.extension.getBackgroundPage().History[tabId] = [];
    }
    chrome.extension.getBackgroundPage().History[tabId].unshift(["0:00", url, ""]);
    AddTimeEntry(url, t, t, tabId);
    //alert(chrome.extension.getBackgroundPage().History[tabId][0][2]);
    var history_limit = parseInt(localStorage["history_size"]);
    if (! history_limit) {
        history_limit = 23;
    }
    while (chrome.extension.getBackgroundPage().History[tabId].length > history_limit) {
      chrome.extension.getBackgroundPage().History[tabId].pop();
    }
    
    chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': '0:00'});
    chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "popup.html#tabId=" + tabId});
}

function HandleUpdate(tabId, changeInfo, tab) {
    Update(new Date(), tabId, changeInfo.url);
    
  }
  
  function HandleRemove(tabId, removeInfo) {    //working
    save();
    setCookie("historyTime"+tabId, "", 1);
    delete chrome.extension.getBackgroundPage().History[tabId];
  }
  
  function HandleReplace(addedTabId, removedTabId) {
      console.log("replace");
    var t = new Date();
    setCookie("historyTime"+removedTabId, "", 1);
    delete chrome.extension.getBackgroundPage().History[removedTabId];
    chrome.tabs.get(addedTabId, function(tab) {
      Update(t, addedTabId, tab.url);
    });
  }


  function UpdateBadges() {
    var now = new Date();
    pause();
    for (tabId in chrome.extension.getBackgroundPage().History) {
      var description = ""; 
      description = FormatDuration(now - chrome.extension.getBackgroundPage().History[tabId][0][0]);
      description = addTimes([description, getCookie("historyTime"+tabId)]);
      description = description.slice(0, -3);
      chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
      
    }
    
}


  function cacheDurationPeriodically()
  {
      console.log("TABS: ");
      for(tabID in chrome.extension.getBackgroundPage().History) {
        if(chrome.extension.getBackgroundPage().History[currentID][0][2] != "")
        {
            var now  = new Date();
            console.log("tab ID " + tabID);
            var duration = FormatDuration(now - chrome.extension.getBackgroundPage().History[tabID][0][0]);
            duration = addTimes([duration, getCookie("historyTime"+tabID)]);
            console.log("Saving data  " + duration);
            setCookie("historyTime"+tabID, duration, 1);
      }
    }
  }
/*
  after next wednesday (in 2 weeks)
  1 year training
  weekly session 
  6 months to 1 year project
  150 people in company
  */
  
  




  setInterval(cacheDurationPeriodically, 60*1000); //calling function every minute (60 seconds)

    
  function pause(){
    chrome.tabs.query({ active: true }, function (tabs) {
      currentID = tabs[0].id;
      for(tabID in chrome.extension.getBackgroundPage().History) {
        var now = new Date();
        if(tabID != currentID){ //non-active tab
          if(isString(chrome.extension.getBackgroundPage().History[tabID][0][0]) == false) {    //pause timer
            var duration = FormatDuration(now - chrome.extension.getBackgroundPage().History[tabID][0][0]);
            duration = addTimes([duration, getCookie("historyTime"+tabID)])
            chrome.extension.getBackgroundPage().History[tabID][0][0] = duration;
            setCookie("historyTime"+tabID, duration, 1); 
          }
          else{ //already paused
           
          }
        }
        else{ //active tab
          if(isString(chrome.extension.getBackgroundPage().History[tabID][0][0]) && chrome.extension.getBackgroundPage().History[currentID][0][2] != "" && getCookie("historyTime"+chrome.extension.getBackgroundPage().History[tabID][0][1])) {    //pause timer
            chrome.extension.getBackgroundPage().History[tabID][0][0] = now;
          }
        }
        console.log(isString(chrome.extension.getBackgroundPage().History[tabID][0][0]));
      }
    });
  }
  setInterval(pause, 1000);

 