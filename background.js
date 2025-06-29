let blockedSites = [];
let allowedSites = [];

browser.storage.local.get(["blockedSites", "allowedSites"]).then((result) => {
  blockedSites = result.blockedSites || [];
  allowedSites = result.allowedSites || [];
});

browser.storage.onChanged.addListener((changes) => {
  blockedSites = changes.blockedSites.newValue || [];
  allowedSites = changes.allowedSites.newValue || [];
});

function isBlocked(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    for (let allowed of allowedSites) {
      if (hostname.includes(allowed) || allowed.includes(hostname)) {
        return false;
      }
    }

    for (let blocked of blockedSites) {
      if (hostname.includes(blocked) || blocked.includes(hostname)) {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.error("failed to parse url:", url, e);
    return false;
  }
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (isBlocked(details.url)) {
      console.log("uh oh!! blocked:", details.url);
      return {
        redirectUrl:
          browser.extension.getURL("blocked.html") +
          "?blocked=" +
          encodeURIComponent(details.url),
      };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

browser.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "getConfig") {
    sendResponse({ blockedSites, allowedSites });
  } else if (request.action === "saveConfig") {
    browser.storage.local.set({
      blockedSites: request.blockedSites || [],
      allowedSites: request.allowedSites || [],
    });

    sendResponse({ success: true });
  }
});