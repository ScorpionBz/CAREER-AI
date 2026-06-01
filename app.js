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

let members = {}, requests = {}, news = {}, playerProfiles = {}, tournamentPlayers = {}, tournamentTeams = {}, profiles = {}, mvp = {name:"Por definir", region:"Global", reason:"Seleccionado por ScorpionBz"};

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
onValue(ref(db,"playerProfiles"), snap => { playerProfiles = snap.val() || {}; renderAll(); });
onValue(ref(db,"tournamentPlayers"), snap => { tournamentPlayers = snap.val() || {}; renderAll(); });
onValue(ref(db,"tournamentTeams"), snap => { tournamentTeams = snap.val() || {}; renderAll(); });
onValue(ref(db,"profiles"), snap => { profiles = snap.val() || {}; renderAll(); });

function renderAll(){ renderStats(); renderMembers(); renderRanking(); renderNews(); renderMvp(); renderRequests(); renderRegions(); renderVipProfiles(); renderAdminMembers(); renderPlayerProfiles(); renderXPRanking(); renderTournamentPlayers(); renderBalancedTeams(); }

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





// Compartir app SHDW - versión corregida
const SHDW_APP_URL = "https://scorpionbz.github.io/Shadow-Ops-global/";

function fallbackCopyLink(){
  const text = SHDW_APP_URL;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Enlace copiado. Pégalo en WhatsApp, Discord o Facebook.");
    }).catch(() => {
      prompt("Copia el enlace de la app:", text);
    });
  } else {
    prompt("Copia el enlace de la app:", text);
  }
}

async function shareShadowOpsApp(){
  const data = {
    title: "Shadow Ops Global [SHDW]",
    text: "🦅 Únete a Shadow Ops Global [SHDW]. Operamos en las sombras, dominamos el campo. Reclutamiento abierto.",
    url: SHDW_APP_URL
  };

  try {
    if (navigator.share) {
      await navigator.share(data);
    } else {
      fallbackCopyLink();
    }
  } catch (err) {
    fallbackCopyLink();
  }
}

["shareBtn","shareRecruitBtn","floatingShareBtn"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      shareShadowOpsApp();
    };
  }
});


function renderVipProfiles(){
  const box = document.getElementById("vipProfilesList");
  if(!box) return;
  const list = arr(profiles).filter(p => p.approved === true || p.status === "approved");
  box.innerHTML = list.length ? list.map(p => `
    <div class="vipCard">
      ${p.avatar ? `<img src="${p.avatar}" alt="${p.gamertag}">` : `<div class="avatar"></div>`}
      <h3>💎 ${p.gamertag || "Jugador VIP"}</h3>
      <p>${p.rank || "VIP Member"} · ${p.region || "Global"}<br>Discord: ${p.discord || "No agregado"}</p>
      <small>${p.bio || "Perfil premium SHDW"}</small>
    </div>
  `).join("") : `<p>Aún no hay perfiles VIP aprobados.</p>`;
}

function renderAdminMembers(){
  const box = document.getElementById("adminMembersList");
  if(!box) return;
  const list = arr(members);
  box.innerHTML = list.length ? list.map(m => `
    <div class="memberAdmin">
      <div><strong>${m.gamertag || "Operador"}</strong><br><small>${m.rank || "Recruit"} · ${m.region || "Global"} · Discord: ${m.discord || "N/A"}</small></div>
      <button class="deleteBtn" onclick="deleteMember('${m.id}', '${(m.gamertag || "este miembro").replace(/'/g,"")}')">Eliminar</button>
    </div>
  `).join("") : `<p>Sin miembros oficiales.</p>`;
}

const vipProfileForm = document.getElementById("vipProfileForm");
if(vipProfileForm){
  vipProfileForm.onsubmit = async e => {
    e.preventDefault();
    const entry = Object.fromEntries(new FormData(e.target).entries());
    entry.status = "pending";
    entry.approved = false;
    entry.type = "vipProfile";
    entry.createdAt = new Date().toISOString();
    await push(ref(db,"profiles"), entry);
    e.target.reset();
    const msg = document.getElementById("vipMsg");
    if(msg) msg.classList.remove("hidden");
  };
}

window.deleteMember = async (id, name) => {
  if(!confirm(`¿Seguro que quieres eliminar a ${name} de Shadow Ops?`)) return;
  await remove(ref(db,"members/" + id));
  await push(ref(db,"notifications"), {
    title: "Miembro eliminado",
    body: `${name} fue eliminado por Command Center.`,
    type: "member_removed",
    createdAt: new Date().toISOString()
  });
};

window.approveVipProfile = async id => {
  await set(ref(db,"profiles/" + id + "/approved"), true);
  await set(ref(db,"profiles/" + id + "/status"), "approved");
};


// Fix anclas galería torneos
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
      const sidebar = document.querySelector(".sidebar");
      const overlay = document.getElementById("sidebarOverlay");
      if(sidebar) sidebar.classList.remove("show");
      if(overlay) overlay.classList.remove("show");
      document.body.classList.remove("menuOpen");
    }
  });
});


function getRankFromXP(xp){
  xp = Number(xp) || 0;
  if(xp >= 100000) return "💀 Shadow Immortal";
  if(xp >= 60000) return "🔥 Legend";
  if(xp >= 30000) return "👑 General";
  if(xp >= 15000) return "🛡️ Captain";
  if(xp >= 7500) return "⚔️ Elite";
  if(xp >= 2500) return "🦅 Operative";
  return "🎯 Recruit";
}

