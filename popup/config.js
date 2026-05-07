const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const add = document.getElementById("add");
const newSite = document.getElementById("new-site");
const sitesDisplay = document.getElementById("sites-display");

let isBlocking = false;
let sites = [];

function renderList() {
    sitesDisplay.innerHTML = "";
    sites.forEach((site, index) => {
        const li = document.createElement("li");
        li.textContent = site;

        const remove = document.createElement("button");
        remove.textContent = "remove";
        remove.onclick = () => {
            sites.splice(index, 1);
            browser.storage.local.set({ sites });

            renderList();
        };

        li.appendChild(remove);
        sitesDisplay.appendChild(li);
    });
}

browser.storage.local.get(["sites", "isBlocking"]).then((data) => {
    sites = data.sites || [];
    isBlocking = data.isBlocking !== undefined ? data.isBlocking : true;

    status.textContent = isBlocking ? "active" : "inactive";
    toggle.textContent = isBlocking ? "unblock" : "block";

    renderList();
})

toggle.onclick = () => {
    isBlocking = !isBlocking;
    browser.storage.local.set({ isBlocking });

    status.textContent = isBlocking ? "active" : "inactive";
    toggle.textContent = isBlocking ? "unblock" : "block";
}

add.onclick = () => {
    const site = newSite.value.trim();
    
    if (site && !sites.includes(site)) {
        sites.push(site);
        browser.storage.local.set({ sites });

        renderList();

        newSite.value = "";
    }
}