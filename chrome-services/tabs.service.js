function getCurrentUrl() {
    return new Promise(resolve => {
        chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, tabs => {
            console.info(tabs[0].url);
            var currentURL = tabs[0].url.split("/")[2];
            resolve(currentURL);
        });
    });
}