import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";import{getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged}from"https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";import{getDatabase,ref,push,set,remove,onValue,update}from"https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
const firebaseConfig={apiKey:"AIzaSyBZvDWirBRKPMo2sXelA7hCSR1PblQQrRM",authDomain:"shadow-ops-global.firebaseapp.com",databaseURL:"https://shadow-ops-global-default-rtdb.firebaseio.com",projectId:"shadow-ops-global",storageBucket:"shadow-ops-global.firebasestorage.app",messagingSenderId:"405014223883",appId:"1:405014223883:web:9e30c0bc8835207390fb0e"};
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getDatabase(app),$=id=>document.getElementById(id);let members={},requests={},news={},profiles={},tourP={},tourT={},victories={},notifications={},mvp={name:"Por definir",region:"Global",reason:"Seleccionado por ScorpionBz"};const refCode=new URLSearchParams(location.search).get("ref")||"";
const arr=o=>Object.entries(o||{}).map(([id,v])=>({id,...v}));const rankXP=x=>{x=Number(x)||0;if(x>=100000)return"💀 Shadow Immortal";if(x>=60000)return"🔥 Legend";if(x>=30000)return"👑 General";if(x>=15000)return"🛡️ Captain";if(x>=7500)return"⚔️ Elite";if(x>=2500)return"🦅 Operative";return"🎯 Recruit"};const i18n={es:"OPERAMOS EN LAS SOMBRAS, DOMINAMOS EL CAMPO.",en:"WE OPERATE IN THE SHADOWS, WE DOMINATE THE FIELD.",pt:"OPERAMOS NAS SOMBRAS, DOMINAMOS O CAMPO.",fr:"NOUS OPÉRONS DANS L'OMBRE, NOUS DOMINONS LE TERRAIN."};
window.addEventListener("load",()=>setTimeout(()=>$("splash").classList.add("hide"),800));$("lang").onchange=e=>document.querySelector("[data-i18n]").textContent=i18n[e.target.value]||i18n.es;
function show(id){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));$(id)?.classList.add("active");closeSide();scrollTo(0,0)}document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>show(b.dataset.tab));function openSide(){$("side").classList.add("show");$("overlay").classList.add("show")}function closeSide(){$("side").classList.remove("show");$("overlay").classList.remove("show")}$("menu").onclick=openSide;$("close").onclick=closeSide;$("overlay").onclick=closeSide;
onValue(ref(db,"members"),s=>{members=s.val()||{};render()});onValue(ref(db,"requests"),s=>{requests=s.val()||{};render()});onValue(ref(db,"news"),s=>{news=s.val()||{};render()});onValue(ref(db,"playerProfiles"),s=>{profiles=s.val()||{};render()});onValue(ref(db,"tournamentPlayers"),s=>{tourP=s.val()||{};render()});onValue(ref(db,"tournamentTeams"),s=>{tourT=s.val()||{};render()});onValue(ref(db,"victories"),s=>{victories=s.val()||{};render()});onValue(ref(db,"notifications"),s=>{notifications=s.val()||{};render()});onValue(ref(db,"mvp"),s=>{mvp=s.val()||mvp;render()});
function render(){const all=[...arr(profiles),...arr(members)];$("stM").textContent=arr(members).length||arr(profiles).length;$("stW").textContent=all.reduce((s,x)=>s+(+x.wins||0),0);let kd=all.map(x=>+x.kd).filter(x=>x>0);$("stK").textContent=kd.length?(kd.reduce((a,b)=>a+b,0)/kd.length).toFixed(2):"0.00";$("stXP").textContent=all.reduce((s,x)=>s+(+x.xp||0),0);renderProfiles();renderRank();renderXP();renderTour();renderGallery();renderNotif();renderHall();renderAdmin();}
function renderProfiles(){let list=arr(profiles);$("profilesList").innerHTML=list.length?list.map(p=>`<div class="profileCard">${p.photo?`<img src="${p.photo}">`:""}<h3>${p.gamertag}</h3><p>${rankXP(p.xp)} · ${p.region||"Global"}<br>${p.role||"Operador"} · ${p.discord||"N/A"}</p><small>K/D ${p.kd||0} · Wins ${p.wins||0} · XP ${p.xp||0}</small></div>`).join(""):"<p>Aún no hay perfiles.</p>"}
function renderRank(){let list=[...arr(profiles),...arr(members)].sort((a,b)=>(+b.kd||0)-(+a.kd||0)).slice(0,10);$("rankList").innerHTML=list.length?list.map((p,i)=>`<div class="row"><span>${i+1}</span><b>${p.gamertag||"Jugador"}</b><span>${p.region||"Global"}</span><span>${p.kd||0}</span><span>${p.wins||0}</span></div>`).join(""):"<p>Sin ranking.</p>"}
function renderXP(){let list=[...arr(profiles),...arr(members)].sort((a,b)=>(+b.xp||0)-(+a.xp||0)).slice(0,10);$("xpList").innerHTML=list.length?list.map((p,i)=>`<div class="row"><span>${i+1}</span><b>${p.gamertag}</b><span>${rankXP(p.xp)}</span><span>${p.xp||0} XP</span><span>${p.region||"Global"}</span></div>`).join(""):"<p>Sin XP.</p>"}
const power=p=>(+p.kd||0)*1000+(+p.xp||0)/20+(+p.wins||0)*30;function renderTour(){let p=arr(tourP);$("tourPlayers").innerHTML=p.length?p.map(x=>`<div class="request"><b>${x.gamertag}</b><p>${x.role} · K/D ${x.kd||0} · XP ${x.xp||0}</p></div>`).join(""):"<p>Sin registrados.</p>";let t=arr(tourT);$("teams").innerHTML=t.length?t.map((tm,i)=>`<div class="teamCard"><h3>Equipo ${i+1}</h3><ul>${(tm.players||[]).map(p=>`<li>${p.gamertag} · ${p.kd||0} KD · ${p.xp||0} XP</li>`).join("")}</ul></div>`).join(""):"<p>Sin equipos.</p>"}
function renderGallery(){let ap=arr(victories).filter(v=>v.status==="approved");$("galleryList").innerHTML=ap.length?ap.map(v=>`<div class="galleryCard"><img src="${v.image}"><h3>${v.gamertag}</h3><p>${v.kills||0} kills · ${v.mode||"Warzone"}</p></div>`).join(""):"<p class='card'>Sin victorias aprobadas.</p>";let totals={};ap.forEach(v=>totals[v.gamertag]=(totals[v.gamertag]||0)+(+v.kills||0));let max=Math.max(1,...Object.values(totals));$("killsChart").innerHTML=Object.entries(totals).map(([n,k])=>`<div class="bar" style="height:${Math.max(8,k/max*150)}px">${n}<br>${k}</div>`).join("")||"<p>Sin kills.</p>"}
function renderNotif(){$("notifyList").innerHTML=arr(notifications).reverse().slice(0,30).map(n=>`<div class="notification"><b>${n.title}</b><p>${n.body}</p></div>`).join("")||"<p>Sin notificaciones.</p>"}
function renderHall(){let f=arr(members).filter(m=>m.founderMember);$("hallList").innerHTML=f.length?f.map(m=>`<div class="card"><h3>🏅 ${m.gamertag}</h3><p>Founder 20 #${m.founderNumber}</p></div>`).join(""):"<p>Aún no hay Founder 20.</p>"}
function renderAdmin(){if(!$("reqList"))return;$("reqList").innerHTML=arr(requests).map(r=>`<div class="request"><h3>${r.gamertag}</h3><p>${r.email}<br>${r.region} · Ref: ${r.ref||"N/A"}</p><button class="red" onclick="acceptRequest('${r.id}')">Aceptar</button><button onclick="rejectRequest('${r.id}')">Rechazar</button></div>`).join("")||"<p>Sin solicitudes.</p>";$("adminMembers").innerHTML=arr(members).map(m=>`<div class="memberAdmin"><b>${m.gamertag}</b><br>${m.rank} · ${m.region}<br><button onclick="deleteMember('${m.id}','${m.gamertag}')">Eliminar</button></div>`).join("")||"<p>Sin miembros.</p>";$("victoryReqs").innerHTML=arr(victories).filter(v=>v.status!=="approved").map(v=>`<div class="victoryReq"><b>${v.gamertag}</b><p>${v.kills||0} kills</p><button class="red" onclick="approveVictory('${v.id}')">Aprobar</button><button onclick="rejectVictory('${v.id}')">Rechazar</button></div>`).join("")||"<p>Sin pendientes.</p>"}
$("search").oninput=e=>{let q=e.target.value.toLowerCase();document.querySelectorAll(".profileCard,.memberAdmin").forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?"":"none")};$("profileForm").onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());p.xp=p.xp||0;p.createdAt=new Date().toISOString();await push(ref(db,"playerProfiles"),p);e.target.reset()};$("tourForm").onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());await push(ref(db,"tournamentPlayers"),p);e.target.reset()};$("victoryForm").onsubmit=async e=>{e.preventDefault();let v=Object.fromEntries(new FormData(e.target).entries());v.status="pending";v.createdAt=new Date().toISOString();await push(ref(db,"victories"),v);e.target.reset()};
$("daily").onclick=()=>alert("Próximamente: check-in diario con usuario conectado.");$("vipSoon").onclick=$("vipSoon2").onclick=()=>alert("💎 SHDW VIP próximamente.");
$("loginBtn").onclick=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value,$("pass").value)}catch(e){alert(e.message)}};$("logout").onclick=()=>signOut(auth);onAuthStateChanged(auth,u=>{if(u){$("login").classList.add("hide");$("panel").classList.remove("hide")}else{$("login").classList.remove("hide");$("panel").classList.add("hide")}});
$("addM").onclick=async()=>push(ref(db,"members"),{gamertag:$("mg").value||"Nuevo",rank:$("mr").value||"Recruit",region:$("mreg").value||"Global",discord:$("md").value||"",kd:$("mkd").value||0,wins:$("mw").value||0,xp:$("mxp").value||0});$("saveMVP").onclick=async()=>{await set(ref(db,"mvp"),{name:$("mvpN").value,region:$("mvpR").value,reason:$("mvpWhy").value});await push(ref(db,"notifications"),{title:"Nuevo MVP",body:`${$("mvpN").value} fue nombrado MVP.`,createdAt:new Date().toISOString()})};$("addNews").onclick=async()=>push(ref(db,"notifications"),{title:$("nt").value||"Noticia SHDW",body:$("nb").value||"Nuevo anuncio.",createdAt:new Date().toISOString()});
$("genTeams").onclick=async()=>{let players=arr(tourP);if(players.length<2)return alert("Necesitas 2 jugadores.");let size=+$("teamSize").value||4,count=Math.ceil(players.length/size),teams=Array.from({length:count},()=>({players:[],power:0}));players.sort((a,b)=>power(b)-power(a)).forEach(p=>{teams.sort((a,b)=>a.power-b.power);let t=teams.find(x=>x.players.length<size)||teams[0];t.players.push(p);t.power+=power(p)});await set(ref(db,"tournamentTeams"),teams)};$("clearTour").onclick=async()=>{await set(ref(db,"tournamentPlayers"),{});await set(ref(db,"tournamentTeams"),{})};
window.acceptRequest=async id=>{let r=requests[id],num=Object.keys(members).length+1,isF=num<=20;await push(ref(db,"members"),{gamertag:r.gamertag,rank:isF?"🏅 Fundador SHDW":"Recruit",founderMember:isF,founderNumber:isF?num:null,region:r.region,discord:r.discord||"",kd:r.kd||0,wins:0,xp:isF?500:0,emailPrivate:r.email});if(r.ref)await push(ref(db,"notifications"),{title:"XP por referido",body:`${r.ref} ganó +500 XP porque su invitado fue aceptado.`});await remove(ref(db,"requests/"+id))};window.rejectRequest=id=>remove(ref(db,"requests/"+id));window.deleteMember=(id,n)=>confirm(`¿Eliminar a ${n}?`)&&remove(ref(db,"members/"+id));window.approveVictory=async id=>{let v=victories[id];await update(ref(db,"victories/"+id),{status:"approved"});await push(ref(db,"notifications"),{title:"Victoria aprobada",body:`${v.gamertag} subió ${v.kills||0} kills.`})};window.rejectVictory=id=>remove(ref(db,"victories/"+id));
$("topProfile").onclick=()=>{$("modal").classList.remove("hide");let p=arr(profiles)[0]||arr(members)[0]||{gamertag:"ScorpionBz",rank:"Global Commander",xp:0,region:"México"};$("modalContent").innerHTML=`<h3>${p.gamertag}</h3><p>${p.rank||rankXP(p.xp)}<br>${p.region||"Global"}<br>XP: ${p.xp||0}<br>Discord: ${p.discord||"N/A"}</p>`};$("closeModal").onclick=()=>$("modal").classList.add("hide");
async function share(){let url="https://scorpionbz.github.io/Shadow-Ops-global/?ref=ScorpionBz",data={title:"Shadow Ops Global [SHDW]",text:"🦅 Únete a Shadow Ops Global. Reclutamiento abierto.",url};try{navigator.share?await navigator.share(data):(await navigator.clipboard.writeText(url),alert("Enlace copiado"))}catch(e){prompt("Copia el enlace:",url)}}$("share").onclick=share;$("floatShare").onclick=share;if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js");

