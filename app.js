import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";import{getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged}from"https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";import{getDatabase,ref,push,set,remove,onValue,update}from"https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
const firebaseConfig={apiKey:"AIzaSyBZvDWirBRKPMo2sXelA7hCSR1PblQQrRM",authDomain:"shadow-ops-global.firebaseapp.com",databaseURL:"https://shadow-ops-global-default-rtdb.firebaseio.com",projectId:"shadow-ops-global",storageBucket:"shadow-ops-global.firebasestorage.app",messagingSenderId:"405014223883",appId:"1:405014223883:web:9e30c0bc8835207390fb0e"};
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getDatabase(app),$=id=>document.getElementById(id);let members={},requests={},profiles={},tourP={},tourT={},victories={},notifications={},mvp={};const refCode=new URLSearchParams(location.search).get("ref")||"";
const arr=o=>Object.entries(o||{}).map(([id,v])=>({id,...v}));const norm=t=>(t||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");const rankXP=x=>{x=+x||0;if(x>=100000)return"💀 Shadow Immortal";if(x>=60000)return"🔥 Legend";if(x>=30000)return"👑 General";if(x>=15000)return"🛡️ Captain";if(x>=7500)return"⚔️ Elite";if(x>=2500)return"🦅 Operative";return"🎯 Recruit"};
const TR={es:{slogan:"OPERAMOS EN LAS SOMBRAS, DOMINAMOS EL CAMPO.",navHome:"🏠 Inicio",navProfiles:"👤 Perfiles",navRanking:"🏆 Ranking",navXP:"🎖️ XP",navTournaments:"⚔️ Torneos",navGallery:"📸 Galería",navNotifications:"🔔 Notificaciones",navVIP:"💎 VIP",navHall:"👑 Hall of Fame",navCommand:"🦅 Command Center",search:"Buscar jugador...",createProfile:"Crear perfil",tournaments:"Torneos",members:"Miembros",victories:"Victorias",founderText:"Primeros 20 aceptados reciben insignia exclusiva y bonus XP.",seasonTitle:"Temporada 1",seasonText:"XP, misiones, rachas, torneos y reputación SHDW.",fairTitle:"Juego Limpio",fairText:"Tolerancia cero a hacks, Cronus, XIM y ventajas injustas.",profilesTitle:"Perfiles",saveProfile:"Guardar perfil",dailyCheck:"🎁 Check-in diario",rankingTitle:"Ranking Global",xpTitle:"Sistema XP",acceptedRecruit:"Recluta aceptado",wonTournament:"Torneo ganado",tourTitle:"Torneos Balanceados",register:"Registrarme",registered:"Registrados",teams:"Equipos",galleryTitle:"Galería de victorias y kills",uploadReview:"Subir a revisión",killsChart:"Gráfica de kills",notificationsTitle:"Notificaciones",vipText:"Próximamente: perfiles premium, insignias, banners, estadísticas avanzadas y recompensas.",comingSoon:"Próximamente",hallTitle:"Hall of Fame",myProfile:"Mi perfil SHDW"},
en:{slogan:"WE OPERATE IN THE SHADOWS, WE DOMINATE THE FIELD.",navHome:"🏠 Home",navProfiles:"👤 Profiles",navRanking:"🏆 Ranking",navXP:"🎖️ XP",navTournaments:"⚔️ Tournaments",navGallery:"📸 Gallery",navNotifications:"🔔 Notifications",navVIP:"💎 VIP",navHall:"👑 Hall of Fame",navCommand:"🦅 Command Center",search:"Search player...",createProfile:"Create profile",tournaments:"Tournaments",members:"Members",victories:"Victories",founderText:"First 20 accepted members receive exclusive badge and XP bonus.",seasonTitle:"Season 1",seasonText:"XP, missions, streaks, tournaments and SHDW reputation.",fairTitle:"Fair Play",fairText:"Zero tolerance for hacks, Cronus, XIM and unfair advantages.",profilesTitle:"Profiles",saveProfile:"Save profile",dailyCheck:"🎁 Daily check-in",rankingTitle:"Global Ranking",xpTitle:"XP System",acceptedRecruit:"Accepted recruit",wonTournament:"Tournament won",tourTitle:"Balanced Tournaments",register:"Register",registered:"Registered",teams:"Teams",galleryTitle:"Victories and Kills Gallery",uploadReview:"Submit for review",killsChart:"Kills chart",notificationsTitle:"Notifications",vipText:"Coming soon: premium profiles, badges, banners, advanced stats and rewards.",comingSoon:"Coming soon",hallTitle:"Hall of Fame",myProfile:"My SHDW profile"},
pt:{slogan:"OPERAMOS NAS SOMBRAS, DOMINAMOS O CAMPO.",navHome:"🏠 Início",navProfiles:"👤 Perfis",navRanking:"🏆 Ranking",navXP:"🎖️ XP",navTournaments:"⚔️ Torneios",navGallery:"📸 Galeria",navNotifications:"🔔 Notificações",navVIP:"💎 VIP",navHall:"👑 Hall da Fama",navCommand:"🦅 Command Center",search:"Buscar jogador...",createProfile:"Criar perfil",tournaments:"Torneios",members:"Membros",victories:"Vitórias",founderText:"Os primeiros 20 aceitos recebem insígnia exclusiva e bônus XP.",seasonTitle:"Temporada 1",seasonText:"XP, missões, sequências, torneios e reputação SHDW.",fairTitle:"Jogo Limpo",fairText:"Tolerância zero para hacks, Cronus, XIM e vantagens injustas.",profilesTitle:"Perfis",saveProfile:"Salvar perfil",dailyCheck:"🎁 Check-in diário",rankingTitle:"Ranking Global",xpTitle:"Sistema XP",acceptedRecruit:"Recruta aceito",wonTournament:"Torneio vencido",tourTitle:"Torneios Balanceados",register:"Registrar",registered:"Registrados",teams:"Equipes",galleryTitle:"Galeria de vitórias e kills",uploadReview:"Enviar para revisão",killsChart:"Gráfico de kills",notificationsTitle:"Notificações",vipText:"Em breve: perfis premium, insígnias, banners, estatísticas avançadas e recompensas.",comingSoon:"Em breve",hallTitle:"Hall da Fama",myProfile:"Meu perfil SHDW"},
fr:{slogan:"NOUS OPÉRONS DANS L'OMBRE, NOUS DOMINONS LE TERRAIN.",navHome:"🏠 Accueil",navProfiles:"👤 Profils",navRanking:"🏆 Classement",navXP:"🎖️ XP",navTournaments:"⚔️ Tournois",navGallery:"📸 Galerie",navNotifications:"🔔 Notifications",navVIP:"💎 VIP",navHall:"👑 Hall of Fame",navCommand:"🦅 Command Center",search:"Rechercher joueur...",createProfile:"Créer un profil",tournaments:"Tournois",members:"Membres",victories:"Victoires",founderText:"Les 20 premiers acceptés reçoivent un badge exclusif et un bonus XP.",seasonTitle:"Saison 1",seasonText:"XP, missions, séries, tournois et réputation SHDW.",fairTitle:"Fair-play",fairText:"Tolérance zéro pour hacks, Cronus, XIM et avantages injustes.",profilesTitle:"Profils",saveProfile:"Enregistrer profil",dailyCheck:"🎁 Check-in quotidien",rankingTitle:"Classement Global",xpTitle:"Système XP",acceptedRecruit:"Recrue acceptée",wonTournament:"Tournoi gagné",tourTitle:"Tournois Équilibrés",register:"S'inscrire",registered:"Inscrits",teams:"Équipes",galleryTitle:"Galerie victoires et kills",uploadReview:"Soumettre à révision",killsChart:"Graphique des kills",notificationsTitle:"Notifications",vipText:"Bientôt: profils premium, badges, bannières, stats avancées et récompenses.",comingSoon:"Bientôt",hallTitle:"Hall of Fame",myProfile:"Mon profil SHDW"}};
function applyLang(l){let p=TR[l]||TR.es;document.querySelectorAll("[data-i18n]").forEach(e=>{let k=e.dataset.i18n;if(p[k])e.textContent=p[k]});document.querySelectorAll("[data-i18n-placeholder]").forEach(e=>{let k=e.dataset.i18nPlaceholder;if(p[k])e.placeholder=p[k]});localStorage.setItem("shdwLang",l)}
window.addEventListener("load",()=>{setTimeout(()=>$("splash").classList.add("hide"),700);let l=localStorage.getItem("shdwLang")||"es";$("lang").value=l;applyLang(l)});$("lang").onchange=e=>applyLang(e.target.value);
function show(id){document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));$(id)?.classList.add("active");closeSide();scrollTo(0,0);runSearch()}document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>show(b.dataset.tab));function openSide(){$("side").classList.add("show");$("overlay").classList.add("show")}function closeSide(){$("side").classList.remove("show");$("overlay").classList.remove("show")}$("menu").onclick=openSide;$("close").onclick=closeSide;$("overlay").onclick=closeSide;
onValue(ref(db,"members"),s=>{members=s.val()||{};render()});onValue(ref(db,"requests"),s=>{requests=s.val()||{};render()});onValue(ref(db,"playerProfiles"),s=>{profiles=s.val()||{};render()});onValue(ref(db,"tournamentPlayers"),s=>{tourP=s.val()||{};render()});onValue(ref(db,"tournamentTeams"),s=>{tourT=s.val()||{};render()});onValue(ref(db,"victories"),s=>{victories=s.val()||{};render()});onValue(ref(db,"notifications"),s=>{notifications=s.val()||{};render()});
function render(){let all=[...arr(profiles),...arr(members)];$("stM").textContent=arr(members).length||arr(profiles).length;$("stW").textContent=all.reduce((s,x)=>s+(+x.wins||0),0);let kd=all.map(x=>+x.kd).filter(x=>x>0);$("stK").textContent=kd.length?(kd.reduce((a,b)=>a+b,0)/kd.length).toFixed(2):"0.00";$("stXP").textContent=all.reduce((s,x)=>s+(+x.xp||0),0);renderProfiles();renderRank();renderXP();renderTour();renderGallery();renderNotif();renderHall();renderAdmin();runSearch();}
function renderProfiles(){let list=arr(profiles);$("profilesList").innerHTML=list.length?list.map(p=>`<div class="profileCard">${p.photo?`<img src="${p.photo}">`:""}<h3>${p.gamertag}</h3><p>${rankXP(p.xp)} · ${p.region||"Global"}<br>${p.role||"Operador"} · ${p.discord||"N/A"}</p><small>K/D ${p.kd||0} · Wins ${p.wins||0} · XP ${p.xp||0}</small></div>`).join(""):"<p>Aún no hay perfiles.</p>"}
function renderRank(){let list=[...arr(profiles),...arr(members)].sort((a,b)=>(+b.kd||0)-(+a.kd||0)).slice(0,10);$("rankList").innerHTML=list.length?list.map((p,i)=>`<div class="row searchable"><span>${i+1}</span><b>${p.gamertag||"Jugador"}</b><span>${p.region||"Global"}</span><span>${p.kd||0}</span><span>${p.wins||0}</span></div>`).join(""):"<p>Sin ranking.</p>"}
function renderXP(){let list=[...arr(profiles),...arr(members)].sort((a,b)=>(+b.xp||0)-(+a.xp||0)).slice(0,10);$("xpList").innerHTML=list.length?list.map((p,i)=>`<div class="row searchable"><span>${i+1}</span><b>${p.gamertag}</b><span>${rankXP(p.xp)}</span><span>${p.xp||0} XP</span><span>${p.region||"Global"}</span></div>`).join(""):"<p>Sin XP.</p>"}
const power=p=>(+p.kd||0)*1000+(+p.xp||0)/20+(+p.wins||0)*30;function renderTour(){let p=arr(tourP);$("tourPlayers").innerHTML=p.length?p.map(x=>`<div class="request searchable"><b>${x.gamertag}</b><p>${x.role} · K/D ${x.kd||0} · XP ${x.xp||0}</p></div>`).join(""):"<p>Sin registrados.</p>";let t=arr(tourT);$("teams").innerHTML=t.length?t.map((tm,i)=>`<div class="teamCard searchable"><h3>Equipo ${i+1}</h3><ul>${(tm.players||[]).map(p=>`<li>${p.gamertag} · ${p.kd||0} KD · ${p.xp||0} XP</li>`).join("")}</ul></div>`).join(""):"<p>Sin equipos.</p>"}
function renderGallery(){let ap=arr(victories).filter(v=>v.status==="approved");$("galleryList").innerHTML=ap.length?ap.map(v=>`<div class="galleryCard searchable"><img src="${v.image}"><h3>${v.gamertag}</h3><p>${v.kills||0} kills · ${v.mode||"Warzone"}</p></div>`).join(""):"<p class='card'>Sin victorias aprobadas.</p>";let totals={};ap.forEach(v=>totals[v.gamertag]=(totals[v.gamertag]||0)+(+v.kills||0));let max=Math.max(1,...Object.values(totals));$("killsChart").innerHTML=Object.entries(totals).map(([n,k])=>`<div class="bar" style="height:${Math.max(8,k/max*150)}px">${n}<br>${k}</div>`).join("")||"<p>Sin kills.</p>"}
function renderNotif(){$("notifyList").innerHTML=arr(notifications).reverse().slice(0,30).map(n=>`<div class="notification searchable"><b>${n.title}</b><p>${n.body}</p></div>`).join("")||"<p>Sin notificaciones.</p>"}
function renderHall(){let f=arr(members).filter(m=>m.founderMember);$("hallList").innerHTML=f.length?f.map(m=>`<div class="card searchable"><h3>🏅 ${m.gamertag}</h3><p>Founder 20 #${m.founderNumber}</p></div>`).join(""):"<p>Aún no hay Founder 20.</p>"}
function renderAdmin(){if(!$("reqList"))return;$("reqList").innerHTML=arr(requests).map(r=>`<div class="request searchable"><h3>${r.gamertag}</h3><p>${r.email}<br>${r.region} · Ref: ${r.ref||"N/A"}</p><button class="red" onclick="acceptRequest('${r.id}')">Aceptar</button><button onclick="rejectRequest('${r.id}')">Rechazar</button></div>`).join("")||"<p>Sin solicitudes.</p>";$("adminMembers").innerHTML=arr(members).map(m=>`<div class="memberAdmin searchable"><b>${m.gamertag}</b><br>${m.rank} · ${m.region}<br><button onclick="deleteMember('${m.id}','${m.gamertag}')">Eliminar</button></div>`).join("")||"<p>Sin miembros.</p>";$("victoryReqs").innerHTML=arr(victories).filter(v=>v.status!=="approved").map(v=>`<div class="victoryReq searchable"><b>${v.gamertag}</b><p>${v.kills||0} kills</p><button class="red" onclick="approveVictory('${v.id}')">Aprobar</button><button onclick="rejectVictory('${v.id}')">Rechazar</button></div>`).join("")||"<p>Sin pendientes.</p>"}
function runSearch(){let q=norm($("search").value);document.querySelectorAll(".profileCard,.memberAdmin,.row,.request,.galleryCard,.teamCard,.notification,.card,.victoryReq").forEach(c=>{c.style.display=!q||norm(c.textContent).includes(q)?"":"none"});if(q&&(!$("profiles").classList.contains("active"))){show("profiles")}}$("search").addEventListener("input",runSearch);
$("profileForm").onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());p.xp=p.xp||0;p.createdAt=new Date().toISOString();await push(ref(db,"playerProfiles"),p);e.target.reset()};$("tourForm").onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());await push(ref(db,"tournamentPlayers"),p);e.target.reset()};$("victoryForm").onsubmit=async e=>{e.preventDefault();let v=Object.fromEntries(new FormData(e.target).entries());v.status="pending";v.createdAt=new Date().toISOString();await push(ref(db,"victories"),v);e.target.reset()};
$("daily").onclick=()=>alert("Próximamente: check-in diario con usuario conectado.");$("vipSoon").onclick=$("vipSoon2").onclick=()=>alert("💎 SHDW VIP próximamente.");
$("loginBtn").onclick=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value,$("pass").value)}catch(e){alert(e.message)}};$("logout").onclick=()=>signOut(auth);onAuthStateChanged(auth,u=>{if(u){$("login").classList.add("hide");$("panel").classList.remove("hide")}else{$("login").classList.remove("hide");$("panel").classList.add("hide")}});
$("addM").onclick=async()=>push(ref(db,"members"),{gamertag:$("mg").value||"Nuevo",rank:$("mr").value||"Recruit",region:$("mreg").value||"Global",discord:$("md").value||"",kd:$("mkd").value||0,wins:$("mw").value||0,xp:$("mxp").value||0});$("saveMVP").onclick=async()=>{await set(ref(db,"mvp"),{name:$("mvpN").value,region:$("mvpR").value,reason:$("mvpWhy").value});await push(ref(db,"notifications"),{title:"Nuevo MVP",body:`${$("mvpN").value} fue nombrado MVP.`,createdAt:new Date().toISOString()})};$("addNews").onclick=async()=>push(ref(db,"notifications"),{title:$("nt").value||"Noticia SHDW",body:$("nb").value||"Nuevo anuncio.",createdAt:new Date().toISOString()});
$("genTeams").onclick=async()=>{let players=arr(tourP);if(players.length<2)return alert("Necesitas 2 jugadores.");let size=+$("teamSize").value||4,count=Math.ceil(players.length/size),teams=Array.from({length:count},()=>({players:[],power:0}));players.sort((a,b)=>power(b)-power(a)).forEach(p=>{teams.sort((a,b)=>a.power-b.power);let t=teams.find(x=>x.players.length<size)||teams[0];t.players.push(p);t.power+=power(p)});await set(ref(db,"tournamentTeams"),teams)};$("clearTour").onclick=async()=>{await set(ref(db,"tournamentPlayers"),{});await set(ref(db,"tournamentTeams"),{})};
window.acceptRequest=async id=>{let r=requests[id],num=Object.keys(members).length+1,isF=num<=20;await push(ref(db,"members"),{gamertag:r.gamertag,rank:isF?"🏅 Fundador SHDW":"Recruit",founderMember:isF,founderNumber:isF?num:null,region:r.region,discord:r.discord||"",kd:r.kd||0,wins:0,xp:isF?500:0,emailPrivate:r.email});if(r.ref)await push(ref(db,"notifications"),{title:"XP por referido",body:`${r.ref} ganó +500 XP porque su invitado fue aceptado.`});await remove(ref(db,"requests/"+id))};window.rejectRequest=id=>remove(ref(db,"requests/"+id));window.deleteMember=(id,n)=>confirm(`¿Eliminar a ${n}?`)&&remove(ref(db,"members/"+id));window.approveVictory=async id=>{let v=victories[id];await update(ref(db,"victories/"+id),{status:"approved"});await push(ref(db,"notifications"),{title:"Victoria aprobada",body:`${v.gamertag} subió ${v.kills||0} kills.`})};window.rejectVictory=id=>remove(ref(db,"victories/"+id));
$("topProfile").onclick=()=>{$("modal").classList.remove("hide");let p=arr(profiles)[0]||arr(members)[0]||{gamertag:"ScorpionBz",rank:"Global Commander",xp:0,region:"México"};$("topName").textContent=p.gamertag||"Perfil";$("modalContent").innerHTML=`<h3>${p.gamertag}</h3><p>${p.rank||rankXP(p.xp)}<br>${p.region||"Global"}<br>XP: ${p.xp||0}<br>Discord: ${p.discord||"N/A"}</p>`};$("closeModal").onclick=()=>$("modal").classList.add("hide");
async function share(){let url="https://scorpionbz.github.io/Shadow-Ops-global/?ref=ScorpionBz",data={title:"Shadow Ops Global [SHDW]",text:"🦅 Únete a Shadow Ops Global. Reclutamiento abierto.",url};try{navigator.share?await navigator.share(data):(await navigator.clipboard.writeText(url),alert("Enlace copiado"))}catch(e){prompt("Copia el enlace:",url)}}$("share").onclick=share;if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js");
// SHDW splash screen gamer
const shdwTips=["🏅 Founder 20 recibe beneficios exclusivos.","🎖️ Completa misiones para ganar XP.","🏆 Participa en torneos oficiales SHDW.","📸 Sube tus victorias y kills.","🔥 Recluta jugadores y sube de rango."];
window.addEventListener("load",()=>{const splash=document.getElementById("splash-screen");const tip=document.getElementById("loading-tip");let i=0;const timer=setInterval(()=>{if(tip){i=(i+1)%shdwTips.length;tip.textContent=shdwTips[i]}},900);setTimeout(()=>{clearInterval(timer);if(splash){splash.classList.add("hide");setTimeout(()=>splash.remove(),650)}},3200)});

