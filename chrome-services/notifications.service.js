const sessionStopNotificationOptions = {
    "type": "basic",
    "title": "Session is over!",
    "message": "Session is over. Click to start break.",
    "iconUrl": "https://image.flaticon.com/teams/slug/freepik.jpg",
    "isClickable": true
};

const breakOverNotificationOptions = {
    "type": "basic",
    "title": "Break is over!",
    "message": "Break over! Click to start session!",
    "iconUrl": "https://image.flaticon.com/teams/slug/freepik.jpg",
    "isClickable": true
};

const sessionStopNotificationId = "SESSION_STOP_NOTIFICATION";
const shortBreakStopNotificationId = "SHORT_BREAK_STOP_NOTIFICATION";
const longBreakStopNotificationId = "LONG_BREAK_STOP_NOTIFICATION";

function alarmStopNotification(alarmName) {
    switch (alarmName) {
        case (sessionAlarmName):
            createNotification(sessionStopNotificationId, sessionStopNotificationOptions, startShortBreakAlarm);
            break;
        case (shortBreakAlarmName):
            createNotification(shortBreakStopNotificationId, breakOverNotificationOptions, startSessionAlarm);
            break;

        case (longBreakAlarmName):
            createNotification(longBreakStopNotificationId, breakOverNotificationOptions, startSessionAlarm);
            break;
    }
}

// Creates notification with onClickListener to start the desired alarm
function createNotification(notificationId, notificationOptions, startBreakAlarmFunction) {
    chrome.notifications.create(notificationId, notificationOptions, id => {
        chrome.notifications.onClicked.addListener(() => {
            chrome.notifications.clear(id, wasCleared => {
                startNextAlarm();
            });
        });
    });
}