//Detect new tab
chrome.tabs.onCreated.addListener(function (tab) {
  //console.log(tab); //DEBUG
  //console.log(tab.pendingUrl); //DEBUG
  var delaiEnMillisecondes = 1;

  //Active app
  var isActiveApp = true;
  chrome.storage.sync.get(["active"], function (result) {
    if (result.active == false) {
      isActiveApp = false;
    }

    chrome.storage.sync.get(["urls"], function (result) {
      //URL manager
      if (isActiveApp) {
        if (result.urls) {
          result.urls.forEach((url) => {
            if (tab.pendingUrl.includes(url)) {
              setTimeout(function () {
                chrome.tabs.remove(tab.id, function () {
                  if (chrome.runtime.lastError) {
                    console.error("ERROR :", chrome.runtime.lastError);
                  }
                });
              }, delaiEnMillisecondes);
            }
          });
        }
      }
    });
  });
});
