chrome.contextMenus.create(
    {
        "title": "Stop timer",
        "contexts": ["browser_action"],
        "onclick": manuallyStopAlarm
    }
);

function manuallyStopAlarm(){
    resetCycle();
}