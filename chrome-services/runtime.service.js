chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.requestMessage) {
            case "isSessionRunning":
                getBlockedSites().then(blockedSites => {
                    var sessionIsRunning = _alarmState == SESSION_ALARM_IS_RUNNING ? true : false;
                    sendResponse({ "blockedSites": blockedSites, "sessionIsRunningResponse": sessionIsRunning });
                });
                break;
            case "getBlockedSites":
                getBlockedSites().then(blockedSites => {
                    sendResponse({ "blockedSites": blockedSites });
                });
                break;
            case "updateBlockedSitesReturnNew":
                updateBlockedSites(request.newBlockedSites).then(blockedSites => {
                    sendResponse({ "blockedSites": blockedSites });
                });
                break;
            case "getAlarmInfo":
                getBreakAlarmInfo().then(alarmInfo =>{
                    sendResponse({"alarmInfo" : alarmInfo});
                });
            break;
        }

        // Return true to "sendResponse" asynchronously
        return true;
    });