// SHDW 4.2 registro obligatorio + perfil real + XP
let currentPlayer = JSON.parse(localStorage.getItem("shdw_current_player") || "null");

function showAuthGateIfNeeded(){
  const gate = document.getElementById("authGate");
  if(!gate) return;
  if(!currentPlayer){
    gate.classList.remove("hidden");
  }else{
    gate.classList.add("hidden");
    const topName = document.getElementById("topName");
    if(topName) topName.textContent = currentPlayer.gamertag || "Perfil";
    const logout = document.getElementById("playerLogout");
    if(logout) logout.classList.remove("hide");
  }
}

setTimeout(showAuthGateIfNeeded, 3500);

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
if(showRegister) showRegister.onclick = () => {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginPlayerForm").classList.add("hidden");
};
if(showLogin) showLogin.onclick = () => {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginPlayerForm").classList.remove("hidden");
};

const registerForm = document.getElementById("registerForm");
if(registerForm){
  registerForm.onsubmit = async e => {
    e.preventDefault();
    const p = Object.fromEntries(new FormData(e.target).entries());
    p.xp = 100;
    p.wins = 0;
    p.kills = 0;
    p.rank = "🎯 Recruit";
    p.ref = new URLSearchParams(location.search).get("ref") || "";
    p.createdAt = new Date().toISOString();
    const saved = await push(ref(db,"playerProfiles"), p);
    currentPlayer = {...p, id:saved.key};
    localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
    await push(ref(db,"notifications"), {title:"Nuevo perfil SHDW", body:`${p.gamertag} creó su perfil.`, createdAt:new Date().toISOString()});
    showAuthGateIfNeeded();
  };
}

