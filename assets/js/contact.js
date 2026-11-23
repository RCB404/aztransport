// Numere internaționale cu prefixul țării, de exemplu +40 urmat de numărul național.
const dispatchNumbers = { call: "", whatsapp: "" };

for (const link of document.querySelectorAll("[data-channel]")) {
  const channel = link.dataset.channel;
  const number = dispatchNumbers[channel].replace(/[\s()-]/g, "");
  if (!/^\+[1-9]\d{6,14}$/.test(number)) continue;
  link.href = channel === "call" ? "tel:" + number : "https://wa.me/" + number.slice(1);
}

const cityDialog = document.querySelector("#city-contact");
if (cityDialog) {
  document.addEventListener("click", event => {
    const city = event.target.closest("[data-town]");
    if (!city) return;
    const town = city.dataset.town;
    const nation = city.dataset.nation;
    const selected = document.getElementById("sens").value;
    const returning = selected.endsWith("→ România");
    const route = nation === "România" ? selected : (returning ? nation + " → România" : "România → " + nation);
    const departure = route.startsWith(nation + " →");
    const detail = (departure ? "Plecare din " : "Sosire în ") + town;
    document.getElementById("city-title").textContent = town;
    document.getElementById("city-context").textContent = route + " · " + detail;
    let available = 0;
    for (const link of cityDialog.querySelectorAll("[data-channel]")) {
      const channel = link.dataset.channel;
      const number = dispatchNumbers[channel].replace(/[\s()-]/g, "");
      if (/^\+[1-9]\d{6,14}$/.test(number)) {
        available++;
        link.href = channel === "call" ? "tel:" + number : "https://wa.me/" + number.slice(1) + "?text=" + encodeURIComponent("Bună ziua! Doresc o ofertă pentru " + route + ". " + detail + ".");
      } else {
        link.href = document.querySelector(".quick-contact [data-channel='" + channel + "']").href;
      }
    }
    document.getElementById("city-note").hidden = available === 2;
    cityDialog.showModal();
  });
}

const routeMenu = document.querySelector(".routes-menu");
if (routeMenu) {
  document.addEventListener("click", event => {
    if (!routeMenu.contains(event.target)) routeMenu.open = false;
  });
  routeMenu.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      routeMenu.open = false;
      routeMenu.querySelector("summary").focus();
    }
  });
}
