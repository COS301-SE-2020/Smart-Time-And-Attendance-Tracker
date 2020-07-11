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
    delete chrome.extension.getBackgroundPage().History[tabId];
  }
  
  function HandleReplace(addedTabId, removedTabId) {
      console.log("replace");
    var t = new Date();
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
      if(isString(chrome.extension.getBackgroundPage().History[tabId][0][0]) == false) {
          description = FormatDuration(now - chrome.extension.getBackgroundPage().History[tabId][0][0]);
          
      }
      else {
        description = chrome.extension.getBackgroundPage().History[tabId][0][0];
      }
      chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
      
    }
    
}


  function updateTimeEntryPeriodically()
  {
      var now  = new Date();
      console.log("TABS: ");
      for(tabID in chrome.extension.getBackgroundPage().History) {
          console.log("tab ID " + tabID);
          var url = chrome.extension.getBackgroundPage().History[tabID][0][1];
          url = url.split("://")[1];
          url = url.split("/")[0];
          console.log("Saving data  " + chrome.extension.getBackgroundPage().History[tabID][0][0]);
          AddTimeEntry(url, chrome.extension.getBackgroundPage().History[tabID][0][0], now);    
      }
  }
  
  setInterval(updateTimeEntryPeriodically, 60*1000); //calling function every minute (60 seconds)

  function FormatDuration(d) {
    if (d < 0) {
      return "?";
    }
    var divisor = d < 3600000 ? [60000, 1000] : [3600000, 60000];
    function pad(x) {
      return x < 10 ? "0" + x : x;
    }
    return Math.floor(d / divisor[0]) + ":" + pad(Math.floor((d % divisor[0]) / divisor[1]));
  }

  
  
  function pause(){
    chrome.tabs.query({ active: true }, function (tabs) {
      currentID = tabs[0].id;
      console.log("currentID " + currentID);
      for(tabID in chrome.extension.getBackgroundPage().History) {
        console.log("tab ID " + tabID + "  " + chrome.extension.getBackgroundPage().History[tabID][0][0]);
        if(tabID != currentID){ //non-active tab
          var now = new Date();
          if(isString(chrome.extension.getBackgroundPage().History[tabID][0][0]) == false) {    //pause timer
            console.log("currentID " + currentID);
            var duration = FormatDuration(now - chrome.extension.getBackgroundPage().History[tabID][0][0]);
            console.log("pausing  " +duration  + "  " + isString(duration));
            chrome.extension.getBackgroundPage().History[tabID][0][0] = duration;
            //setCookie("historyTime"+chrome.extension.getBackgroundPage().History[tabID][0][1], duration, 1); 
          }
          else{ //already paused
            console.log("currentID " + currentID);
            chrome.extension.getBackgroundPage().History[tabID][0][0] = now;
          }
        }
        else{ //active tab
            
        }
        console.log(isString(chrome.extension.getBackgroundPage().History[tabID][0][0]));
      }
    });
  }
  setInterval(pause, 1000);
//  setInterval(pause, 5000);