const loginPlayerForm = document.getElementById("loginPlayerForm");
if(loginPlayerForm){
  loginPlayerForm.onsubmit = e => {
    e.preventDefault();
    const p = Object.fromEntries(new FormData(e.target).entries());
    currentPlayer = {gamertag:p.gamertag, email:p.email, xp:0};
    localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
    showAuthGateIfNeeded();
  };
}

const playerLogout = document.getElementById("playerLogout");
if(playerLogout){
  playerLogout.onclick = () => {
    localStorage.removeItem("shdw_current_player");
    currentPlayer = null;
    location.reload();
  };
}

function addXPToLocalPlayer(amount, reason){
  if(!currentPlayer) return alert("Primero crea tu perfil SHDW.");
  currentPlayer.xp = (Number(currentPlayer.xp)||0) + amount;
  localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
  push(ref(db,"notifications"), {title:"XP ganado", body:`${currentPlayer.gamertag} ganó +${amount} XP por ${reason}.`, createdAt:new Date().toISOString()});
}

const dailyBtn42 = document.getElementById("daily");
if(dailyBtn42){
  dailyBtn42.onclick = () => {
    const today = new Date().toDateString();
    const key = "shdw_daily_" + (currentPlayer?.email || currentPlayer?.gamertag || "guest");
    if(localStorage.getItem(key) === today) return alert("Ya reclamaste tu XP diario hoy.");
    localStorage.setItem(key, today);
    addXPToLocalPlayer(25, "check-in diario");
    alert("+25 XP reclamados.");
  };
}

