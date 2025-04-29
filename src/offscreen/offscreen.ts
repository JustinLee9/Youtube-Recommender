const iframe = document.createElement("iframe");
iframe.src = "https://extension-a04e7.web.app/signInWithPopup.html";
document.documentElement.appendChild(iframe);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target !== "offscreen") return;

  window.addEventListener("message", ({ data }) => {
    sendResponse(JSON.parse(data));
  }, { once: true });

  iframe.contentWindow?.postMessage({ initAuth: true }, new URL(iframe.src).origin);
  return true;
});
