let scrapeData = document.getElementById("scrapeData");
let list = document.getElementById("dataList");

// Handler to recieve data from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Get data
  let data = request.data;

  // Display data on popup
  if (data == null || data.length == 0) {
    let tr = document.createElement("tr");
    tr.innerText = "No Data Found";
    list.appendChild(tr);
  } else {
    const scrapedData = [];
    data.forEach((datum) => {
      let tr = document.createElement("tr");
      tr.innerHTML = datum;
      Array.from(tr.children).forEach((child) => {
        if (!(child.tagName === "A" || child.tagName === "SPAN")) return;
        child.replaceWith(document.createTextNode(child.textContent));
      });
      list.appendChild(tr);
      scrapedData.push(tr.innerHTML);
    });
    // alert(scrapedData.join('\n'));
  }
});

// Button's click event listener
scrapeData.addEventListener("click", async () => {
  // Getting current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to scrape data
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeDataFromPage,
  });
});

// Function to scrape Data
function scrapeDataFromPage() {
  // RegEx to parse data from HTML code
  const dataRegex =
    /(?<=\<h1>).*(?=\<\/h1>)|(?<=\<h2>).*(?=\<\/h2>)|(?<=\<h3>).*(?=\<\/h3>)|(?<=\<h4>).*(?=\<\/h4>)|(?<=\<h5>).*(?=\<\/h5>)|(?<=\<h6>).*(?=\<\/h6>)|(?<=\<p>).*(?=\<\/p>)| (?<=\<a>).*(?=\<\/a>)|(?<=\<strong>).*(?=\<\/strong>)|(?<=\<b>).*(?=\<\/b>)|(?<=\<em>).*(?=\<\/em>)|(?<=\<i>).*(?=\<\/i>)|(?<=\<ol>).*(?=\<\/ol>)|(?<=\<ul>).*(?=\<\/ul>)|(?<=\<li>).*(?=\<\/li>)|(?<=\<div>).*(?=\<\/div>)/g;
     // |(?<=\<img>).*(?=\<\/img>)

  // Parse data from the HTML of the page
  let data = document.body.innerHTML.match(dataRegex);

  // Send emails to popup
  chrome.runtime.sendMessage({ data });
}