// Mejorar modal de perfil con datos del jugador real
const profileTop42 = document.getElementById("topProfile");
if(profileTop42){
  profileTop42.onclick = () => {
    const modal = document.getElementById("modal");
    const content = document.getElementById("modalContent");
    if(modal) modal.classList.remove("hide");
    const p = currentPlayer || {gamertag:"ScorpionBz", rank:"Global Commander", xp:0, region:"México"};
    if(content) content.innerHTML = `<h3>${p.gamertag}</h3><p>${p.rank || rankXP(p.xp)}<br>${p.region || "Global"}<br>XP: ${p.xp || 0}<br>Discord: ${p.discord || "N/A"}</p>${p.ref?`<span class="badgeFounder">Invitado por: ${p.ref}</span>`:""}`;
  };
}

// SHDW 4.2 FIX: login, scroll registro, niveles y recompensas
const SHDW_LEVELS = [
  {level:1, xp:0, rank:"🎯 Recruit", reward:"Acceso básico SHDW"},
  {level:2, xp:250, rank:"🎯 Recruit+", reward:"Insignia Recruit+"},
  {level:3, xp:500, rank:"🦅 Operative", reward:"+ Avatar destacado"},
  {level:5, xp:1500, rank:"🦅 Operative II", reward:"Acceso a torneos internos"},
  {level:8, xp:3000, rank:"⚔️ Elite", reward:"Marco rojo en perfil"},
  {level:10, xp:5000, rank:"⚔️ Elite II", reward:"Aparece en Top XP"},
  {level:15, xp:10000, rank:"🛡️ Captain", reward:"Puede liderar escuadras"},
  {level:20, xp:20000, rank:"👑 General", reward:"Perfil destacado"},
  {level:30, xp:40000, rank:"🔥 Legend", reward:"Hall of Fame candidato"},
  {level:50, xp:100000, rank:"💀 Shadow Immortal", reward:"Leyenda SHDW permanente"}
];

