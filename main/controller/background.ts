chrome.action.onClicked.addListener(function(){
	chrome.tabs.create({
		url:chrome.runtime.getURL(url)
	});
});
const url="view/index.html";
