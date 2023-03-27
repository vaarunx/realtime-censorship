chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
      const domInfo = {
        body: document.body.innerHTML,
      };
      response(domInfo);
    }
  });