let scraper = document.getElementById("scrape-btn");

// Listen for clicks on the "Scrape Website" button
scraper.addEventListener("click", function () {
  // Get the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send a message to the content script to scrape the website
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "scrape" },
      function (response) {
        // Log the text and image arrays to the console
        console.log(response.text);
        console.log(response.images);
      }
    );
  });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // If the message is a "scraped" message, log the results
  if (message.action === "scraped") {
    console.log(message.text);
    console.log(message.images);
  }
});
