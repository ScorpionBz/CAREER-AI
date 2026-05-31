const PIN = "SHDW2026";
let deferredPrompt;
const $ = (id) => document.getElementById(id);

window.addEventListener("load", () => {
  setTimeout(() => $("splash").classList.add("hide"), 900);
  loadData();
  renderApps();
});

$("menuBtn").addEventListener("click", () => $("mobileMenu").classList.toggle("show"));
document.querySelectorAll("#mobileMenu a").forEach(a => a.addEventListener("click", () => $("mobileMenu").classList.remove("show")));

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $("installBtn").classList.remove("hidden");
});
$("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return alert("En Chrome: toca ⋮ y elige 'Agregar a pantalla principal'.");
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("installBtn").classList.add("hidden");
});

async function loadData(){
  const res = await fetch("data.json?ts=" + Date.now());
  const data = await res.json();
  const savedMvp = JSON.parse(localStorage.getItem("shdw_mvp") || "null");
  const mvp = savedMvp || data.mvp;

  $("metaList").innerHTML = data.metas.map(w => `<article class="weapon"><h3>${w.name}</h3><strong>${w.weapon}</strong><small>${w.use}</small><p>${w.build}</p></article>`).join("");
  $("mvpBox").innerHTML = `<strong>${mvp.name}</strong><p>${mvp.region} · ${mvp.month || "Mes actual"}</p><p>${mvp.reason}</p>`;
  $("rankingList").innerHTML = data.ranking.map(r => `<div><b>#${r.pos}</b><span>${r.name}</span><small>${r.role} · ${r.region}</small></div>`).join("");
}

$("joinForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const entry = Object.fromEntries(form.entries());
  entry.date = new Date().toLocaleString();
  const apps = JSON.parse(localStorage.getItem("shdw_apps") || "[]");
  apps.push(entry);
  localStorage.setItem("shdw_apps", JSON.stringify(apps));
  e.target.reset();
  $("joinMsg").classList.remove("hidden");
});

$("unlockBtn").addEventListener("click", () => {
  if ($("pinInput").value === PIN) {
    $("adminPanel").classList.remove("hidden");
    renderApps();
  } else {
    alert("PIN incorrecto");
  }
});

$("saveMvp").addEventListener("click", () => {
  const mvp = {name:$("mvpName").value || "Por definir", region:$("mvpRegion").value || "Global", reason:$("mvpReason").value || "Seleccionado por SCORPIONBZ", month:"Mes actual"};
  localStorage.setItem("shdw_mvp", JSON.stringify(mvp));
  loadData();
  alert("MVP actualizado en este dispositivo");
});

function renderApps(){
  const apps = JSON.parse(localStorage.getItem("shdw_apps") || "[]");
  $("applications").innerHTML = apps.length ? apps.map(a => `<div class="application"><strong>${a.gamertag}</strong><p>${a.region} · ${a.platform} · K/D: ${a.kd}</p><small>${a.date}</small></div>`).join("") : "<p class='muted'>Aún no hay solicitudes guardadas en este dispositivo.</p>";
}

if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js");
