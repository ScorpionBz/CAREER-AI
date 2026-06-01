import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, push, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZvDWirBRKPMo2sXelA7hCSR1PblQQrRM",
  authDomain: "shadow-ops-global.firebaseapp.com",
  databaseURL: "https://shadow-ops-global-default-rtdb.firebaseio.com",
  projectId: "shadow-ops-global",
  storageBucket: "shadow-ops-global.firebasestorage.app",
  messagingSenderId: "405014223883",
  appId: "1:405014223883:web:9e30c0bc8835207390fb0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const $ = id => document.getElementById(id);

let members = {}, requests = {}, news = {}, mvp = {name:"Por definir", region:"Global", reason:"Seleccionado por ScorpionBz"};

window.addEventListener("load", () => setTimeout(() => $("splash").classList.add("hide"), 800));


let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); deferredPrompt = e; $("installBtn").classList.remove("hidden");
});
$("installBtn").onclick = async () => {
  if(!deferredPrompt) return alert("En Chrome toca ⋮ y elige Agregar a pantalla principal.");
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $("installBtn").classList.add("hidden");
};

onValue(ref(db,"members"), snap => { members = snap.val() || {}; renderAll(); });
onValue(ref(db,"requests"), snap => { requests = snap.val() || {}; renderAll(); });
onValue(ref(db,"news"), snap => { news = snap.val() || {}; renderAll(); });
onValue(ref(db,"mvp"), snap => { mvp = snap.val() || mvp; renderAll(); });

function renderAll(){ renderStats(); renderMembers(); renderRanking(); renderNews(); renderMvp(); renderRequests(); renderRegions(); }

function arr(obj){ return Object.entries(obj).map(([id,v]) => ({id,...v})); }

function renderStats(){
  const list = arr(members);
  $("statMembers").textContent = list.length;
  $("statWins").textContent = list.reduce((s,m)=>s+(Number(m.wins)||0),0);
  const kdList = list.map(m=>Number(m.kd)).filter(n=>!isNaN(n) && n>0);
  $("statKD").textContent = kdList.length ? (kdList.reduce((a,b)=>a+b,0)/kdList.length).toFixed(2) : "0.00";
  $("statTournaments").textContent = "0";
}

function renderRegions(){
  const list = arr(members);
  const count = r => list.filter(m => (m.region||"").toLowerCase().includes(r)).length + " miembros";
  $("mxCount").textContent = count("méxico");
  $("naCount").textContent = count("north");
  $("brCount").textContent = count("brasil");
  $("esCount").textContent = count("españa");
  $("latamCount").textContent = count("latam");
  $("intCount").textContent = count("internacional") || count("international");
}

function renderMembers(){
  const list = arr(members);
  $("membersList").innerHTML = list.length ? list.map(m => `
    <div class="member"><div class="avatar"></div><div><strong>${m.gamertag||"Operador"} ${m.founderMember ? "🏅" : ""}</strong><p>${m.rank||"Recruit"} · ${m.region||"Global"}<br>${m.founderMember ? "🏅 Founder 20 #" + m.founderNumber + "<br>" : ""}Discord: ${m.discord||"No agregado"}</p></div></div>
  `).join("") : `<p>Aún no hay miembros oficiales.</p>`;
}

function renderRanking(){
  const list = arr(members).sort((a,b)=>(Number(b.kd)||0)-(Number(a.kd)||0)).slice(0,5);
  $("rankingList").innerHTML = list.length ? list.map((m,i)=>`
    <div class="row"><span>${i+1}</span><strong>${m.gamertag||"Operador"} ${m.founderMember ? "🏅" : ""}</strong><span>${m.region||"🌐"}</span><span>${m.kd||"0.00"}</span><span>${m.wins||"0"}</span></div>
  `).join("") : `<p>Aún no hay ranking.</p>`;
}

function renderNews(){
  const list = arr(news).reverse().slice(0,4);
  $("newsList").innerHTML = list.length ? list.map(n=>`
    <div class="news"><div class="thumb"></div><div><h3>${n.title}</h3><p>${n.body}</p></div><small>${n.date||""}</small></div>
  `).join("") : `<p>Sin noticias por ahora.</p>`;
}

function renderMvp(){
  $("mvpBox").innerHTML = `<strong>${mvp.name}</strong><p>${mvp.region}</p><p>${mvp.reason}</p><button>Ver historial de MVP</button>`;
}

