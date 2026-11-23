const form = document.querySelector("form");
const byId = id => document.getElementById(id);
function setMinimumDate() {
  const now = new Date();
  byId("date").min = [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
}
const isParcel = form.dataset.service === "colete";
if (isParcel) {
  const route = new URLSearchParams(location.search).get("ruta");
  const names = {romania: "România", austria: "Austria", germania: "Germania"};
  for (const option of byId("sens").options) {
    const slug = option.value.split(" → ").map(name => Object.keys(names).find(key => names[key] === name)).join("-");
    if (slug === route) option.selected = true;
  }
}
setMinimumDate();
form.addEventListener("input", () => {
  byId("result").hidden = true;
  byId("feedback").textContent = "";
});
form.addEventListener("submit", event => {
  event.preventDefault();
  setMinimumDate();
  for (const id of (isParcel ? ["start", "end", "size", "contents"] : ["start", "end"])) byId(id).value = byId(id).value.trim();
  if (!form.reportValidity()) return;
  const date = byId("date").value.split("-").reverse().join(".");
  const lines = isParcel ? [
    "Bună ziua! Doresc o ofertă pentru transport de colete.", byId("sens").value,
    "Ridicare: " + byId("start").value, "Livrare: " + byId("end").value,
    "Data dorită: " + date, "Colete: " + byId("packages").value,
    "Greutate totală: " + byId("weight").value + " kg", "Dimensiuni (cm): " + byId("size").value,
    "Conținut: " + byId("contents").value
  ] : [
    "Bună ziua! Aș dori o ofertă pentru transport.", byId("sens").value,
    "Plecare: " + byId("start").value, "Destinație: " + byId("end").value,
    "Data: " + date, "Persoane: " + byId("people").value
  ];
  byId("message").value = lines.join("\n");
  byId("result").hidden = false;
  byId("message").focus();
});
byId("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(byId("message").value);
    byId("feedback").textContent = "Mesaj copiat.";
  } catch {
    byId("message").select();
    byId("feedback").textContent = "Copiază textul selectat.";
  }
});

const countryPage = document.querySelector("main[data-country]");
if (countryPage) {
  const selector = byId("sens");
  const directions = document.querySelectorAll("[data-dir]");
  const isReturn = route => route.endsWith("→ România");
  let previousRoute = selector.value;
  function applyDirection(reverse) {
    if (isReturn(selector.value) !== reverse) {
      const [from, to] = selector.value.split(" → ");
      selector.value = to + " → " + from;
    }
    if (isReturn(previousRoute) !== reverse) {
      [byId("start").value, byId("end").value] = [byId("end").value, byId("start").value];
    }
    previousRoute = selector.value;
    const origin = (countryPage.dataset.country === "romania") !== reverse;
    byId("area-title").textContent = origin ? "Localități de plecare" : "Localități de destinație";
    for (const link of directions) link.setAttribute("aria-current", String((link.dataset.dir === "retur") === reverse));
    byId("result").hidden = true;
  }
  function choose(reverse) {
    const url = new URL(location.href);
    url.searchParams.set("sens", reverse ? "retur" : "tur");
    applyDirection(reverse);
    if (url.protocol !== "file:") history.replaceState(null, "", url);
  }
  for (const link of directions) link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    choose(link.dataset.dir === "retur");
  });
  selector.addEventListener("change", () => choose(isReturn(selector.value)));
  applyDirection(new URLSearchParams(location.search).get("sens") === "retur");
}
