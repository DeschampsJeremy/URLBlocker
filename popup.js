document.addEventListener("DOMContentLoaded", () => {
  //Active App
  const checkboxToggleActive = document.getElementById("toggleActive");
  var isActiveApp = true;
  chrome.storage.sync.get(["active"], function (result) {
    if (result.active == false) {
      isActiveApp = false;
    } else {
      isActiveApp = true;
    }
    checkboxToggleActive.checked = isActiveApp;
    chrome.storage.sync.set({ active: isActiveApp }, function () {
      //console.log("Active app : " + isActiveApp); //DEBUG
    });
  });
  checkboxToggleActive.addEventListener("change", function () {
    var isChangeActive = false;
    if (checkboxToggleActive.checked) {
      isChangeActive = true;
    } else {
      isChangeActive = false;
    }
    chrome.storage.sync.set({ active: isChangeActive }, function () {
      //console.log("Active change app : " + isChangeActive); //DEBUG
    });
  });

  //URL manager
  const butonSetURL = document.getElementById("butonSetURL");
  const butonCleanURL = document.getElementById("butonCleanURL");
  const urlInput = document.getElementById("urlInput");
  const urlList = document.getElementById("urlList");
  butonSetURL.addEventListener("click", setURL);
  butonCleanURL.addEventListener("click", cleanURL);
  displayURL();

  function displayURL() {
    urlList.innerHTML = "";
    chrome.storage.sync.get(["urls"], function (result) {
      if (result.urls) {
        result.urls.forEach((url, index) => {
          urlList.innerHTML +=
            "<li><button id='butonDelURL_" +
            index +
            "'>Supprimer</button> " +
            url +
            "</li>";
        });
        addEventDelete();
      }
    });
  }
  function setURL() {
    var url = urlInput.value;
    var urls = [];
    chrome.storage.sync.get(["urls"], function (result) {
      if (result.urls) {
        urls = result.urls;
      }
      urls.push(url);
      urlInput.value = "";
      chrome.storage.sync.set({ urls: urls }, function () {
        displayURL();
      });
    });
  }
  function cleanURL() {
    chrome.storage.sync.clear(function () {
      displayURL();
    });
  }

  //Delete URL
  function addEventDelete() {
    chrome.storage.sync.get(["urls"], function (result) {
      if (result.urls) {
        result.urls.forEach((url, index) => {
          document
            .getElementById("butonDelURL_" + index)
            .addEventListener("click", delURL);
        });
      }
    });
  }
  function delURL(event) {
    const idToDelete = event.target.id.split("_")[1];
    console.log("DELETE " + idToDelete);
    chrome.storage.sync.get(["urls"], function (result) {
      const urls = result.urls || [];
      const indexASupprimer = idToDelete; // Remplacez par l'index de la ligne que vous souhaitez supprimer
      if (indexASupprimer >= 0 && indexASupprimer < urls.length) {
        urls.splice(indexASupprimer, 1);
      }
      chrome.storage.sync.set({ urls: urls }, function () {
        if (chrome.runtime.lastError) {
          console.error(
            "Erreur lors de la suppression de la ligne :",
            chrome.runtime.lastError
          );
        } else {
          console.log("Ligne supprimée avec succès.");
          displayURL();
        }
      });
    });

    chrome.storage.sync.remove(idToDelete, function () {
      if (chrome.runtime.lastError) {
        console.error(
          "Erreur lors de la suppression de l'élément :",
          chrome.runtime.lastError
        );
      } else {
        console.log("Élément supprimé avec succès.");
      }
    });
  }
});
