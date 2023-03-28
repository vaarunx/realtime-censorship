chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: blurElementsByText,
  });
});

function blurElementsByText() {
  // This function blurs elements that contain the specified text

  const elements = document.querySelectorAll("*");
  text = "Fuck you"
  // for (let i = 0; i < elements.length; i++) {

  //   if (elements[i].textContent.indexOf(text) !== -1) {
  //     console.log("Hello Inside")
  //     const range = document.createRange();
  //     range.selectNodeContents(elements[i]);
  //     const selection = window.getSelection();
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //     document.execCommand('backColor', false, 'transparent');
  //   }
  // }

  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i].childNodes.length === 1 &&
      elements[i].textContent.indexOf(text) !== -1
    ) {
        // elements[i].style.backgroundColor = "blue"
      elements[i].style.filter = "blur(7px)";
    //   filter: blur(5px);
    }
  }
}

function findString() {
  const elements = document.querySelectorAll("*");
  const text = "Fuck";
  console.log(document.elements.textContent = `String found? ${window.find(text)}`);
}

function search() {
  var name = document.getElementById("searchForm").elements["searchItem"].value;
  var pattern = name.toLowerCase();
  var targetId = "";

  var divs = document.getElementsByClassName("col-md-2");
  for (var i = 0; i < divs.length; i++) {
    var para = divs[i].getElementsByTagName("p");
    var index = para[0].innerText.toLowerCase().indexOf(pattern);
    if (index != -1) {
      targetId = divs[i].parentNode.id;
      document.getElementById(targetId).scrollIntoView();
      break;
    }
  }
}
