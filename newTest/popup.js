document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sendBtn').addEventListener('click', () => {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, tabs => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'popup', subject: 'DOMInfo'},
          setDOMInfo);
      });
    });
  });
  
  function setDOMInfo(domInfo) {
    const serverUrl = 'http://localhost:3000';
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(domInfo)
    });
  }
