browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== "loading" || !tab.url) return;
    if (tab.url.includes("blocked.html")) return;

    browser.storage.local.get(["sites", "isBlocking"]).then((data) => {
        if (!data.isBlocking) return;
        const sites = data.sites || [];
        const blocked = sites.find((site) => tab.url.includes(site));
        if (blocked) {
            browser.tabs.update(tabId, {
                url: `/blocked.html?url=${encodeURIComponent(blocked)}`
            });
        }
    });
});