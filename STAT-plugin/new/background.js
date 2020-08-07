
var tabID_re = /tabID=([0-9]+)/;
var match = tabID_re.exec(window.location.hash);

var History = {};
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

setInterval(UpdateBadges, 1000);  //update badge every second

chrome.tabs.onUpdated.addListener(HandleUpdate);
chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);
var stopStartBtn = document.getElementById("start_stop");
/*var startTimer = document.getElementById("start");

stopTimer.style.display = "block";
startTimer.style.display = "none";*/

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
      if(chrome.extension.getBackgroundPage().History[tabID][0][3] == "false" && window.localStorage.hasOwnProperty('token'))
      {
        var duration = parseInt(chrome.extension.getBackgroundPage().History[tabID][0][0]) + parseInt(getCookie("historyTime"+tabID));
        AddTimeEntry(chrome.extension.getBackgroundPage().History[tabID][0][1], now , new Date(), tabID, duration);
        

      }
    }, 10000);

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
    setCookie("historyTime"+tabID, "", 1);
    delete chrome.extension.getBackgroundPage().History[tabID];
  }
  
  function HandleReplace(addedtabID, removedtabID) {
      console.log("replace");
    var t = new Date();
    setCookie("historyTime"+removedtabID, "", 1);
    delete chrome.extension.getBackgroundPage().History[removedtabID];
    chrome.tabs.get(addedtabID, function(tab) {
      Update(t, addedtabID, tab.url);
    });
  }


  function UpdateBadges() {
    if (window.localStorage.hasOwnProperty('token')) {
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
            if(window.localStorage.getItem('currentlyTracking') !=  chrome.extension.getBackgroundPage().History[tabID][0][2])
            {
              window.localStorage.setItem('currentlyTracking', chrome.extension.getBackgroundPage().History[tabID][0][2]);

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


  function cacheDurationPeriodically()
  {
      //alert("TABS: ");
      for(tabID in chrome.extension.getBackgroundPage().History) {
        if(chrome.extension.getBackgroundPage().History[currentID][0][2] != "")
        {
            var now  = new Date();
            //alert("tab ID " + tabID);
            var duration = FormatDuration(now - chrome.extension.getBackgroundPage().History[tabID][0][0]);
            duration = addTimes([duration, getCookie("historyTime"+tabID)]);
           // alert("Saving data  " + duration);
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
  
  




  //setInterval(cacheDurationPeriodically, 60*1000); //calling function every minute (60 seconds)