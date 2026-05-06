const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const add = document.getElementById("add");
const newSite = document.getElementById("new-site");
const sitesDisplay = document.getElementById("sites-display");

let isBlocking = false;
let sites = [];

function updateRules() {
    browser.declarativeNetRequest.getDynamicRules().then((existing) => {
        const existingIds = existing.map((r) => r.id);
        const newRules = isBlocking ? sites.map((site, index) => ({
            id: index + 1, // declarativeNetRequest is 1-indexed fsr
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: site, resourceTypes: ["main_frame"] },
        })) : [];
        browser.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingIds,
            addRules: newRules,
        });
    });
}

function renderList() {
    sitesDisplay.innerHTML = "";
    sites.forEach((site, index) => {
        console.log((site, index));
        const li = document.createElement("li");
        li.textContent = site;

        const remove = document.createElement("button");
        remove.textContent = "remove";
        remove.onclick = () => {
            console.log(`removing ${site}`);
            sites.splice(index, 1);
            browser.storage.local.set({ sites });

            updateRules();
            renderList();
        };

        li.appendChild(remove);
        sitesDisplay.appendChild(li);
    });
}

browser.storage.local.get(["sites", "isBlocking"]).then((data) => {
    sites = data.sites || [];
    isBlocking = data.isBlocking !== undefined ? data.isBlocking : true;

    console.log(isBlocking);
    status.textContent = isBlocking ? "active" : "inactive";
    toggle.textContent = isBlocking ? "unblock" : "block";

    updateRules();
    renderList();
})

toggle.onclick = () => {
    isBlocking = !isBlocking;
    browser.storage.local.set({ isBlocking });

    status.textContent = isBlocking ? "active" : "inactive";
    toggle.textContent = isBlocking ? "unblock" : "block";

    updateRules();
}

add.onclick = () => {
    const site = newSite.value.trim();
    
    if (site && !sites.includes(site)) {
        sites.push(site);
        browser.storage.local.set({ sites });

        updateRules();
        renderList();

        newSite.value = "";
    }
}