// FIX idioma completo + buscador global
const SHDW_TRANSLATIONS = {
  es: {
    slogan:"OPERAMOS EN LAS SOMBRAS, DOMINAMOS EL CAMPO.",
    navHome:"🏠 Inicio", navProfiles:"👤 Perfiles", navRanking:"🏆 Ranking", navXP:"🎖️ XP",
    navTournaments:"⚔️ Torneos", navGallery:"📸 Galería", navNotifications:"🔔 Notificaciones",
    navVIP:"💎 VIP", navHall:"👑 Hall of Fame",
    profilesTitle:"Perfiles", rankingTitle:"Ranking Global", xpTitle:"Sistema XP",
    tourTitle:"Torneos Balanceados", galleryTitle:"Galería de victorias y kills",
    notificationsTitle:"Notificaciones", hallTitle:"Hall of Fame"
  },
  en: {
    slogan:"WE OPERATE IN THE SHADOWS, WE DOMINATE THE FIELD.",
    navHome:"🏠 Home", navProfiles:"👤 Profiles", navRanking:"🏆 Ranking", navXP:"🎖️ XP",
    navTournaments:"⚔️ Tournaments", navGallery:"📸 Gallery", navNotifications:"🔔 Notifications",
    navVIP:"💎 VIP", navHall:"👑 Hall of Fame",
    profilesTitle:"Profiles", rankingTitle:"Global Ranking", xpTitle:"XP System",
    tourTitle:"Balanced Tournaments", galleryTitle:"Victories and Kills Gallery",
    notificationsTitle:"Notifications", hallTitle:"Hall of Fame"
  },
  pt: {
    slogan:"OPERAMOS NAS SOMBRAS, DOMINAMOS O CAMPO.",
    navHome:"🏠 Início", navProfiles:"👤 Perfis", navRanking:"🏆 Ranking", navXP:"🎖️ XP",
    navTournaments:"⚔️ Torneios", navGallery:"📸 Galeria", navNotifications:"🔔 Notificações",
    navVIP:"💎 VIP", navHall:"👑 Hall da Fama",
    profilesTitle:"Perfis", rankingTitle:"Ranking Global", xpTitle:"Sistema XP",
    tourTitle:"Torneios Balanceados", galleryTitle:"Galeria de vitórias e kills",
    notificationsTitle:"Notificações", hallTitle:"Hall da Fama"
  },
  fr: {
    slogan:"NOUS OPÉRONS DANS L'OMBRE, NOUS DOMINONS LE TERRAIN.",
    navHome:"🏠 Accueil", navProfiles:"👤 Profils", navRanking:"🏆 Classement", navXP:"🎖️ XP",
    navTournaments:"⚔️ Tournois", navGallery:"📸 Galerie", navNotifications:"🔔 Notifications",
    navVIP:"💎 VIP", navHall:"👑 Hall of Fame",
    profilesTitle:"Profils", rankingTitle:"Classement Global", xpTitle:"Système XP",
    tourTitle:"Tournois Équilibrés", galleryTitle:"Galerie victoires et kills",
    notificationsTitle:"Notifications", hallTitle:"Hall of Fame"
  }
};

