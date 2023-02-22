// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // If the message is a "scrape" message, scrape the website
    if (message.action === "scrape") {
      // Create arrays for text and images
      var text = [];
      var images = [];
  
      // Get all the text nodes on the page
      var textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  
      // Loop through the text nodes and add their content to the text array
      for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var nodeText = node.textContent.trim();
        if (nodeText) {
          text.push(nodeText);
        }
      }
  
      // Get all the images on the page
      var imgElements = document.getElementsByTagName("img");
  
      // Loop through the images and add their source URLs to the images array
      for (var i = 0; i < imgElements.length; i++) {
        var imgSrc = imgElements[i].getAttribute("src");
        if (imgSrc) {
          images.push(imgSrc);
        }
      }
  
      // Send a message back to the popup script with the text and image arrays
      chrome.runtime.sendMessage({ action: "scraped", text: text, images: images });
    }
  });
  