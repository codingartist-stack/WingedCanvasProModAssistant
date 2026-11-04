// Broker service worker to bounce messaging actions into frame layout arrays
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.tab && sender.tab.id) {
    chrome.tabs.sendMessage(sender.tab.id, message);
  }
});
