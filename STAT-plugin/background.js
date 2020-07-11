var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);

var History = {};
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

//setInterval(showTime, 1000);
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
    if (tabId in History) {
        if (url == History[tabId][0][1]) {
            return;
        }
    }
    else {
        History[tabId] = [];
    }
    History[tabId].unshift(["0:00", url, ""]);
    AddTimeEntry(url, t, t, tabId);
    var history_limit = parseInt(localStorage["history_size"]);
    if (! history_limit) {
        history_limit = 23;
    }
    while (History[tabId].length > history_limit) {
        History[tabId].pop();
    }
    
    chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': '0:00'});
    chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "popup.html#tabId=" + tabId});
}

function HandleUpdate(tabId, changeInfo, tab) {
    //console.log(changeInfo);
    //console.log(tab);
    //console.log("update " + tabId );
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
    for (tabId in History) {
      var description = ""; 
      //if(History[tabId][0][0] != -1) {
      if(isString(History[tabId][0][0]) == false) {
          description = FormatDuration(now - History[tabId][0][0]);
          
      }
      else {
        description = History[tabId][0][0];
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

  