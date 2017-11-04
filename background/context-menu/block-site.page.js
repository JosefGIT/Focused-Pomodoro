chrome.contextMenus.create(
    {
        "title": "TEMP Block site during pomodoro",
        "contexts": ["page"],
        "onclick": blockCurrentSite
    }
);

function blockCurrentSite() {
    getCurrentUrl().then(URL =>{
        blockSite(URL);
    });
}