function renderPlayerProfiles(){
  const box = document.getElementById("playerProfilesList");
  if(!box) return;
  const list = arr(playerProfiles);
  box.innerHTML = list.length ? list.map(p => `
    <div class="profileCard">
      ${p.photo ? `<img src="${p.photo}" alt="${p.gamertag}">` : `<div class="avatar"></div>`}
      <h3>${p.gamertag || "Jugador SHDW"}</h3>
      <p>${getRankFromXP(p.xp)} · ${p.region || "Global"}<br>Rol: ${p.role || "Operador"}<br>Discord: ${p.discord || "No agregado"}</p>
      <small>K/D: ${p.kd || "0.00"} · Victorias: ${p.wins || "0"}</small>
    </div>
  `).join("") : `<p>Aún no hay perfiles de jugadores.</p>`;
}

function renderXPRanking(){
  const box = document.getElementById("xpRanking");
  if(!box) return;
  const combined = [...arr(playerProfiles), ...arr(members)].sort((a,b)=>(Number(b.xp)||0)-(Number(a.xp)||0)).slice(0,10);
  box.innerHTML = combined.length ? combined.map((p,i)=>`
    <div class="row"><span>${i+1}</span><strong>${p.gamertag || "Jugador"}</strong><span>${getRankFromXP(p.xp)}</span><span>${p.xp || 0} XP</span><span>${p.region || "Global"}</span></div>
  `).join("") : `<p>Aún no hay ranking XP.</p>`;
}

function renderTournamentPlayers(){
  const box = document.getElementById("tournamentPlayersList");
  if(!box) return;
  const list = arr(tournamentPlayers);
  box.innerHTML = list.length ? list.map(p=>`
    <div class="tournamentPlayer">
      <div><strong>${p.gamertag}</strong><br><small>${p.role} · K/D ${p.kd || "0.00"} · XP ${p.xp || 0}</small></div>
      <span>${p.discord || ""}</span>
    </div>
  `).join("") : `<p>Aún no hay jugadores registrados al torneo.</p>`;
}

function renderBalancedTeams(){
  const box = document.getElementById("balancedTeamsList");
  if(!box) return;
  const teams = arr(tournamentTeams);
  box.innerHTML = teams.length ? teams.map((team,i)=>`
    <div class="teamCard">
      <h3>Equipo ${i+1}</h3>
      <ul>${(team.players || []).map(p=>`<li>${p.gamertag} · K/D ${p.kd || "0.00"} · XP ${p.xp || 0}</li>`).join("")}</ul>
      <small>Poder total: ${team.power?.toFixed ? team.power.toFixed(2) : team.power}</small>
    </div>
  `).join("") : `<p>Los equipos aparecerán cuando ScorpionBz haga el sorteo.</p>`;
}

const playerProfileForm = document.getElementById("playerProfileForm");
if(playerProfileForm){
  playerProfileForm.onsubmit = async e => {
    e.preventDefault();
    const p = Object.fromEntries(new FormData(e.target).entries());
    p.xp = p.xp || 0;
    p.createdAt = new Date().toISOString();
    await push(ref(db,"playerProfiles"), p);
    e.target.reset();
    const msg = document.getElementById("profileMsg");
    if(msg) msg.classList.remove("hidden");
  };
}

const tournamentSignupForm = document.getElementById("tournamentSignupForm");
if(tournamentSignupForm){
  tournamentSignupForm.onsubmit = async e => {
    e.preventDefault();
    const p = Object.fromEntries(new FormData(e.target).entries());
    p.createdAt = new Date().toISOString();
    await push(ref(db,"tournamentPlayers"), p);
    e.target.reset();
    const msg = document.getElementById("tournamentMsg");
    if(msg) msg.classList.remove("hidden");
  };
}

function playerPower(p){
  const kd = Number(p.kd) || 0;
  const xp = Number(p.xp) || 0;
  return kd * 1000 + xp / 20;
}

function generateBalancedTeams(players, teamSize){
  const sorted = [...players].sort((a,b)=>playerPower(b)-playerPower(a));
  const teamCount = Math.max(1, Math.ceil(sorted.length / teamSize));
  const teams = Array.from({length: teamCount}, () => ({players:[], power:0}));
  sorted.forEach((p, index) => {
    teams.sort((a,b)=>a.power-b.power);
    const target = teams.find(t => t.players.length < teamSize) || teams[0];
    target.players.push(p);
    target.power += playerPower(p);
  });
  return teams;
}

const generateTeamsBtn = document.getElementById("generateTeamsBtn");
if(generateTeamsBtn){
  generateTeamsBtn.onclick = async () => {
    const players = arr(tournamentPlayers);
    if(players.length < 2) return alert("Necesitas al menos 2 jugadores registrados.");
    const teamSize = Number(document.getElementById("teamSize")?.value) || 4;
    const teams = generateBalancedTeams(players, teamSize);
    await set(ref(db,"tournamentTeams"), teams);
    await push(ref(db,"notifications"), {title:"Equipos sorteados", body:"Los equipos del torneo fueron generados automáticamente.", type:"tournament", createdAt:new Date().toISOString()});
  };
}

const clearTournamentBtn = document.getElementById("clearTournamentBtn");
if(clearTournamentBtn){
  clearTournamentBtn.onclick = async () => {
    if(!confirm("¿Limpiar jugadores y equipos del torneo?")) return;
    await set(ref(db,"tournamentPlayers"), {});
    await set(ref(db,"tournamentTeams"), {});
  };
}
