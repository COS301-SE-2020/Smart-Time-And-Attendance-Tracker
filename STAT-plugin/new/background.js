
var tabID_re = /tabID=([0-9]+)/;
var match = tabID_re.exec(window.location.hash);

var History = {};
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

setInterval(UpdateBadges, 1000);  //update badge every second

chrome.tabs.onUpdated.addListener(HandleUpdate);
chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);

function Update(t, tabID, url) {
    if (!url) {
        return;
    }
    console.log("url " + url);
    if (tabID in chrome.extension.getBackgroundPage().History) {
        if (url == chrome.extension.getBackgroundPage().History[tabID][0][1]) {
         
            return;
        }
    }
    else {
      chrome.extension.getBackgroundPage().History[tabID] = [];
    }
    const now = new Date();
    chrome.extension.getBackgroundPage().History[tabID].unshift(["0", url, "", "false", ""]);  //[time, url, timeEntryID, stop =="false"/"true", project selected]
    setCookie("historyTime"+tabID, 0, 1);
    
    setTimeout (() => { 
      if(chrome.extension.getBackgroundPage().History[tabID][0][3] == "false" && localStorage.hasOwnProperty('token'))
      {
        var duration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID));
        AddTimeEntry(chrome.extension.getBackgroundPage().History[tabID][0][1], now , new Date(), tabID, duration);
        
      }
    }, 60000);

    var history_limit = parseInt(localStorage["history_size"]);
    if (! history_limit) {
        history_limit = 23;
    }
    while (chrome.extension.getBackgroundPage().History[tabID].length > history_limit) {
      chrome.extension.getBackgroundPage().History[tabID].pop();
    }
    
    chrome.browserAction.setBadgeText({ 'tabId': tabID, 'text': '0:00'});
    chrome.browserAction.setPopup({ 'tabId': tabID, 'popup': "popup.html#tabId=" + tabID});
}

function HandleUpdate(tabID, changeInfo, tab) {
    Update(new Date(), tabID, changeInfo.url);
    
  }
  
  function HandleRemove(tabID, removeInfo) {    //working
    var currentDuration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID)); 
    if(currentDuration>60)
    {
      UpdateTimeEntry(new Date(), tabID, currentDuration, true);
    }
    setCookie("historyTime"+tabID, "", 1);
    delete chrome.extension.getBackgroundPage().History[tabID];
  }
  
  function HandleReplace(addedtabID, removedtabID) {
    console.log("replace");
    var t = new Date();
    var currentDuration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID)); 
    if(currentDuration>60)
    {
      UpdateTimeEntry(new Date(), tabID, currentDuration, true);
    }
    setCookie("historyTime"+removedtabID, "", 1);
    delete chrome.extension.getBackgroundPage().History[removedtabID];
    chrome.tabs.get(addedtabID, function(tab) {
      Update(t, addedtabID, tab.url);
    });
  }


  function UpdateBadges() {
    if (localStorage.hasOwnProperty('token')) {
      chrome.tabs.query({ active: true }, function (tabs) {
        currentID = tabs[0].id;
        for(tabID in chrome.extension.getBackgroundPage().History) {
          if(tabID != currentID){ //non-active tab
            if(getCookie("historyTime"+tabID) != chrome.extension.getBackgroundPage().History[tabID][0][0]) {   //current time == saved time  ==> already saved
              setCookie("historyTime"+tabID, chrome.extension.getBackgroundPage().History[tabID][0][0], 1); 
            }
          }
          else{ //active tab
            if(chrome.extension.getBackgroundPage().History[tabID][0][3] == "false") {    //pause timer  => timer is not stoped
              chrome.extension.getBackgroundPage().History[tabID][0][0] = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0])+1;
            }
            if(localStorage.getItem('currentlyTracking') !=  chrome.extension.getBackgroundPage().History[tabID][0][2])
            {
              localStorage.setItem('currentlyTracking', chrome.extension.getBackgroundPage().History[tabID][0][2]);
            }
          }
          var displayDuration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID));
          console.log("Time:  "+ FormatDuration(displayDuration));
          chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabID), 'text': FormatDuration(displayDuration)});
        }
      });
    }
    else
    {
      for (tabID in chrome.extension.getBackgroundPage().History) {
        chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabID), 'text': '00:00'});
      }
    }
  }

  function syncDurationPeriodically() //sync every 10 minutes
  {
    for(tabID in chrome.extension.getBackgroundPage().History) {
      if(chrome.extension.getBackgroundPage().History[tabID][0][2] != "")
      {
        var currentDuration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID)); 
        if(currentDuration>60)
        {
          UpdateTimeEntry(new Date(), tabID, currentDuration, false);
        }
      }
    }
  }
  setInterval(syncDurationPeriodically, 60*1000*10); //calling function every minute 10 minutes


  function cacheDurationPeriodically()
  {
    for(tabID in chrome.extension.getBackgroundPage().History) {
      if(chrome.extension.getBackgroundPage().History[tabID][0][2] != "")
      {
          var currentDuration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID)); 
          setCookie("historyTime"+tabID, currentDuration, 1);
      }
    }
  }
  setInterval(cacheDurationPeriodically, 60*1000); //calling function every minute (60 seconds)