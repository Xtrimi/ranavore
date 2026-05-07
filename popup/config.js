const toggle = document.getElementById("toggle");
const status = document.getElementById("status-badge");
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

function renderStatus() {
    status.textContent = isBlocking ? "on" : "off";
    toggle.textContent = isBlocking ? "unblock" : "block";

    status.className = isBlocking ? "status-badge active" : "status-badge inactive";
    toggle.className = isBlocking ? "toggle unblock" : "toggle";
}

function addSite() {
    const site = newSite.value.trim();
    
    if (site && !sites.includes(site)) {
        sites.push(site);
        browser.storage.local.set({ sites });

        renderList();

        newSite.value = "";
    }
}

browser.storage.local.get(["sites", "isBlocking"]).then((data) => {
    sites = data.sites || [];
    isBlocking = data.isBlocking !== undefined ? data.isBlocking : true;

    renderStatus();
    renderList();
})

toggle.onclick = () => {
    isBlocking = !isBlocking;
    browser.storage.local.set({ isBlocking });

    renderStatus();
}

add.onclick = addSite;
newSite.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        addSite();
    }
})