function getLevelData(xp){
  xp = Number(xp)||0;
  let current = SHDW_LEVELS[0];
  let next = SHDW_LEVELS[SHDW_LEVELS.length-1];
  for(let i=0;i<SHDW_LEVELS.length;i++){
    if(xp >= SHDW_LEVELS[i].xp) current = SHDW_LEVELS[i];
    if(SHDW_LEVELS[i].xp > xp){ next = SHDW_LEVELS[i]; break; }
  }
  const span = Math.max(1, next.xp - current.xp);
  const progress = current === next ? 100 : Math.min(100, Math.round(((xp-current.xp)/span)*100));
  return {current,next,progress};
}

function renderLevelRewards(){
  const box = document.getElementById("levelRewards");
  if(!box) return;
  const xp = Number(currentPlayer?.xp)||0;
  const info = getLevelData(xp);
  box.innerHTML = SHDW_LEVELS.map(l => `
    <div class="levelCard ${xp>=l.xp?'active':''}">
      <h3>Nivel ${l.level}</h3>
      <strong>${l.rank}</strong><br>
      <small>${l.xp.toLocaleString()} XP</small>
      <p>${l.reward}</p>
    </div>
  `).join("") + `
    <div class="levelCard active">
      <h3>Tu progreso</h3>
      <strong>${info.current.rank}</strong>
      <p>XP actual: ${xp}</p>
      <div class="xpBar"><div class="xpFill" style="width:${info.progress}%"></div></div>
      <small>${info.progress}% hacia ${info.next.rank}</small>
    </div>
  `;
}

