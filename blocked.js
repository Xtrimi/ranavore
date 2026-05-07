const params = new URLSearchParams(location.search);
document.getElementById("url").textContent = `url: ${params.get("url")}`;