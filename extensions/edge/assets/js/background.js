browser.runtime.onInstalled.addListener(function() {
	// browser.tabs.create({url: browser.extension.getURL('../popup.html')});

	// Called when the user clicks on the browser action.
	browser.browserAction.onClicked.addListener(function(tab) {
		// Send a message to the active tab
		browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		browser.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
		});
	});

	// This block is new!
	browser.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if( request.message === "open_new_tab" ) {
			  	browser.tabs.create({"url": request.url});
			}
		}
	);
});