// corregir botones registro/login
function setAuthMode(mode){
  const reg = document.getElementById("registerForm");
  const log = document.getElementById("loginPlayerForm");
  if(!reg || !log) return;
  if(mode === "login"){
    reg.classList.add("hidden");
    log.classList.remove("hidden");
  }else{
    log.classList.add("hidden");
    reg.classList.remove("hidden");
  }
}
const shRegBtn = document.getElementById("showRegister");
const shLogBtn = document.getElementById("showLogin");
if(shRegBtn) shRegBtn.onclick = () => setAuthMode("register");
if(shLogBtn) shLogBtn.onclick = () => setAuthMode("login");

// reemplazar login básico: busca perfil guardado en Firebase por correo/gamertag
const loginFormFixed = document.getElementById("loginPlayerForm");
if(loginFormFixed){
  loginFormFixed.onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const list = Object.entries(profiles || {}).map(([id,p])=>({id,...p}));
    const found = list.find(p =>
      (p.email||"").toLowerCase() === (data.email||"").toLowerCase() &&
      (p.gamertag||"").toLowerCase() === (data.gamertag||"").toLowerCase()
    );
    if(!found){
      alert("No encontré ese perfil. Revisa correo/gamertag o regístrate primero.");
      return;
    }
    currentPlayer = found;
    localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
    showAuthGateIfNeeded();
    renderLevelRewards();
  };
}

// corregir registro: guarda id y cierra pantalla correctamente
const regFormFixed = document.getElementById("registerForm");
if(regFormFixed){
  regFormFixed.onsubmit = async e => {
    e.preventDefault();
    const p = Object.fromEntries(new FormData(e.target).entries());
    p.xp = 100;
    p.wins = 0;
    p.kills = 0;
    p.level = 1;
    p.rank = "🎯 Recruit";
    p.ref = new URLSearchParams(location.search).get("ref") || "";
    p.createdAt = new Date().toISOString();
    const saved = await push(ref(db,"playerProfiles"), p);
    currentPlayer = {...p, id:saved.key};
    localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
    await push(ref(db,"notifications"), {title:"Nuevo perfil SHDW", body:`${p.gamertag} creó su perfil y recibió +100 XP.`, createdAt:new Date().toISOString()});
    showAuthGateIfNeeded();
    renderLevelRewards();
  };
}

// check-in con nivel/progreso
const dailyFixed = document.getElementById("daily");
if(dailyFixed){
  dailyFixed.onclick = () => {
    if(!currentPlayer) return alert("Primero crea o inicia sesión con tu perfil SHDW.");
    const today = new Date().toDateString();
    const key = "shdw_daily_" + (currentPlayer.email || currentPlayer.gamertag || "guest");
    if(localStorage.getItem(key) === today) return alert("Ya reclamaste tu XP diario hoy.");
    localStorage.setItem(key, today);
    currentPlayer.xp = (Number(currentPlayer.xp)||0) + 25;
    const info = getLevelData(currentPlayer.xp);
    currentPlayer.level = info.current.level;
    currentPlayer.rank = info.current.rank;
    localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
    push(ref(db,"notifications"), {title:"Check-in diario", body:`${currentPlayer.gamertag} ganó +25 XP.`, createdAt:new Date().toISOString()});
    renderLevelRewards();
    alert(`+25 XP. Nivel actual: ${info.current.level} · ${info.current.rank}`);
  };
}

// actualizar modal perfil con nivel y barra
const topProfileFixed = document.getElementById("topProfile");
if(topProfileFixed){
  topProfileFixed.onclick = () => {
    const modal = document.getElementById("modal");
    const content = document.getElementById("modalContent");
    if(modal) modal.classList.remove("hide");
    const p = currentPlayer || {gamertag:"ScorpionBz", rank:"Global Commander", xp:0, region:"México"};
    const info = getLevelData(p.xp);
    const topName = document.getElementById("topName");
    if(topName) topName.textContent = p.gamertag || "Perfil";
    if(content) content.innerHTML = `
      <h3>${p.gamertag}</h3>
      <p>${info.current.rank}<br>${p.region || "Global"}<br>XP: ${p.xp || 0}<br>Nivel: ${info.current.level}<br>Discord: ${p.discord || "N/A"}</p>
      <div class="xpBar"><div class="xpFill" style="width:${info.progress}%"></div></div>
      <small>${info.progress}% hacia ${info.next.rank}</small>
      ${p.ref?`<span class="badgeFounder">Invitado por: ${p.ref}</span>`:""}
    `;
  };
}

