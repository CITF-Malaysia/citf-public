
var latestDownloadId;

function updateIconUrl(iconUrl) {
  var downloadIcon = document.querySelector("#icon");
  downloadIcon.setAttribute("src", iconUrl);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function initializeLatestDownload(downloadItems) {
  var downloadUrl = document.querySelector("#url");
  if (downloadItems.length > 0) {
    latestDownloadId = downloadItems[0].id;
    var gettingIconUrl = browser.downloads.getFileIcon(latestDownloadId);
    gettingIconUrl.then(updateIconUrl, onError);
    downloadUrl.textContent = downloadItems[0].url;
    document.querySelector("#open").classList.remove("disabled");
    document.querySelector("#remove").classList.remove("disabled");
  } else {
    downloadUrl.textContent = "No downloaded items found."
    document.querySelector("#open").classList.add("disabled");
    document.querySelector("#remove").classList.add("disabled");
  }
}

var searching = browser.downloads.search({
  limit: 1,
  orderBy: ["-startTime"]
});
searching.then(initializeLatestDownload);

function openItem() {
  if (!document.querySelector("#open").classList.contains("disabled")) {
    browser.downloads.open(latestDownloadId);
  }
}
function removeItem() {
  if (!document.querySelector("#remove").classList.contains("disabled")) {
    browser.downloads.removeFile(latestDownloadId);
    browser.downloads.erase({id: latestDownloadId});
    window.close();
  }
}

document.querySelector("#open").addEventListener("click", openItem);
document.querySelector("#remove").addEventListener("click", removeItem);
