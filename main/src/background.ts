chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.create({
		url:chrome.runtime.getURL(url)
	});
});
const url="TabMarker.html";