// enganchar render de niveles al cambiar pantallas
document.querySelectorAll('[data-tab="levels"], [data-tab="xp"]').forEach(b => b.addEventListener("click", () => setTimeout(renderLevelRewards, 100)));
setTimeout(renderLevelRewards, 1200);

// SHDW 4.3 Streamers
let streamers = {};
let streamerRequestsData = {};
onValue(ref(db,"streamers"), s => { streamers = s.val() || {}; renderStreamersSHDW(); });
onValue(ref(db,"streamerRequests"), s => { streamerRequestsData = s.val() || {}; renderStreamersSHDW(); renderAdminStreamersSHDW(); });
function renderStreamersSHDW(){
  const listBox=document.getElementById("streamersList"), featBox=document.getElementById("featuredStreamer");
  if(listBox){const list=arr(streamers);listBox.innerHTML=list.length?list.map(st=>`<div class="streamerCard official searchable">${st.photo?`<img src="${st.photo}">`:""}<h3>${st.name||"Streamer SHDW"}</h3><span class="streamerBadge">⭐ Streamer Oficial SHDW</span><p>${st.region||"Global"} · ${st.game||"Gaming"}<br>Seguidores: ${st.followers||"N/A"}</p>${st.channel?`<a href="${st.channel}" target="_blank">Ver canal</a>`:""}<br><small>XP Streamer: ${st.streamerXP||0}</small></div>`).join(""):"<p>Aún no hay streamers oficiales.</p>";}
  if(featBox){const off=arr(streamers).sort((a,b)=>(Number(b.streamerXP)||0)-(Number(a.streamerXP)||0))[0];featBox.innerHTML=off?`<div class="streamerCard official">${off.photo?`<img src="${off.photo}">`:""}<h3>👑 ${off.name}</h3><p>${off.game||"Gaming"} · ${off.region||"Global"}<br>${off.followers||"N/A"} seguidores</p>${off.channel?`<a href="${off.channel}" target="_blank">Visitar canal</a>`:""}</div>`:"<p>Próximamente elegiremos al primer Streamer de la Semana.</p>";}
}
const streamerForm=document.getElementById("streamerForm");
if(streamerForm){streamerForm.onsubmit=async e=>{e.preventDefault();const st=Object.fromEntries(new FormData(e.target).entries());st.status="pending";st.streamerXP=0;st.createdAt=new Date().toISOString();await push(ref(db,"streamerRequests"),st);await push(ref(db,"notifications"),{title:"Solicitud Streamer",body:`${st.name} quiere ser Streamer SHDW.`,createdAt:new Date().toISOString()});e.target.reset();document.getElementById("streamerMsg")?.classList.remove("hide");};}
function renderAdminStreamersSHDW(){
 const reqBox=document.getElementById("streamerRequests"), adminBox=document.getElementById("adminStreamers");
 if(reqBox){const reqs=arr(streamerRequestsData);reqBox.innerHTML=reqs.length?reqs.map(st=>`<div class="request searchable"><h3>${st.name}</h3><p>${st.channel}<br>${st.platform||""} · ${st.followers||"N/A"} seguidores · ${st.region||"Global"}</p><button class="red" onclick="approveStreamer('${st.id}')">Aprobar Streamer</button><button onclick="rejectStreamer('${st.id}')">Rechazar</button></div>`).join(""):"<p>Sin solicitudes streamer.</p>";}
 if(adminBox){const list=arr(streamers);adminBox.innerHTML=list.length?list.map(st=>`<div class="memberAdmin searchable"><b>${st.name}</b><br>${st.game||"Gaming"} · ${st.region||"Global"} · XP ${st.streamerXP||0}<br><button onclick="addStreamerXP('${st.id}',100,'directo o contenido')">+100 XP</button><button onclick="deleteStreamer('${st.id}','${st.name||"Streamer"}')">Eliminar</button></div>`).join(""):"<p>Sin streamers oficiales.</p>";}
}
window.approveStreamer=async id=>{const st=streamerRequestsData[id];if(!st)return;st.status="official";st.approvedAt=new Date().toISOString();st.streamerXP=Number(st.streamerXP)||100;await push(ref(db,"streamers"),st);await remove(ref(db,"streamerRequests/"+id));await push(ref(db,"notifications"),{title:"Nuevo Streamer Oficial",body:`${st.name} fue aprobado como Streamer Oficial SHDW.`,createdAt:new Date().toISOString()});};
window.rejectStreamer=async id=>await remove(ref(db,"streamerRequests/"+id));
window.addStreamerXP=async(id,amount,reason)=>{const st=streamers[id];if(!st)return;const newXP=(Number(st.streamerXP)||0)+Number(amount);await update(ref(db,"streamers/"+id),{streamerXP:newXP});await push(ref(db,"notifications"),{title:"XP Streamer",body:`${st.name} ganó +${amount} XP por ${reason}.`,createdAt:new Date().toISOString()});};
window.deleteStreamer=async(id,name)=>{if(!confirm(`¿Eliminar a ${name} de Streamers SHDW?`))return;await remove(ref(db,"streamers/"+id));};
// SHDW 4.4 Clips + corazones + IA para streamers
let streamerClips = {};

