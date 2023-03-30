let scrapeData = document.getElementById("scrapeData");
let list = document.getElementById("dataList");
scrapedData = [];

// let async fn = () => {
//   return await chrome.tabs.query({ active: true, currentWindow: true });
// }
// let [tab] = fn();

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log("This is the tab ID 2nd time " + tab.id);
  return tab;
}

const tab = getCurrentTab();

// Handler to recieve data from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Get data
  let data = request.data;

  ajaxCall(data);

});

async function ajaxCall(data) {
  const tab = await getCurrentTab();

  var url = "http://127.0.0.1:4000/classify";

  let finalSentence = [];

  console.log(JSON.stringify(data))

  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  })
    .done(function (response) {
      console.log("Hello");
      console.log(response);


      response.forEach((element) => {
        finalSentence.push(element);
      });
      console.log("Came here " + finalSentence);
      console.log("TABBB " + tab.id);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function () {
          window.replaceData = function (data) {
            console.log("Please work man " + data);
            data = data.map(string => string.trim());

            // let text = "Fuck you"
            // const elements = document.querySelectorAll("*");
            // console.log("Elements length is " + elements.length)
            // console.log("Element 1 is " + elements.values)

            // for (let i = 0; i < elements.length; i++) {

            //   console.log(data[i])
            //   if (
            //     elements[i].childNodes.length === 1 &&
            //     elements[i].textContent.indexOf(data) !== -1
            //   ) {
            //     console.log("Hjrhdjknfrd");
            //     elements[i].style.filter = "blur(7px)";
            //     //   filter: blur(5px);
            //   }
            // }

            // data.forEach((ans) => {
            //   const elements = document.querySelectorAll(`:contains(${ans})`);
            //   elements.forEach((element) => {
            //     element.style.filter = "blur(5px)";
            //   });
            // });

            data.forEach((ans) => {
              console.log(ans)
              const xpath = `//*[contains(text(),${ans})]`;
              const elements = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
              console.log(elements.snapshotLength)
              for (let i = 0; i < elements.snapshotLength; i++) {
                const element = elements.snapshotItem(i);
                element.style.filter = 'blur(5px)';
              }
            })



            //   chrome.scripting.executeScript({
            //     target: { tabId: tab.id },
            //     func: function(stringsToBlur) {
            //       stringsToBlur.forEach(string => {
            //         const elements = document.querySelectorAll(`:contains(${string})`);
            //         elements.forEach(element => {
            //           element.style.filter = 'blur(5px)';
            //         });
            //       });
            //     },
            //     args: [finalSentence]
            //   });
            // }
          };
        },
      });

      // Call the replaceData function in the scope of the current tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (data) => replaceData(data),
        args: [finalSentence],
      });
    })
    .fail(function (error) {
      console.log(error);
    });
}

function replaceData(finalSentence) {
  console.log("Came hergdhjrfjhgfdhjkdf " + finalSentence);
}

// Button's click event listener
scrapeData.addEventListener("click", async () => {
  // Getting current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("This is the tab ID 1st time " + tab.id);

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

  let data = document.body.innerHTML;
  data = data.replace( /(<([^>]+)>)/ig, ',');

  data = data.split(",")

  data = data.filter(element => !/^\s*\n\s*$/.test(element))
  


  // console.log(data)
  console.log(typeof(data))

  // const elements = document.querySelectorAll("*");

  // let text = "Fuck you";

  // console.log("hereeee")

  // Send emails to popup
  chrome.runtime.sendMessage({ data });
}
