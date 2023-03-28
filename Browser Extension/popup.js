let scrapeData = document.getElementById("scrapeData");
let list = document.getElementById("dataList");

// Handler to recieve data from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Get data
  let data = request.data;

  // Display data on popup
  const scrapedData = [];

  if (data == null || data.length == 0) {
    let tr = document.createElement("tr");
    tr.innerText = "No Data Found";
    list.appendChild(tr);
  } else {
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
    // alert(scrapedData.join('\n'));
  }

  var url = "http://127.0.0.1:4000/classify";

  let finalSentence = [];

  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(scrapedData),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
    .done(function (response) {
      console.log("Hello");
      console.log(response);

      response.forEach((element) => {
        finalSentence.push(element);
      });
    })
    .fail(function (error) {
      console.log(error);
    });

    text = "Fuck you"

  const elements = document.querySelectorAll("*");

  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i].childNodes.length === 1 &&
      elements[i].textContent.indexOf(text) !== -1
    ) {
      console.log("Hjrhdjknfrd")
      elements[i].style.filter = "blur(7px)";
      //   filter: blur(5px);
    }
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
    /(?<=\<h1>).*(?=\<\/h1>)|(?<=\<h2>).*(?=\<\/h2>)|(?<=\<h3>).*(?=\<\/h3>)|(?<=\<h4>).*(?=\<\/h4>)|(?<=\<h5>).*(?=\<\/h5>)|(?<=\<h6>).*(?=\<\/h6>)|(?<=\<p>).*(?=\<\/p>)|(?<=\<a>).*(?=\<\/a>)|(?<=\<strong>).*(?=\<\/strong>)|(?<=\<b>).*(?=\<\/b>)|(?<=\<em>).*(?=\<\/em>)|(?<=\<i>).*(?=\<\/i>)|(?<=\<ol>).*(?=\<\/ol>)|(?<=\<ul>).*(?=\<\/ul>)|(?<=\<li>).*(?=\<\/li>)|(?<=\<div>).*(?=\<\/div>)/g;
  // |(?<=\<img>).*(?=\<\/img>)

  // Parse data from the HTML of the page
  let data = document.body.innerHTML.match(dataRegex);

  // Send emails to popup
  chrome.runtime.sendMessage({ data });
}