onValue(ref(db,"streamerClips"), s => {
  streamerClips = s.val() || {};
  renderStreamerClips();
});

const clipForm = document.getElementById("clipForm");

if (clipForm) {
  clipForm.onsubmit = async e => {
    e.preventDefault();

    const clip = Object.fromEntries(new FormData(e.target).entries());
    clip.hearts = 0;
    clip.createdAt = new Date().toISOString();

    await push(ref(db,"streamerClips"), clip);

    await push(ref(db,"notifications"), {
      title: "Nuevo clip streamer",
      body: `${clip.name} subió un nuevo clip: ${clip.title}`,
      createdAt: new Date().toISOString()
    });

    e.target.reset();
    alert("Clip subido correctamente.");
  };
}

function renderStreamerClips() {
  const box = document.getElementById("clipsList");
  const topBox = document.getElementById("topClipStreamer");

  const clips = arr(streamerClips).sort((a,b) => (Number(b.hearts)||0) - (Number(a.hearts)||0));

  if (box) {
    box.innerHTML = clips.length ? clips.map(c => `
      <div class="streamerCard searchable">
        <h3>🎬 ${c.title}</h3>
        <p><b>${c.name}</b><br>${c.game || "Gaming"}</p>
        <a href="${c.video}" target="_blank">Ver clip</a>
        <br><br>
        <button class="red" onclick="heartClip('${c.id}')">
          ❤️ ${c.hearts || 0}
        </button>
      </div>
    `).join("") : "<p>Aún no hay clips. Sé el primero en subir uno.</p>";
  }

  if (topBox) {
    const top = clips[0];

    topBox.innerHTML = top ? `
      <div class="streamerCard official">
        <h3>👑 ${top.name}</h3>
        <p>Clip más apoyado: ${top.title}</p>
        <p>❤️ ${top.hearts || 0} corazones</p>
        <a href="${top.video}" target="_blank">Ver clip ganador</a>
      </div>
    ` : "<p>Aún no hay streamer más apoyado.</p>";
  }
}

window.heartClip = async id => {
  const clip = streamerClips[id];
  if (!clip) return;

  const key = "heart_clip_" + id;

  if (localStorage.getItem(key)) {
    alert("Ya diste corazón a este clip.");
    return;
  }

  localStorage.setItem(key, "yes");

  const newHearts = (Number(clip.hearts) || 0) + 1;

  await update(ref(db,"streamerClips/" + id), {
    hearts: newHearts
  });

  await push(ref(db,"notifications"), {
    title: "Nuevo corazón",
    body: `${clip.name} recibió un corazón en su clip.`,
    createdAt: new Date().toISOString()
  });
};

// IA básica mejorada para streamers sin pagar API
const aiStreamerForm = document.getElementById("aiStreamerForm");

const randomPick = list => list[Math.floor(Math.random() * list.length)];

if (aiStreamerForm) {
  aiStreamerForm.onsubmit = e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target).entries());
    const game = data.game || "Warzone";
    const type = data.type;
    const result = document.getElementById("aiResult");

    const ideas = {
      titulo: [
        `🔥 Hoy rompemos ${game} con la comunidad SHDW`,
        `💀 Directo intenso de ${game}: ¿ganamos o morimos?`,
        `🎮 Subiendo nivel en ${game} con Shadow Ops Global`,
        `👑 Noche de clips épicos en ${game}`,
        `🚀 Camino a ser leyenda SHDW en ${game}`
      ],
      hashtags: [
        `#${game.replaceAll(" ","")} #ShadowOpsGlobal #SHDW #StreamerLatino #Gaming`,
        `#GamingLatino #ClipsGaming #${game.replaceAll(" ","")} #StreamerPequeño #SHDW`,
        `#TwitchLatam #TikTokGaming #ShadowOps #WarzoneClips #ComunidadGamer`
      ],
      youtube: [
        `Nuevo video de ${game} con la comunidad de Shadow Ops Global. Apóyame con tu like y únete al clan.`,
        `Hoy jugamos ${game}, sacamos buenos clips y buscamos nuevos miembros para SHDW.`,
        `Partidas intensas, risas y momentos épicos en ${game}. Bienvenido a Shadow Ops Global.`
      ],
      ideas: [
        `1. Reto jugando con seguidores.<br>2. Reaccionar a clips SHDW.<br>3. Torneo entre streamers.<br>4. Mejores jugadas de la semana.`,
        `1. Solo armas difíciles.<br>2. Squad con miembros nuevos.<br>3. Directo de entrenamiento.<br>4. Sorteo para seguidores.`,
        `1. Camino a la victoria.<br>2. Jugando con la comunidad.<br>3. Ranking de clips.<br>4. Colaboración con otro streamer.`
      ],
      sorteo: [
        `🎁 Sortea un rol VIP entre quienes den corazón a tu clip y compartan tu directo.`,
        `🎁 Premio: entrada a torneo SHDW para quienes sigan tu canal y comenten tu gamertag.`,
        `🎁 Sorteo semanal: pase de batalla, perfil destacado o colaboración con otro streamer.`
      ]
    };

    if (result) {
      result.innerHTML = `
        <h3>🤖 Resultado IA SHDW</h3>
        <p>${randomPick(ideas[type])}</p>
      `;
    }
  };
}