function applyLanguage(lang){
  const pack = SHDW_TRANSLATIONS[lang] || SHDW_TRANSLATIONS.es;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if(pack[key]) el.textContent = pack[key];
  });
  localStorage.setItem("shdw_lang", lang);
}

const langSelectFixed = document.getElementById("lang");
if(langSelectFixed){
  const savedLang = localStorage.getItem("shdw_lang") || "es";
  langSelectFixed.value = savedLang;
  applyLanguage(savedLang);
  langSelectFixed.addEventListener("change", e => applyLanguage(e.target.value));
}

function normalizeSHDW(text){
  return (text || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function runPlayerSearch(){
  const input = document.getElementById("search");
  if(!input) return;
  const q = normalizeSHDW(input.value);
  const cards = document.querySelectorAll(".profileCard,.memberAdmin,.row,.request,.galleryCard,.teamCard");
  cards.forEach(card => {
    const match = normalizeSHDW(card.textContent).includes(q);
    card.style.display = !q || match ? "" : "none";
  });
  if(q){
    const profilesTab = document.getElementById("profiles");
    if(profilesTab && !profilesTab.classList.contains("active")){
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      profilesTab.classList.add("active");
      window.scrollTo({top:0, behavior:"smooth"});
    }
  }
}

const searchFixed = document.getElementById("search");
if(searchFixed){
  searchFixed.addEventListener("input", runPlayerSearch);
  searchFixed.addEventListener("keyup", runPlayerSearch);
  searchFixed.addEventListener("search", runPlayerSearch);
}