function renderRequests(){
  if(!$("requestsList")) return;
  const list = arr(requests);
  $("requestsList").innerHTML = list.length ? list.map(r=>`
    <div class="request"><h3>${r.gamertag}</h3><p>${r.email}<br>${r.region} · ${r.platform} · K/D ${r.kd||"N/A"}<br>Discord: ${r.discord||"N/A"}</p>
    <div class="requestBtns"><button class="redBtn" onclick="acceptRequest('${r.id}')">Aceptar</button><button onclick="rejectRequest('${r.id}')">Rechazar</button></div></div>
  `).join("") : `<p>Sin solicitudes pendientes.</p>`;
}

$("applyForm").onsubmit = async e => {
  e.preventDefault();
  const entry = Object.fromEntries(new FormData(e.target).entries());
  entry.status = "pending"; entry.createdAt = new Date().toISOString();
  await push(ref(db,"requests"), entry);
  e.target.reset(); $("applyMsg").classList.remove("hidden");
};

$("loginBtn").onclick = async () => {
  try { await signInWithEmailAndPassword(auth, $("adminEmail").value, $("adminPass").value); }
  catch(err){ alert("No se pudo iniciar sesión: " + err.message); }
};
$("logoutBtn").onclick = () => signOut(auth);

onAuthStateChanged(auth, user => {
  if(user){ $("loginBox").classList.add("hidden"); $("adminPanel").classList.remove("hidden"); $("adminUser").textContent = user.email; renderRequests(); }
  else { $("loginBox").classList.remove("hidden"); $("adminPanel").classList.add("hidden"); }
});

$("addMemberBtn").onclick = async () => {
  await push(ref(db,"members"), {
    gamertag:$("mGamertag").value||"Nuevo miembro",
    rank:$("mRank").value||"Recruit",
    region:$("mRegion").value||"Global",
    discord:$("mDiscord").value||"",
    kd:$("mKD").value||"0.00",
    wins:$("mWins").value||"0",
    createdAt:new Date().toISOString()
  });
};

$("saveMvpBtn").onclick = async () => {
  await set(ref(db,"mvp"), {name:$("mvpName").value||"Por definir", region:$("mvpRegion").value||"Global", reason:$("mvpReason").value||"Seleccionado por ScorpionBz", updatedAt:new Date().toISOString()});
};

$("addNewsBtn").onclick = async () => {
  await push(ref(db,"news"), {title:$("newsTitle").value||"Anuncio SHDW", body:$("newsBody").value||"Nuevo anuncio oficial.", date:new Date().toLocaleDateString(), createdAt:new Date().toISOString()});
};

window.acceptRequest = async id => {
  const r = requests[id];
  if(!r) return;

  const founderNumber = Object.keys(members).length + 1;
  const isFounder20 = founderNumber <= 20;

  await push(ref(db,"members"), {
    gamertag: r.gamertag,
    rank: isFounder20 ? "🏅 Fundador SHDW" : "Recruit",
    specialBadge: isFounder20 ? "Founder 20" : "",
    founderMember: isFounder20,
    founderNumber: isFounder20 ? founderNumber : null,
    region: r.region,
    discord: r.discord || "",
    kd: r.kd || "0.00",
    wins: "0",
    emailPrivate: r.email,
    activision: r.activision || "",
    createdAt: new Date().toISOString()
  });

  await push(ref(db,"notifications"), {
    title: isFounder20 ? "Nuevo Fundador SHDW" : "Nuevo recluta aceptado",
    body: isFounder20 ? `${r.gamertag} recibió Founder 20 #${founderNumber}.` : `${r.gamertag} fue aceptado como Recruit.`,
    type: isFounder20 ? "founder20" : "member",
    createdAt: new Date().toISOString()
  });

  await remove(ref(db,"requests/"+id));
};

window.rejectRequest = async id => await remove(ref(db,"requests/"+id));

if("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js");


// Fix menú lateral móvil
const sidebarEl = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const closeSidebarBtn = document.getElementById("closeSidebar");

function openSidebar(){
  sidebarEl.classList.add("show");
  sidebarOverlay.classList.add("show");
  document.body.classList.add("menuOpen");
}
function closeSidebar(){
  sidebarEl.classList.remove("show");
  sidebarOverlay.classList.remove("show");
  document.body.classList.remove("menuOpen");
}

const menuButton = document.getElementById("menuBtn");
if(menuButton){
  menuButton.onclick = () => {
    if(sidebarEl.classList.contains("show")) closeSidebar();
    else openSidebar();
  };
}
if(closeSidebarBtn) closeSidebarBtn.onclick = closeSidebar;
if(sidebarOverlay) sidebarOverlay.onclick = closeSidebar;
document.querySelectorAll(".sidebar a").forEach(a => a.addEventListener("click", closeSidebar));
