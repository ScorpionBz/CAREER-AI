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

// SHDW 5.0: Coins, tienda, inventario, misiones, corazones streamers
let shdwEconomy=JSON.parse(localStorage.getItem("shdw_economy")||'{"coins":0,"inventory":[],"history":[],"missions":{}}');
const SHOP_ITEMS=[{id:"red_frame",name:"Marco Rojo SHDW",price:150,desc:"Marco rojo para perfil."},{id:"gold_frame",name:"Marco Dorado Elite",price:300,desc:"Marco dorado premium."},{id:"featured_profile",name:"Perfil Destacado",price:500,desc:"Aparece destacado en la comunidad."},{id:"clip_feature",name:"Clip Destacado",price:400,desc:"Tu clip aparece destacado."},{id:"streamer_promo",name:"Promoción Streamer",price:800,desc:"Promoción dentro de Streamers SHDW."},{id:"vip_access_future",name:"Acceso VIP Futuro",price:1200,desc:"Reserva beneficios VIP cuando se active."}];
const MISSIONS=[{id:"daily_check",name:"Check-in diario",coins:25,xp:25,desc:"Entra y reclama tu recompensa."},{id:"upload_clip",name:"Subir clip/victoria",coins:50,xp:100,desc:"Sube captura a revisión."},{id:"support_streamer",name:"Dar corazón a streamer",coins:30,xp:50,desc:"Apoya a un streamer SHDW."},{id:"recruit_member",name:"Reclutar jugador",coins:100,xp:500,desc:"Tu invitado debe ser aceptado."},{id:"join_tournament",name:"Participar en torneo",coins:75,xp:250,desc:"Regístrate a un torneo."}];
function saveEconomy(){localStorage.setItem("shdw_economy",JSON.stringify(shdwEconomy));renderEconomy();}
function addCoins(amount,reason){shdwEconomy.coins=(Number(shdwEconomy.coins)||0)+Number(amount);shdwEconomy.history.unshift({amount,reason,date:new Date().toLocaleString()});shdwEconomy.history=shdwEconomy.history.slice(0,30);push(ref(db,"notifications"),{title:"SHDW Coins",body:`Ganaste ${amount} coins por ${reason}.`,createdAt:new Date().toISOString()});saveEconomy();}
function completeMission(id){const m=MISSIONS.find(x=>x.id===id);if(!m)return;const key=id+"_"+new Date().toDateString();if(shdwEconomy.missions[key])return alert("Esta misión ya fue completada hoy.");shdwEconomy.missions[key]=true;addCoins(m.coins,m.name);if(typeof addXPToLocalPlayer==="function")addXPToLocalPlayer(m.xp,m.name);alert(`Misión completada: +${m.coins} Coins y +${m.xp} XP`);}
function buyShopItem(id){const item=SHOP_ITEMS.find(x=>x.id===id);if(!item)return;if((Number(shdwEconomy.coins)||0)<item.price)return alert("No tienes suficientes SHDW Coins.");shdwEconomy.coins-=item.price;shdwEconomy.inventory.push({...item,boughtAt:new Date().toLocaleString()});shdwEconomy.history.unshift({amount:-item.price,reason:"Compra: "+item.name,date:new Date().toLocaleString()});push(ref(db,"notifications"),{title:"Compra SHDW",body:`Compraste ${item.name}.`,createdAt:new Date().toISOString()});saveEconomy();alert("Compra realizada: "+item.name);}
function renderEconomy(){const bal=document.getElementById("coinBalance");if(bal)bal.textContent=Number(shdwEconomy.coins||0).toLocaleString();const hist=document.getElementById("coinHistory");if(hist)hist.innerHTML=shdwEconomy.history.length?shdwEconomy.history.map(h=>`<div class="notification searchable"><b>${h.amount>0?"+":""}${h.amount} Coins</b><p>${h.reason}<br><small>${h.date}</small></p></div>`).join(""):"<p>Sin movimientos todavía.</p>";const shop=document.getElementById("shopItems");if(shop)shop.innerHTML=SHOP_ITEMS.map(item=>`<div class="shopItem searchable"><h3>${item.name}</h3><p>${item.desc}</p><strong>${item.price} Coins</strong><br><button class="red" onclick="buyShopItem('${item.id}')">Comprar</button></div>`).join("");const inv=document.getElementById("inventoryList");if(inv)inv.innerHTML=shdwEconomy.inventory.length?shdwEconomy.inventory.map(item=>`<div class="inventoryItem searchable"><h3>${item.name}</h3><p>${item.desc}</p><small>Comprado: ${item.boughtAt}</small></div>`).join(""):"<p>Tu inventario está vacío.</p>";const mis=document.getElementById("missionsList");if(mis){const today=new Date().toDateString();mis.innerHTML=MISSIONS.map(m=>{const done=shdwEconomy.missions[m.id+"_"+today];return `<div class="missionItem ${done?'complete':''} searchable"><h3>${m.name}</h3><p>${m.desc}</p><strong>+${m.coins} Coins · +${m.xp} XP</strong><br><button class="red" onclick="completeMission('${m.id}')" ${done?'disabled':''}>${done?'Completada':'Completar'}</button></div>`}).join("");}}
window.buyShopItem=buyShopItem;window.completeMission=completeMission;setTimeout(renderEconomy,1000);document.getElementById("claimCoinsDaily")?.addEventListener("click",()=>completeMission("daily_check"));
function supportStreamer(id){const st=streamers[id];if(!st)return;const key="heart_"+id+"_"+new Date().toDateString();if(localStorage.getItem(key))return alert("Ya apoyaste a este streamer hoy.");localStorage.setItem(key,"1");update(ref(db,"streamers/"+id),{hearts:(Number(st.hearts)||0)+1});completeMission("support_streamer");push(ref(db,"notifications"),{title:"Corazón Streamer",body:`${st.name} recibió un corazón.`,createdAt:new Date().toISOString()});}
window.supportStreamer=supportStreamer;
if(typeof renderStreamersSHDW==="function"){renderStreamersSHDW=function(){const listBox=document.getElementById("streamersList"),featBox=document.getElementById("featuredStreamer");const list=arr(streamers).sort((a,b)=>((Number(b.hearts)||0)+(Number(b.streamerXP)||0)/100)-((Number(a.hearts)||0)+(Number(a.streamerXP)||0)/100));if(listBox){listBox.innerHTML=list.length?list.map(st=>`<div class="streamerCard official searchable">${st.photo?`<img src="${st.photo}">`:""}<h3>${st.name||"Streamer SHDW"}</h3><span class="streamerBadge">⭐ Streamer Oficial SHDW</span><p>${st.region||"Global"} · ${st.game||"Gaming"}<br>Seguidores: ${st.followers||"N/A"}</p><div class="streamerStats"><span>❤️ ${st.hearts||0}</span><span>XP ${st.streamerXP||0}</span><span>Clips ${st.clips||0}</span></div>${st.channel?`<a href="${st.channel}" target="_blank">Ver canal</a>`:""}<br><button class="heartBtn" onclick="supportStreamer('${st.id}')">❤️ Apoyar</button></div>`).join(""):"<p>Aún no hay streamers oficiales.</p>"}if(featBox){const top=list[0];featBox.innerHTML=top?`<div class="streamerCard official">${top.photo?`<img src="${top.photo}">`:""}<h3>👑 ${top.name}</h3><p>${top.game||"Gaming"} · ${top.region||"Global"}<br>❤️ ${top.hearts||0} corazones · XP ${top.streamerXP||0}</p>${top.channel?`<a href="${top.channel}" target="_blank">Visitar canal</a>`:""}</div>`:"<p>Próximamente elegiremos al primer Streamer de la Semana.</p>"}}}
setTimeout(()=>{const c=document.getElementById("giveCoinsBtn");if(c)c.onclick=()=>{let u=document.getElementById("coinUser").value||"Jugador SHDW",a=document.getElementById("coinAmount").value||0,r=document.getElementById("coinReason").value||"Recompensa";push(ref(db,"notifications"),{title:"Coins otorgados",body:`${u} recibió ${a} SHDW Coins por ${r}.`,createdAt:new Date().toISOString()});alert("Notificación creada.")};const x=document.getElementById("giveXPBtn");if(x)x.onclick=()=>{let u=document.getElementById("xpUser").value||"Jugador SHDW",a=document.getElementById("xpAmount").value||0,r=document.getElementById("xpReason").value||"Recompensa";push(ref(db,"notifications"),{title:"XP otorgado",body:`${u} recibió +${a} XP por ${r}.`,createdAt:new Date().toISOString()});alert("Notificación creada.")}},1200);

// SHDW 5.1 Dashboard + activity feed
function shdwLevelInfo(xp){
  xp = Number(xp)||0;
  const levels = [
    {level:1,xp:0,rank:"🎯 Recruit"},
    {level:2,xp:250,rank:"🎯 Recruit+"},
    {level:3,xp:500,rank:"🦅 Operative"},
    {level:5,xp:1500,rank:"🦅 Operative II"},
    {level:8,xp:3000,rank:"⚔️ Elite"},
    {level:10,xp:5000,rank:"⚔️ Elite II"},
    {level:15,xp:10000,rank:"🛡️ Captain"},
    {level:20,xp:20000,rank:"👑 General"},
    {level:30,xp:40000,rank:"🔥 Legend"},
    {level:50,xp:100000,rank:"💀 Shadow Immortal"}
  ];
  let current = levels[0], next = levels[levels.length-1];
  for(let i=0;i<levels.length;i++){
    if(xp >= levels[i].xp) current = levels[i];
    if(levels[i].xp > xp){ next = levels[i]; break; }
  }
  const span = Math.max(1,next.xp-current.xp);
  const pct = current===next ? 100 : Math.min(100,Math.round(((xp-current.xp)/span)*100));
  return {current,next,pct};
}

function renderDashboard51(){
  let p = currentPlayer || JSON.parse(localStorage.getItem("shdw_current_player") || "null") || {};
  let eco = JSON.parse(localStorage.getItem("shdw_economy") || '{"coins":0}');
  let xp = Number(p.xp)||0;
  let info = shdwLevelInfo(xp);
  const set = (id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
  set("dashName", p.gamertag || "ScorpionBz");
  set("dashRank", p.rank || info.current.rank);
  set("dashLevel", info.current.level);
  set("dashXP", xp.toLocaleString());
  set("dashCoins", Number(eco.coins||0).toLocaleString());
  set("dashWins", Number(p.wins||0).toLocaleString());
  set("dashKills", Number(p.kills||0).toLocaleString());
  set("dashHearts", Number(p.hearts||0).toLocaleString());
  set("progressText", `XP ${xp.toLocaleString()} / ${info.next.xp.toLocaleString()}`);
  set("progressPercent", `${info.pct}%`);
  const fill = document.getElementById("dashXPFill");
  if(fill) fill.style.width = info.pct + "%";
}

function renderActivityFeed51(){
  const feed = document.getElementById("activityFeed");
  if(!feed) return;
  const items = [];
  try{
    Object.values(notifications || {}).forEach(n=>items.push({title:n.title||"Notificación", body:n.body||"", time:n.createdAt||""}));
  }catch(e){}
  try{
    Object.values(victories || {}).filter(v=>v.status==="approved").forEach(v=>items.push({title:"Victoria aprobada", body:`${v.gamertag} subió ${v.kills||0} kills.`, time:v.approvedAt||v.createdAt||""}));
  }catch(e){}
  try{
    Object.values(streamers || {}).forEach(s=>items.push({title:"Streamer SHDW", body:`${s.name} · ❤️ ${s.hearts||0} · XP ${s.streamerXP||0}`, time:s.approvedAt||s.createdAt||""}));
  }catch(e){}
  feed.innerHTML = items.reverse().slice(0,6).map(x=>`<div class="feedItem searchable"><b>${x.title}</b><p>${x.body}</p></div>`).join("") || "<p>Sin actividad reciente.</p>";
}

const oldRender51 = typeof render === "function" ? render : null;
if(oldRender51){
  render = function(){
    oldRender51();
    renderDashboard51();
    renderActivityFeed51();
  };
}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{renderDashboard51();renderActivityFeed51();},120)));
setInterval(renderDashboard51, 2500);
setTimeout(()=>{renderDashboard51();renderActivityFeed51();},1200);

// SHDW 5.2 Medallas, Marcos e IA Premium
const SHDW_MEDALS=[["first_win","Primera Victoria","assets/medal_first_win.svg","Victorias >= 1",p=>(Number(p.wins)||0)>=1,"+100 XP · +50 Coins"],["killer","Asesino","assets/medal_killer.svg","Kills >= 100",p=>(Number(p.kills)||0)>=100,"Marco Bronce · +200 Coins"],["destroyer","Destructor","assets/medal_destroyer.svg","Kills >= 1000",p=>(Number(p.kills)||0)>=1000,"Marco Oro · +1000 Coins"],["champion","Campeón SHDW","assets/medal_champion.svg","Torneo ganado >= 1",p=>(Number(p.tournamentWins)||0)>=1,"Perfil destacado"],["streamer","Streamer Oficial","assets/medal_streamer.svg","Ser streamer aprobado",p=>!!p.officialStreamer,"Badge morado"],["favorite","Favorito Comunidad","assets/medal_favorite.svg","Corazones >= 50",p=>(Number(p.hearts)||0)>=50,"+500 Coins"],["founder","Founder","assets/medal_founder.svg","Founder 1-20",p=>!!p.founderMember||!!p.founderNumber,"Marco Founder · VIP futuro"],["vip","VIP","assets/medal_vip.svg","VIP activo",p=>!!p.vip,"Beneficios premium"],["legend","Leyenda SHDW","assets/medal_legend.svg","Nivel 50+",p=>(Number(p.level)||0)>=50||(Number(p.xp)||0)>=100000,"Shadow Immortal"]];
const SHDW_FRAMES=[["bronze","Bronce","assets/frame_bronze.svg","Nivel 5 o 100 kills",p=>(Number(p.level)||0)>=5||(Number(p.kills)||0)>=100],["silver","Plata","assets/frame_silver.svg","Nivel 10",p=>(Number(p.level)||0)>=10||(Number(p.xp)||0)>=5000],["gold","Oro","assets/frame_gold.svg","Nivel 20",p=>(Number(p.level)||0)>=20||(Number(p.xp)||0)>=20000],["diamond","Diamante","assets/frame_diamond.svg","Nivel 30",p=>(Number(p.level)||0)>=30||(Number(p.xp)||0)>=40000],["founder","Founder","assets/frame_founder.svg","Founder 1-20",p=>!!p.founderMember||!!p.founderNumber],["streamer","Streamer","assets/frame_streamer.svg","Streamer oficial",p=>!!p.officialStreamer],["immortal","Shadow Immortal","assets/frame_immortal.svg","Nivel 50+",p=>(Number(p.level)||0)>=50||(Number(p.xp)||0)>=100000]];
function progressPlayer(){return currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null")||{}}
function renderMedalsAndFrames(){const p=progressPlayer();const mb=document.getElementById("medalsGrid");if(mb)mb.innerHTML=SHDW_MEDALS.map(m=>{let ok=m[4](p);return `<div class="medalCard ${ok?'unlocked':'locked'} searchable"><img src="${m[2]}"><h3>${m[1]}</h3><p>${m[3]}</p><small>${m[5]}</small><br><span class="medalStatus">${ok?'Desbloqueada':'Bloqueada'}</span></div>`}).join("");const fb=document.getElementById("framesGrid");if(fb)fb.innerHTML=SHDW_FRAMES.map(f=>{let ok=f[4](p);return `<div class="frameCard ${ok?'unlocked':'locked'} searchable"><img src="${f[2]}"><h3>Marco ${f[1]}</h3><p>${f[3]}</p><span class="medalStatus">${ok?'Disponible':'Bloqueado'}</span></div>`}).join("");}
let selectedAIMode="coach";document.querySelectorAll("[data-ai]").forEach(btn=>btn.addEventListener("click",()=>{selectedAIMode=btn.dataset.ai;document.querySelectorAll("[data-ai]").forEach(b=>b.classList.remove("red"));btn.classList.add("red")}));
function runPremiumAI(){const p=progressPlayer(),q=(document.getElementById("aiInput")?.value||"").trim();const out=document.getElementById("aiOutput");if(!out)return;const xp=Number(p.xp)||0,kd=Number(p.kd)||0,wins=Number(p.wins)||0,kills=Number(p.kills)||0;let msg="";if(selectedAIMode==="coach")msg=`🤖 IA Coach SHDW\n\nJugador: ${p.gamertag||"Operador"}\nK/D: ${kd||"No registrado"} · Victorias: ${wins} · Kills: ${kills} · XP: ${xp}\n\nRecomendación:\n- Completa misiones y check-in diario.\n- Sube victorias para desbloquear medallas.\n- Meta sugerida: 100 kills para desbloquear Asesino.`;else if(selectedAIMode==="matchmaker")msg=`⚔️ IA Matchmaker SHDW\n\nRecomienda balancear equipos por K/D, XP, victorias y rol.\nEvita juntar a los jugadores de mayor K/D en el mismo equipo.`;else if(selectedAIMode==="streamer")msg=`🎥 IA Streamer SHDW\n\nRecomendación:\n- Publica clips de 15-25 segundos.\n- Pide corazones en la app.\n- Participa en torneos para subir en ranking streamer.`;else if(selectedAIMode==="security")msg=`🛡️ IA Anti-Abuso SHDW\n\nVigilar:\n- XP sospechoso.\n- Capturas falsas.\n- Spam de corazones.\n- Multicuentas.`;else msg=`📢 IA Reclutador SHDW\n\nTodos pueden aplicar sin importar nivel. Lo importante es mejorar y crecer juntos.\n${q?"\nNota: "+q:""}`;out.innerHTML=`<span class="aiBadge">Premium Beta</span><span class="aiBadge">${selectedAIMode}</span>\n${msg}`;}
document.getElementById("runAI")?.addEventListener("click",runPremiumAI);document.querySelectorAll('[data-tab="medals"],[data-tab="premiumAI"]').forEach(b=>b.addEventListener("click",()=>setTimeout(renderMedalsAndFrames,150)));setTimeout(renderMedalsAndFrames,1200);

// SHDW 5.3 IA Premium completa
let aiPremiumUnlocked=localStorage.getItem("shdw_ai_premium")==="true";
let aiMode53="coach";
function updateAIStatus53(){const st=document.getElementById("aiPremiumStatus");if(st){st.textContent=aiPremiumUnlocked?"Premium Activado":"Premium Beta";st.classList.toggle("unlocked",aiPremiumUnlocked)}}
function addAIMessage53(type,text){const box=document.getElementById("aiConversation");if(!box)return;const div=document.createElement("div");div.className="aiMsg "+type;div.innerHTML=text.replace(/\n/g,"<br>");box.appendChild(div);box.scrollTop=box.scrollHeight}
function getAIPlayer53(){return currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null")||{gamertag:"Operador SHDW",xp:0,wins:0,kills:0,kd:0,level:1}}
function aiResponse53(mode,question){const p=getAIPlayer53();const eco=JSON.parse(localStorage.getItem("shdw_economy")||'{"coins":0}');const xp=Number(p.xp)||0,kd=Number(p.kd)||0,wins=Number(p.wins)||0,kills=Number(p.kills)||0,coins=Number(eco.coins)||0;if(mode==="coach"){let a=[];if(xp<500)a.push("Completa check-in diario y misiones básicas para llegar rápido a Operative.");if(kills<100)a.push("Tu primera meta debe ser 100 kills para desbloquear la medalla Asesino.");if(wins<1)a.push("Sube una victoria aprobada para desbloquear Primera Victoria.");if(kd&&kd<1)a.push("Juega con escuadra, evita rotaciones solitarias y prioriza comunicación.");if(!a.length)a.push("Vas bien. Enfócate en torneos, clips y subir de nivel para desbloquear marcos.");return `🤖 <b>IA Coach SHDW</b>\n\nJugador: ${p.gamertag||"Operador"}\nXP: ${xp} · Kills: ${kills} · Victorias: ${wins} · K/D: ${kd||"N/A"}\nCoins: ${coins}\n\n${a.map(x=>"• "+x).join("\n")}`;}if(mode==="matchmaker")return `⚔️ <b>IA Matchmaker</b>\n\nPara equipos parejos usa:\n• Separar jugadores con K/D alto.\n• Mezclar líder, agresivo y soporte.\n• Balancear por XP + K/D + victorias.\n\nFórmula:\nPoder = (K/D x 1000) + (XP / 20) + (Victorias x 30)`;if(mode==="streamer")return `🎥 <b>IA Streamer SHDW</b>\n\nPlan para crecer:\n• Publica 1 clip diario de 15-25 segundos.\n• Usa logo SHDW al inicio/final.\n• Pide corazones en la app.\n• Haz directos con miembros SHDW.\n• Sube clips de torneos.`;if(mode==="security")return `🛡️ <b>IA Anti-Abuso</b>\n\nVigilar:\n• Mucho XP en poco tiempo.\n• Kills exageradas sin captura.\n• Spam de corazones.\n• Multicuentas.\n• Solicitudes con datos incompletos.`;if(mode==="missions")return `🎯 <b>IA Misiones</b>\n\nMisión recomendada:\n${coins<150?"Gana 150 coins para comprar tu primer marco.":kills<100?"Consigue 100 kills y sube evidencia para desbloquear Asesino.":"Completa check-in, da corazón a un streamer y sube una captura."}\n\nRecompensa: +XP, +Coins y progreso a medallas.`;return `📢 <b>IA Reclutador SHDW</b>\n\nTodos pueden aplicar sin importar nivel. Lo importante es mejorar y crecer juntos.\nPara streamers: SHDW ofrece visibilidad, torneos, clips, promoción y comunidad.`}
document.querySelectorAll("[data-ai]").forEach(btn=>btn.addEventListener("click",()=>{aiMode53=btn.dataset.ai;document.querySelectorAll("[data-ai]").forEach(b=>b.classList.remove("red"));btn.classList.add("red")}));
document.getElementById("unlockAIButton")?.addEventListener("click",()=>{if(aiPremiumUnlocked)return alert("IA Premium ya está activada.");let eco=JSON.parse(localStorage.getItem("shdw_economy")||'{"coins":0,"inventory":[]}');if((Number(eco.coins)||0)<1200)return alert("Necesitas 1200 SHDW Coins para activar IA Premium.");eco.coins=Number(eco.coins)-1200;eco.inventory=eco.inventory||[];eco.inventory.push({id:"ai_premium",name:"IA Premium SHDW",desc:"Acceso al asistente IA Premium",boughtAt:new Date().toLocaleString()});localStorage.setItem("shdw_economy",JSON.stringify(eco));localStorage.setItem("shdw_ai_premium","true");aiPremiumUnlocked=true;updateAIStatus53();if(typeof renderEconomy==="function")renderEconomy();addAIMessage53("bot","🤖 <b>IA Premium activada.</b>\nAhora tienes acceso al asistente SHDW.")});
document.getElementById("runAI")?.addEventListener("click",()=>{const input=document.getElementById("aiInput");const q=input?.value||"";if(!aiPremiumUnlocked)addAIMessage53("bot","🔒 <b>IA Premium bloqueada.</b>\nDesbloquéala con 1200 SHDW Coins o VIP futuro. Modo beta te dará una vista previa.");addAIMessage53("user",`<b>Tú:</b> ${q||"Analízame"}`);addAIMessage53("bot",aiResponse53(aiMode53,q));if(input)input.value=""});
document.getElementById("clearAIChat")?.addEventListener("click",()=>{const box=document.getElementById("aiConversation");if(box)box.innerHTML=""});
document.querySelectorAll('[data-tab="premiumAI"]').forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{updateAIStatus53();const box=document.getElementById("aiConversation");if(box&&!box.dataset.ready){box.dataset.ready="1";addAIMessage53("bot","🤖 <b>IA Premium SHDW lista.</b>\nElige un modo: Coach, Matchmaker, Streamer, Anti-Abuso, Reclutador o Misiones.")}},150)));
setTimeout(updateAIStatus53,1000);

// SHDW 6.0 Clanes, Ruleta, archivos locales y Admin Pro
let clansData = {};
onValue(ref(db,"clans"), s => { clansData = s.val() || {}; renderClans60(); });
function fileToDataURL60(file){
  return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
}
async function attachLocalFile60(formData, form, fileName, targetName){
  const file = form.querySelector(`[name="${fileName}"]`)?.files?.[0];
  if(file){
    const data = await fileToDataURL60(file);
    formData[targetName] = data;
    formData.localFileName = file.name;
  }
  return formData;
}
// Reforzar formularios con archivo local
const profileForm60 = document.getElementById("profileForm");
if(profileForm60){
  profileForm60.onsubmit = async e => {
    e.preventDefault();
    let p = Object.fromEntries(new FormData(e.target).entries());
    p = await attachLocalFile60(p, e.target, "photoFile", "photo");
    p.xp = p.xp || 0; p.createdAt = new Date().toISOString();
    await push(ref(db,"playerProfiles"), p);
    e.target.reset();
    alert("Perfil guardado.");
  };
}
const registerForm60 = document.getElementById("registerForm");
if(registerForm60){
  registerForm60.onsubmit = async e => {
    e.preventDefault();
    let p = Object.fromEntries(new FormData(e.target).entries());
    p = await attachLocalFile60(p, e.target, "photoFile", "photo");
    p.xp = 100; p.wins = 0; p.kills = 0; p.level = 1; p.rank = "🎯 Recruit";
    p.ref = new URLSearchParams(location.search).get("ref") || "";
    p.createdAt = new Date().toISOString();
    const saved = await push(ref(db,"playerProfiles"), p);
    currentPlayer = {...p, id:saved.key};
    localStorage.setItem("shdw_current_player", JSON.stringify(currentPlayer));
    await push(ref(db,"notifications"), {title:"Nuevo perfil SHDW", body:`${p.gamertag} creó su perfil.`, createdAt:new Date().toISOString()});
    if(typeof showAuthGateIfNeeded==="function") showAuthGateIfNeeded();
  };
}
const victoryForm60 = document.getElementById("victoryForm");
if(victoryForm60){
  victoryForm60.onsubmit = async e => {
    e.preventDefault();
    let v = Object.fromEntries(new FormData(e.target).entries());
    v = await attachLocalFile60(v, e.target, "clipFile", "image");
    if(!v.image) return alert("Sube una captura/clip o pega una URL.");
    v.status="pending"; v.createdAt=new Date().toISOString();
    await push(ref(db,"victories"), v);
    await push(ref(db,"notifications"), {title:"Clip/Victoria enviada", body:`${v.gamertag} subió contenido a revisión.`, createdAt:new Date().toISOString()});
    e.target.reset();
    alert("Enviado a revisión.");
  };
}
// Clanes
const clanForm = document.getElementById("clanForm");
if(clanForm){
  clanForm.onsubmit = async e => {
    e.preventDefault();
    const c = Object.fromEntries(new FormData(e.target).entries());
    c.status = "pending"; c.createdAt = new Date().toISOString();
    await push(ref(db,"clans"), c);
    await push(ref(db,"notifications"), {title:"Nueva solicitud de clan", body:`${c.name} solicitó alianza con SHDW.`, createdAt:new Date().toISOString()});
    e.target.reset();
    document.getElementById("clanMsg")?.classList.remove("hide");
  };
}
function renderClans60(){
  const box=document.getElementById("clansList");
  if(!box) return;
  const list=arr(clansData);
  box.innerHTML=list.length?list.map(c=>`<div class="clanCard searchable">${c.logo?`<img src="${c.logo}">`:""}<h3>${c.name}</h3><p>Líder: ${c.leader||"N/A"}<br>Región: ${c.region||"Global"}<br>Idioma: ${c.language||"N/A"}<br>Miembros: ${c.members||"N/A"}</p><small>${c.status==="approved"?"✅ Clan aliado":"⏳ Pendiente"}</small><br>${c.discord?`<a href="${c.discord}" target="_blank">Discord/contacto</a>`:""}</div>`).join(""):"<p>Aún no hay clanes registrados.</p>";
}
// Ruleta equipos 2/3/4
function rouletteTeams60(){
  const players = arr(tourP || {});
  if(players.length < 2) return alert("Necesitas al menos 2 jugadores registrados en torneos.");
  const size = Number(document.getElementById("rouletteSize")?.value)||4;
  const shuffled = [...players].sort(()=>Math.random()-0.5);
  const teams=[];
  for(let i=0;i<shuffled.length;i+=size) teams.push(shuffled.slice(i,i+size));
  const box=document.getElementById("rouletteResult");
  if(box){
    box.classList.add("rouletteSpin");
    setTimeout(()=>box.classList.remove("rouletteSpin"),2500);
    box.innerHTML=teams.map((team,i)=>`<div class="teamCard searchable"><h3>Equipo ${i+1}</h3><ul>${team.map(p=>`<li>${p.gamertag||p.name||"Jugador"} · KD ${p.kd||0} · XP ${p.xp||0}</li>`).join("")}</ul></div>`).join("");
  }
  push(ref(db,"notifications"), {title:"Ruleta de equipos", body:`Se crearon equipos en grupos de ${size}.`, createdAt:new Date().toISOString()});
}
document.getElementById("rouletteBtn")?.addEventListener("click", rouletteTeams60);
// Admin Pro
function renderAdminPro60(){
  const playerBox=document.getElementById("deletePlayersList");
  if(playerBox){
    const q=(document.getElementById("deletePlayerSearch")?.value||"").toLowerCase();
    const all=[...arr(members||{}).map(x=>({...x,type:"members"})),...arr(profiles||{}).map(x=>({...x,type:"playerProfiles"}))].filter(p=>(p.gamertag||"").toLowerCase().includes(q));
    playerBox.innerHTML=all.map(p=>`<div class="deletePlayerCard"><b>${p.gamertag||"Jugador"}</b><br>${p.region||"Global"} · ${p.type}<br><button class="deleteBtn" onclick="adminDeletePlayer60('${p.type}','${p.id}','${p.gamertag||"Jugador"}')">Eliminar</button></div>`).join("")||"<p>Sin jugadores.</p>";
  }
  const notifBox=document.getElementById("adminNotificationsList");
  if(notifBox){
    notifBox.innerHTML=arr(notifications||{}).reverse().slice(0,40).map(n=>`<div class="notification"><b>${n.title}</b><p>${n.body}</p><button class="deleteBtn" onclick="remove(ref(db,'notifications/${n.id}'))">Borrar</button></div>`).join("")||"<p>Sin notificaciones.</p>";
  }
}
window.adminDeletePlayer60=async(type,id,name)=>{if(!confirm(`¿Eliminar a ${name}?`))return;await remove(ref(db,`${type}/${id}`));await push(ref(db,"notifications"),{title:"Jugador eliminado",body:`${name} fue eliminado por Admin Pro.`,createdAt:new Date().toISOString()});renderAdminPro60();};
document.getElementById("deletePlayerSearch")?.addEventListener("input",renderAdminPro60);
document.getElementById("clearNotificationsBtn")?.addEventListener("click",async()=>{if(confirm("¿Borrar todas las notificaciones?")) await set(ref(db,"notifications"),{});});
document.getElementById("clearRequestsBtn")?.addEventListener("click",async()=>{if(confirm("¿Borrar solicitudes pendientes?")) await set(ref(db,"requests"),{});});
document.getElementById("clearVictoriesBtn")?.addEventListener("click",async()=>{if(confirm("¿Borrar victorias pendientes?")){const all=arr(victories||{});for(const v of all.filter(x=>x.status!=="approved")) await remove(ref(db,"victories/"+v.id));}});
document.getElementById("clearStreamRequestsBtn")?.addEventListener("click",async()=>{if(confirm("¿Borrar solicitudes streamer?")) await set(ref(db,"streamerRequests"),{});});
document.getElementById("clearClansBtn")?.addEventListener("click",async()=>{if(confirm("¿Borrar clanes pendientes?")){const all=arr(clansData||{});for(const c of all.filter(x=>x.status!=="approved")) await remove(ref(db,"clans/"+c.id));}});
document.querySelectorAll('[data-tab="adminPro"]').forEach(b=>b.addEventListener("click",()=>setTimeout(renderAdminPro60,150)));
setInterval(()=>{if(document.getElementById("adminPro")?.classList.contains("active")) renderAdminPro60();},3000);

// SHDW 6.1 Founder Center + IA Meta Armas
const SHDW_META_LOADOUTS = [
  {role:"Largo alcance", weapon:"DS20 Mirage", type:"AR", attachments:["FANG HoverPoint ELO","Monolithic Suppressor","17.1 Abdicator Barrel","Griffon Reserve Extended II","Weighted Stock"], note:"Build estable para largo alcance."},
  {role:"Largo alcance", weapon:"MXR-17", type:"AR", attachments:["FANG HoverPoint ELO","Monolithic Suppressor","17 Greaves Scourge Barrel","Rhodes Drum Mag","Winch Stock"], note:"Buena opción para precisión y daño."},
  {role:"Corto alcance", weapon:"Dravec 45", type:"SMG", attachments:["Compensator","Long Barrel","Extended Mag","Quickdraw Grip","No Stock"], note:"Para peleas rápidas y movilidad."},
  {role:"Corto alcance", weapon:"Carbon 57", type:"SMG", attachments:["Suppressor","Reinforced Barrel","Extended Mag","Ergonomic Grip","Light Stock"], note:"SMG agresiva para interiores."},
  {role:"Sniper / soporte", weapon:"Strider 300", type:"Sniper", attachments:["Variable Scope","Suppressor","Long Barrel","Fast Mag","Precision Stock"], note:"Para cubrir escuadras a distancia."}
];

function metaHTML61(){
  return `<div class="metaLoadoutGrid">${SHDW_META_LOADOUTS.map(l=>`<div class="metaCard"><h4>${l.weapon}</h4><small>${l.role} · ${l.type}</small><ul>${l.attachments.map(a=>`<li>${a}</li>`).join("")}</ul><p>${l.note}</p></div>`).join("")}</div>`;
}

// Extend IA Premium response if function exists by overriding with meta support
if(typeof aiResponse53 === "function"){
  const oldAIResponse53 = aiResponse53;
  aiResponse53 = function(mode, question){
    if(mode === "meta"){
      const q = (question||"").toLowerCase();
      let filtered = SHDW_META_LOADOUTS;
      if(q.includes("smg") || q.includes("corto")) filtered = SHDW_META_LOADOUTS.filter(x=>x.role.includes("Corto"));
      if(q.includes("largo") || q.includes("ar")) filtered = SHDW_META_LOADOUTS.filter(x=>x.role.includes("Largo"));
      if(q.includes("sniper")) filtered = SHDW_META_LOADOUTS.filter(x=>x.type==="Sniper");
      return `🔫 <b>IA Meta Armas SHDW</b>\n\nMeta beta actual dentro de la app. El meta cambia con actualizaciones, así que úsalo como guía rápida.\n\n${filtered.map(l=>`${l.weapon} (${l.role})\n• ${l.attachments.join("\n• ")}\n`).join("\n")}`;
    }
    return oldAIResponse53(mode, question);
  };
}

// Founder Center
let founderUnlocked = localStorage.getItem("shdw_founder_unlocked") === "true";
function founderIsAllowed(email, code){
  return (email||"").toLowerCase().trim() === "scorpbz.oficial@gmail.com" && (code||"").trim().length >= 4;
}
function updateFounderUI(){
  const lock = document.getElementById("founderLock");
  const tools = document.getElementById("founderTools");
  if(lock) lock.classList.toggle("hide", founderUnlocked);
  if(tools) tools.classList.toggle("hide", !founderUnlocked);
  if(founderUnlocked) renderFounderCenter();
}
document.getElementById("founderLoginBtn")?.addEventListener("click",()=>{
  const email=document.getElementById("founderEmail")?.value;
  const code=document.getElementById("founderCode")?.value;
  if(!founderIsAllowed(email,code)) return alert("Acceso denegado. Usa el correo Founder y tu código.");
  founderUnlocked = true;
  localStorage.setItem("shdw_founder_unlocked","true");
  updateFounderUI();
});
document.getElementById("founderLogoutBtn")?.addEventListener("click",()=>{
  localStorage.removeItem("shdw_founder_unlocked");
  founderUnlocked=false;
  updateFounderUI();
});

function renderFounderCenter(){
  if(!document.getElementById("founderCenter")?.classList.contains("active")) return;
  const users=[...arr(members||{}).map(x=>({...x,type:"members"})),...arr(profiles||{}).map(x=>({...x,type:"playerProfiles"}))];
  const stream=arr(streamers||{});
  const cls=arr(clansData||{});
  const nots=arr(notifications||{});
  const set=(id,v)=>{const e=document.getElementById(id); if(e)e.textContent=v;};
  set("fUsers",users.length); set("fStreamers",stream.length); set("fClans",cls.length); set("fNotifications",nots.length);
  const q=(document.getElementById("founderPlayerSearch")?.value||"").toLowerCase();
  const playerBox=document.getElementById("founderPlayers");
  if(playerBox) playerBox.innerHTML=users.filter(u=>(u.gamertag||"").toLowerCase().includes(q)).map(u=>`<div class="founderPlayerCard"><b>${u.gamertag||"Jugador"}</b><br>${u.region||"Global"} · XP ${u.xp||0} · ${u.type}<br><button onclick="founderGiveXP61('${u.type}','${u.id}',100)">+100 XP</button><button onclick="founderGiveCoins61('${u.gamertag||"Jugador"}',100)">+100 Coins</button><button class="deleteBtn" onclick="adminDeletePlayer60?adminDeletePlayer60('${u.type}','${u.id}','${u.gamertag||"Jugador"}'):null">Eliminar</button></div>`).join("")||"<p>Sin usuarios.</p>";
  const streamerBox=document.getElementById("founderStreamers");
  if(streamerBox) streamerBox.innerHTML=stream.map(s=>`<div class="founderStreamerCard"><b>${s.name}</b><br>❤️ ${s.hearts||0} · XP ${s.streamerXP||0}<br><button onclick="addStreamerXP&&addStreamerXP('${s.id}',100,'Founder Center')">+100 XP Streamer</button><button class="deleteBtn" onclick="deleteStreamer&&deleteStreamer('${s.id}','${s.name}')">Eliminar</button></div>`).join("")||"<p>Sin streamers.</p>";
  const clanBox=document.getElementById("founderClans");
  if(clanBox) clanBox.innerHTML=cls.map(c=>`<div class="founderClanCard"><b>${c.name}</b><br>${c.region||"Global"} · ${c.status||"pending"}<br><button onclick="founderApproveClan61('${c.id}')">Aprobar alianza</button><button class="deleteBtn" onclick="founderDeleteClan61('${c.id}','${c.name}')">Eliminar</button></div>`).join("")||"<p>Sin clanes.</p>";
}
window.founderGiveXP61 = async (type,id,amount)=>{
  const path = `${type}/${id}`;
  const source = type==="members" ? members[id] : profiles[id];
  const xp = (Number(source?.xp)||0)+Number(amount);
  await update(ref(db,path),{xp});
  await push(ref(db,"notifications"),{title:"XP Founder",body:`${source?.gamertag||"Jugador"} recibió +${amount} XP desde Founder Center.`,createdAt:new Date().toISOString()});
};
window.founderGiveCoins61 = async (gamertag,amount)=>{
  await push(ref(db,"notifications"),{title:"Coins Founder",body:`${gamertag} recibió ${amount} SHDW Coins desde Founder Center.`,createdAt:new Date().toISOString()});
  alert("Notificación creada. Coins personales se aplican en saldo local del usuario.");
};
window.founderApproveClan61 = async id=>{
  await update(ref(db,"clans/"+id),{status:"approved",approvedAt:new Date().toISOString()});
  await push(ref(db,"notifications"),{title:"Clan aliado aprobado",body:`Un clan fue aprobado como aliado SHDW.`,createdAt:new Date().toISOString()});
};
window.founderDeleteClan61 = async (id,name)=>{
  if(!confirm(`¿Eliminar clan ${name}?`)) return;
  await remove(ref(db,"clans/"+id));
};
document.getElementById("founderPlayerSearch")?.addEventListener("input",renderFounderCenter);
document.getElementById("founderBroadcastBtn")?.addEventListener("click",async()=>{
  const msg=document.getElementById("founderAnnouncement")?.value||"Nuevo anuncio SHDW.";
  await push(ref(db,"notifications"),{title:"Anuncio Founder",body:msg,createdAt:new Date().toISOString()});
  alert("Anuncio enviado.");
});
document.getElementById("founderClearAllNotifications")?.addEventListener("click",async()=>{
  if(confirm("¿Limpiar todas las notificaciones?")) await set(ref(db,"notifications"),{});
});
document.getElementById("founderExportBtn")?.addEventListener("click",()=>{
  const summary=`SHDW Founder Summary\nUsuarios: ${arr(members||{}).length+arr(profiles||{}).length}\nStreamers: ${arr(streamers||{}).length}\nClanes: ${arr(clansData||{}).length}\nNotificaciones: ${arr(notifications||{}).length}`;
  navigator.clipboard?.writeText(summary);
  alert(summary);
});
document.getElementById("founderAIButton")?.addEventListener("click",()=>{
  const q=(document.getElementById("founderAIQuestion")?.value||"").toLowerCase();
  const out=document.getElementById("founderAIOutput");
  const users=arr(profiles||{}), stream=arr(streamers||{}), cls=arr(clansData||{});
  let msg=`👑 IA Founder SHDW\n\nResumen:\nUsuarios: ${users.length}\nStreamers: ${stream.length}\nClanes: ${cls.length}\n\n`;
  if(q.includes("streamer")) msg += "Streamer recomendado: revisa el que tenga más corazones y XP. Dale promoción semanal.";
  else if(q.includes("clan")) msg += "Recomendación: aprueba clanes con Discord activo, región clara y líder responsable.";
  else if(q.includes("anuncio")) msg += "Anuncio sugerido: 'Registros gratis, beta abierta y buscamos jugadores, clanes y streamers para crecer juntos.'";
  else msg += "Prioridad: reclutar 20 Founder, 5 streamers y 3 clanes aliados para activar torneos globales.";
  if(out) out.textContent=msg;
});
document.querySelectorAll('[data-tab="founderCenter"]').forEach(b=>b.addEventListener("click",()=>setTimeout(updateFounderUI,150)));
setInterval(()=>{ if(founderUnlocked) renderFounderCenter(); },3000);

// SHDW 6.2: ocultar Admin Pro + Chat Mundial
function shdwCurrentEmail62(){
  try{
    const p = currentPlayer || JSON.parse(localStorage.getItem("shdw_current_player") || "null") || {};
    return (p.email || "").toLowerCase().trim();
  }catch(e){ return ""; }
}
function updateAdminVisibility62(){
  const email = shdwCurrentEmail62();
  const founderUnlocked = localStorage.getItem("shdw_founder_unlocked") === "true";
  const allowed = email === "scorpbz.oficial@gmail.com" || founderUnlocked;
  const adminBtn = document.getElementById("adminProBtn");
  const founderBtn = document.getElementById("founderCenterBtn");
  if(adminBtn) adminBtn.classList.toggle("hide", !allowed);
  if(founderBtn) founderBtn.classList.toggle("hide", !allowed);
}
setInterval(updateAdminVisibility62,1500);
setTimeout(updateAdminVisibility62,800);
document.querySelectorAll('[data-tab="adminPro"],[data-tab="founderCenter"]').forEach(btn=>{
  btn.addEventListener("click",e=>{
    const email = shdwCurrentEmail62();
    const founderUnlocked = localStorage.getItem("shdw_founder_unlocked") === "true";
    if(email !== "scorpbz.oficial@gmail.com" && !founderUnlocked){
      e.preventDefault();
      alert("Acceso exclusivo para ScorpionBz / Founder.");
      document.querySelector('[data-tab="home"]')?.click();
    }
  });
});

let worldChatData = {};
try{
  onValue(ref(db,"worldChat"), s => {
    worldChatData = s.val() || {};
    renderWorldChat62();
  });
}catch(e){}
function renderWorldChat62(){
  const box = document.getElementById("worldChatMessages");
  if(!box) return;
  const msgs = arr(worldChatData).sort((a,b)=>(a.createdAt||"").localeCompare(b.createdAt||"")).slice(-80);
  box.innerHTML = msgs.length ? msgs.map(m=>`
    <div class="chatMsg searchable"><b>${m.name || "Operador SHDW"}</b><p>${(m.text || "").replace(/[<>]/g,"")}</p><small>${m.time || ""}</small></div>
  `).join("") : "<p>Sin mensajes todavía. Sé el primero en escribir.</p>";
  box.scrollTop = box.scrollHeight;
}
const worldChatForm = document.getElementById("worldChatForm");
if(worldChatForm){
  worldChatForm.onsubmit = async e => {
    e.preventDefault();
    const input = document.getElementById("worldChatText");
    const nameInput = document.getElementById("worldChatName");
    const player = currentPlayer || JSON.parse(localStorage.getItem("shdw_current_player") || "null") || {};
    const name = (nameInput?.value || player.gamertag || "Operador SHDW").trim();
    const text = (input?.value || "").trim();
    if(!text) return;
    await push(ref(db,"worldChat"), {name,text,time:new Date().toLocaleString(),createdAt:new Date().toISOString()});
    input.value = "";
  };
}
document.querySelectorAll('[data-tab="worldChat"]').forEach(b=>b.addEventListener("click",()=>setTimeout(renderWorldChat62,100)));

// SHDW 6.3 Creator Edition
let creatorsData={},creatorRequestsData={},liveData={},collabData={};
try{onValue(ref(db,"creators"),s=>{creatorsData=s.val()||{};renderCreators63();renderCreatorRank63();renderFounderCreator63()});onValue(ref(db,"creatorRequests"),s=>{creatorRequestsData=s.val()||{};renderFounderCreator63()});onValue(ref(db,"liveNow"),s=>{liveData=s.val()||{};renderLive63();renderFounderCreator63()});onValue(ref(db,"collabs"),s=>{collabData=s.val()||{};renderCollabs63();renderFounderCreator63()})}catch(e){}
function creatorStatusLabel63(status){return {founder:"🏅 Streamer Fundador",official:"🥉 Oficial",elite:"🥈 Elite",legend:"🥇 Legend",partner:"👑 Partner SHDW"}[status]||"⏳ Pendiente"}
function creatorScore63(c){return (Number(c.creatorXP)||0)+(Number(c.hearts)||0)*20+(Number(c.clips)||0)*30+(Number(c.lives)||0)*50}
function renderCreators63(){const box=document.getElementById("creatorDirectory");if(!box)return;const q=(document.getElementById("creatorSearch")?.value||"").toLowerCase(),pf=document.getElementById("creatorPlatformFilter")?.value||"",sf=document.getElementById("creatorStatusFilter")?.value||"";let list=arr(creatorsData);if(!list.length&&typeof streamers!=="undefined")list=arr(streamers||{}).map(s=>({...s,status:s.status==="official"?"official":(s.status||"official"),creatorXP:s.streamerXP||0}));list=list.filter(c=>{const text=`${c.name||""} ${c.region||""} ${c.game||""} ${c.language||""}`.toLowerCase();return(!q||text.includes(q))&&(!pf||c.platform===pf)&&(!sf||c.status===sf)}).sort((a,b)=>creatorScore63(b)-creatorScore63(a));box.innerHTML=list.length?list.map(c=>`<div class="creatorCard ${c.status||"official"} searchable">${c.photo?`<img src="${c.photo}">`:""}<h3>${c.name||"Creador SHDW"}</h3><span class="creatorStatus">${creatorStatusLabel63(c.status||"official")}</span><p>${c.platform||"Plataforma"} · ${c.game||"Warzone"}<br>${c.region||"Global"} · ${c.language||"ES"}</p><div class="creatorStats"><span>❤️ ${c.hearts||0}</span><span>XP ${c.creatorXP||0}</span><span>Clips ${c.clips||0}</span><span>Directos ${c.lives||0}</span></div>${c.channel?`<a href="${c.channel}" target="_blank">Ver canal</a>`:""}<br><button class="heartBtn" onclick="supportCreator63('${c.id}')">❤️ Apoyar</button></div>`).join(""):"<p>No hay creadores todavía.</p>"}
document.getElementById("creatorSearch")?.addEventListener("input",renderCreators63);document.getElementById("creatorPlatformFilter")?.addEventListener("change",renderCreators63);document.getElementById("creatorStatusFilter")?.addEventListener("change",renderCreators63);
const creatorForm=document.getElementById("creatorForm");if(creatorForm){creatorForm.onsubmit=async e=>{e.preventDefault();const c=Object.fromEntries(new FormData(e.target).entries());c.status="pending";c.creatorXP=0;c.hearts=0;c.clips=0;c.lives=0;c.createdAt=new Date().toISOString();await push(ref(db,"creatorRequests"),c);await push(ref(db,"notifications"),{title:"Solicitud de creador",body:`${c.name} quiere entrar al Centro de Creadores SHDW.`,createdAt:new Date().toISOString()});e.target.reset();document.getElementById("creatorMsg")?.classList.remove("hide")}}
window.supportCreator63=async id=>{const c=creatorsData[id]||(typeof streamers!=="undefined"?streamers[id]:null);if(!c)return;const key="creatorHeart_"+id+"_"+new Date().toDateString();if(localStorage.getItem(key))return alert("Ya apoyaste a este creador hoy.");localStorage.setItem(key,"1");const path=creatorsData[id]?"creators/":"streamers/";await update(ref(db,path+id),{hearts:(Number(c.hearts)||0)+1});if(typeof completeMission==="function")completeMission("support_streamer");await push(ref(db,"notifications"),{title:"Apoyo a creador",body:`${c.name} recibió un corazón.`,createdAt:new Date().toISOString()})};
const liveForm=document.getElementById("liveForm");if(liveForm){liveForm.onsubmit=async e=>{e.preventDefault();const l=Object.fromEntries(new FormData(e.target).entries());l.active=true;l.startedAt=new Date().toISOString();l.time=new Date().toLocaleString();await push(ref(db,"liveNow"),l);await push(ref(db,"notifications"),{title:"🔴 Directo en vivo",body:`${l.name} está en directo: ${l.title||l.game||"Warzone"}`,createdAt:new Date().toISOString()});e.target.reset();alert("Directo publicado.")}}
function renderLive63(){const box=document.getElementById("liveList");if(!box)return;const list=arr(liveData).filter(x=>x.active!==False).reverse();box.innerHTML=list.length?list.map(l=>`<div class="liveCard searchable"><span class="liveBadge">🔴 EN VIVO</span><h3>${l.name}</h3><p>${l.title||"Directo SHDW"}<br>${l.platform||""} · ${l.game||"Warzone"}</p>${l.link?`<a href="${l.link}" target="_blank">Ver directo</a>`:""}<br><small>${l.time||""}</small></div>`).join(""):"<p>No hay directos activos.</p>"}
const collabForm=document.getElementById("collabForm");if(collabForm){collabForm.onsubmit=async e=>{e.preventDefault();const c=Object.fromEntries(new FormData(e.target).entries());c.createdAt=new Date().toISOString();c.time=new Date().toLocaleString();await push(ref(db,"collabs"),c);await push(ref(db,"notifications"),{title:"Nueva colaboración",body:`${c.name} publicó: ${c.type}`,createdAt:new Date().toISOString()});e.target.reset()}}
function renderCollabs63(){const box=document.getElementById("collabList");if(!box)return;const list=arr(collabData).reverse();box.innerHTML=list.length?list.map(c=>`<div class="collabCard searchable"><h3>${c.type}</h3><b>${c.name}</b><p>${c.message||""}<br>${c.region||"Global"} · ${c.platform||""}</p><small>${c.contact||""}<br>${c.time||""}</small></div>`).join(""):"<p>No hay colaboraciones publicadas.</p>"}
function renderCreatorRank63(){const box=document.getElementById("creatorRankList");if(!box)return;const list=arr(creatorsData).sort((a,b)=>creatorScore63(b)-creatorScore63(a));box.innerHTML=list.length?list.map((c,i)=>`<div class="row searchable"><span>${i+1}</span><b>${c.name}</b><span>${creatorStatusLabel63(c.status)}</span><span>❤️${c.hearts||0}</span><span>${creatorScore63(c)}</span></div>`).join(""):"<p>Sin ranking de creadores.</p>"}
function renderFounderCreator63(){if(!document.getElementById("founderCenter")?.classList.contains("active"))return;const reqBox=document.getElementById("founderCreatorRequests");if(reqBox){const reqs=arr(creatorRequestsData);reqBox.innerHTML=reqs.length?reqs.map(c=>`<div class="founderStreamerCard searchable"><b>${c.name}</b><br>${c.platform} · ${c.followers||"N/A"} seguidores · ${c.region||"Global"}<br><button class="red" onclick="approveCreator63('${c.id}','founder')">Aprobar Fundador</button><button onclick="approveCreator63('${c.id}','official')">Aprobar Oficial</button><button class="deleteBtn" onclick="rejectCreator63('${c.id}')">Rechazar</button></div>`).join(""):"<p>Sin solicitudes de creadores.</p>"}const liveBox=document.getElementById("founderLiveList");if(liveBox)liveBox.innerHTML=arr(liveData).reverse().slice(0,15).map(l=>`<div class="founderStreamerCard"><b>${l.name}</b><br>${l.title||"Directo"}<br><button class="deleteBtn" onclick="remove(ref(db,'liveNow/${l.id}'))">Borrar</button></div>`).join("")||"<p>Sin directos.</p>";const collabBox=document.getElementById("founderCollabList");if(collabBox)collabBox.innerHTML=arr(collabData).reverse().slice(0,15).map(c=>`<div class="founderStreamerCard"><b>${c.name}</b> · ${c.type}<br>${c.message||""}<br><button class="deleteBtn" onclick="remove(ref(db,'collabs/${c.id}'))">Borrar</button></div>`).join("")||"<p>Sin colaboraciones.</p>"}
window.approveCreator63=async(id,status)=>{const c=creatorRequestsData[id];if(!c)return;c.status=status;c.approvedAt=new Date().toISOString();c.creatorXP=status==="founder"?500:100;await push(ref(db,"creators"),c);await remove(ref(db,"creatorRequests/"+id));await push(ref(db,"notifications"),{title:"Nuevo creador SHDW",body:`${c.name} fue aprobado como ${creatorStatusLabel63(status)}.`,createdAt:new Date().toISOString()})};window.rejectCreator63=async id=>remove(ref(db,"creatorRequests/"+id));
document.querySelectorAll('[data-tab="creatorHub"],[data-tab="liveNow"],[data-tab="collabs"],[data-tab="creatorRank"],[data-tab="founderCenter"]').forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{renderCreators63();renderLive63();renderCollabs63();renderCreatorRank63();renderFounderCreator63()},150)));setInterval(()=>{renderFounderCreator63()},3000);

// SHDW 6.4 Perfil premium + galería + amigos
let friendsData64={};try{onValue(ref(db,"friends"),s=>{friendsData64=s.val()||{};renderFriends64()})}catch(e){}
function file64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
async function attach64(data,form,input,target){const f=form.querySelector(`[name="${input}"]`)?.files?.[0];if(f){if(f.size>4000000){alert("Archivo pesado. Usa uno más ligero.");return data}data[target]=await file64(f);data[target+"Name"]=f.name}return data}
const reg64=document.getElementById("registerForm");if(reg64){reg64.onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());p=await attach64(p,e.target,"photoFile","photo");p=await attach64(p,e.target,"coverFile","cover");p.xp=100;p.wins=0;p.kills=0;p.level=1;p.rank="🎯 Recruit";p.friends=0;p.createdAt=new Date().toISOString();const saved=await push(ref(db,"playerProfiles"),p);currentPlayer={...p,id:saved.key};localStorage.setItem("shdw_current_player",JSON.stringify(currentPlayer));await push(ref(db,"notifications"),{title:"Nuevo perfil SHDW",body:`${p.gamertag} creó su perfil.`,createdAt:new Date().toISOString()});e.target.reset();if(typeof showAuthGateIfNeeded==="function")showAuthGateIfNeeded();if(typeof render==="function")render()}}
const prof64=document.getElementById("profileForm");if(prof64){prof64.onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());p=await attach64(p,e.target,"photoFile","photo");p=await attach64(p,e.target,"coverFile","cover");p.createdAt=new Date().toISOString();p.friends=0;const saved=await push(ref(db,"playerProfiles"),p);currentPlayer={...p,id:saved.key};localStorage.setItem("shdw_current_player",JSON.stringify(currentPlayer));e.target.reset();alert("Perfil guardado con foto.")}}
const vic64=document.getElementById("victoryForm");if(vic64){vic64.onsubmit=async e=>{e.preventDefault();let v=Object.fromEntries(new FormData(e.target).entries());v=await attach64(v,e.target,"clipFile","image");if(!v.image)return alert("Sube una captura/clip o pega URL.");v.status="pending";v.createdAt=new Date().toISOString();await push(ref(db,"victories"),v);await push(ref(db,"notifications"),{title:"Victoria/clip enviada",body:`${v.gamertag} subió contenido a revisión.`,createdAt:new Date().toISOString()});e.target.reset();alert("Enviado a revisión.")}}
function fcount64(id,name){return arr(friendsData64).filter(f=>f.status==="accepted"&&(f.fromId===id||f.toId===id||f.fromName===name||f.toName===name)).length}
window.sendFriendRequest64=async(toId,toName)=>{const me=currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null");if(!me)return alert("Primero crea tu perfil.");if(me.id===toId||me.gamertag===toName)return alert("No puedes agregarte a ti mismo.");await push(ref(db,"friends"),{fromId:me.id||"",fromName:me.gamertag||"Jugador SHDW",toId,toName,status:"pending",createdAt:new Date().toISOString()});alert("Solicitud enviada.")}
window.acceptFriend64=async id=>{await update(ref(db,"friends/"+id),{status:"accepted",acceptedAt:new Date().toISOString()});alert("Solicitud aceptada.")}
window.rejectFriend64=async id=>remove(ref(db,"friends/"+id))
function premiumCard64(p){const fc=fcount64(p.id,p.gamertag),av=p.photo?`<img class="profileAvatar" src="${p.photo}">`:`<div class="profileAvatarFallback">👤</div>`,cv=p.cover?`style="background-image:url('${p.cover}')"`:"";return `<article class="profileCardPremium searchable"><div class="profileCover" ${cv}></div><div class="profileTop">${av}<div><h3>${p.gamertag||"Operador SHDW"}</h3><span>${p.rank||"🎯 Recruit"}</span></div></div><div class="profileBadgeLine"><span>🌎 ${p.region||"Global"}</span><span>🎮 ${p.game||"Warzone"}</span><span>XP ${p.xp||0}</span><span>🤝 ${fc} amigos</span></div><p>${p.bio||""}</p><div class="profileActions"><button onclick="openProfileModal64('${p.id}')">👤 Ver perfil</button><button class="friendBtn" onclick="sendFriendRequest64('${p.id}','${p.gamertag||"Jugador"}')">➕ Agregar</button></div></article>`}
if(typeof renderProfiles==="function"){renderProfiles=function(){const box=document.getElementById("profilesList");if(!box)return;const list=arr(profiles||{});box.innerHTML=list.length?list.map(p=>premiumCard64(p)).join(""):"<p>Aún no hay perfiles.</p>"}}
window.openProfileModal64=function(id){const p=(profiles&&profiles[id])||arr(profiles||{}).find(x=>x.id===id)||currentPlayer||{};const modal=document.getElementById("modal"),content=document.getElementById("modalContent");if(!modal||!content)return;const cv=p.cover?`style="background-image:url('${p.cover}')"`:"",av=p.photo?`<img class="profileModalAvatar" src="${p.photo}">`:`<div class="profileModalAvatar" style="display:grid;place-items:center;font-size:3rem;">👤</div>`;content.innerHTML=`<div><div class="profileModalHeader" ${cv}></div>${av}<h2>${p.gamertag||"Operador SHDW"}</h2><p>${p.rank||"🎯 Recruit"}<br>${p.region||"Global"} · ${p.game||"Warzone"}</p><div class="profileModalStats"><article><b>${p.xp||0}</b><small>XP</small></article><article><b>${p.wins||0}</b><small>Victorias</small></article><article><b>${fcount64(p.id,p.gamertag)}</b><small>Amigos</small></article></div><p>${p.bio||""}</p><button class="friendBtn" onclick="sendFriendRequest64('${p.id}','${p.gamertag||"Jugador"}')">➕ Agregar amigo</button></div>`;modal.classList.remove("hide")}
function renderFriends64(){const me=currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null")||{},players=arr(profiles||{}),q=(document.getElementById("friendSearch")?.value||"").toLowerCase(),fl=arr(friendsData64),mf=fl.filter(f=>f.status==="accepted"&&(f.fromId===me.id||f.toId===me.id||f.fromName===me.gamertag||f.toName===me.gamertag)),mr=fl.filter(f=>f.status==="pending"&&(f.toId===me.id||f.toName===me.gamertag));["myFriendsCount","myRequestsCount","communityPlayersCount"].forEach((id,i)=>{const e=document.getElementById(id);if(e)e.textContent=[mf.length,mr.length,players.length][i]});const dir=document.getElementById("friendsDirectory");if(dir){const filtered=players.filter(p=>`${p.gamertag||""} ${p.region||""} ${p.game||""}`.toLowerCase().includes(q));dir.innerHTML=filtered.length?filtered.map(p=>`<div class="friendCard searchable">${p.photo?`<img src="${p.photo}">`:""}<h3>${p.gamertag}</h3><p>${p.region||"Global"} · ${p.game||"Warzone"}<br>🤝 ${fcount64(p.id,p.gamertag)} amigos</p><button class="friendBtn" onclick="sendFriendRequest64('${p.id}','${p.gamertag||"Jugador"}')">➕ Agregar</button></div>`).join(""):"<p>No se encontraron jugadores.</p>"}const myBox=document.getElementById("myFriendsList");if(myBox)myBox.innerHTML=mf.length?mf.map(f=>`<div class="friendCard"><h3>${f.fromName===me.gamertag?f.toName:f.fromName}</h3><p>Amigo SHDW</p></div>`).join(""):"<p>Aún no tienes amigos.</p>";const req=document.getElementById("friendRequestsList");if(req)req.innerHTML=mr.length?mr.map(f=>`<div class="friendRequestCard"><b>${f.fromName}</b> quiere agregarte.<br><button class="red" onclick="acceptFriend64('${f.id}')">Aceptar</button><button onclick="rejectFriend64('${f.id}')">Rechazar</button></div>`).join(""):"<p>Sin solicitudes pendientes.</p>"}
document.getElementById("friendSearch")?.addEventListener("input",renderFriends64);document.querySelectorAll('[data-tab="profiles"],[data-tab="friends"]').forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{if(typeof renderProfiles==="function")renderProfiles();renderFriends64()},150)));
if(typeof renderGallery==="function"){renderGallery=function(){const box=document.getElementById("galleryList");if(!box)return;const list=arr(victories||{}).filter(v=>v.status==="approved");box.innerHTML=list.length?list.map(v=>{const isVideo=(v.image||"").startsWith("data:video")||/\.(mp4|webm|ogg)$/i.test(v.image||"");const media=isVideo?`<video class="galleryMedia" controls src="${v.image}"></video>`:`<img class="galleryMedia" src="${v.image}">`;return `<article class="searchable">${media}<h3>${v.gamertag}</h3><p>Kills: ${v.kills||0} · ${v.mode||"Warzone"}<br>${v.notes||""}</p></article>`}).join(""):"<p>No hay victorias aprobadas todavía.</p>"}}
setTimeout(()=>{renderFriends64();},1200);

// SHDW 6.5 Recompensas reales + menú de upload limpio
let adminRewards65={};
try{onValue(ref(db,"adminRewards"),s=>{adminRewards65=s.val()||{};applyMyRewards65();renderAdminRewards65()})}catch(e){}
function getMe65(){try{return currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null")||{}}catch(e){return {}}}
function rewardMatches65(r,me){const t=(r.gamertag||r.user||r.target||"").toLowerCase().trim(),em=(r.email||"").toLowerCase().trim();return(t&&t===(me.gamertag||"").toLowerCase().trim())||(em&&em===(me.email||"").toLowerCase().trim())}
async function applyMyRewards65(){const me=getMe65();if(!me||!me.gamertag)return;const applied=JSON.parse(localStorage.getItem("shdw_applied_rewards")||"{}");let changed=false;let eco=JSON.parse(localStorage.getItem("shdw_economy")||'{"coins":0,"history":[],"inventory":[]}');for(const r of arr(adminRewards65)){if(applied[r.id]||r.status==="cancelled")continue;if(!rewardMatches65(r,me))continue;const xp=Number(r.xp||0),coins=Number(r.coins||0);if(xp){me.xp=(Number(me.xp)||0)+xp;changed=true}if(coins){eco.coins=(Number(eco.coins)||0)+coins;eco.history=eco.history||[];eco.history.unshift({title:"Coins admin",amount:coins,reason:r.reason||"Recompensa SHDW",date:new Date().toLocaleString()});changed=true}applied[r.id]=true;try{await update(ref(db,"adminRewards/"+r.id),{status:"claimed",claimedAt:new Date().toISOString()})}catch(e){}}localStorage.setItem("shdw_applied_rewards",JSON.stringify(applied));if(changed){currentPlayer=me;localStorage.setItem("shdw_current_player",JSON.stringify(me));localStorage.setItem("shdw_economy",JSON.stringify(eco));if(typeof renderDashboard==="function")renderDashboard();if(typeof renderEconomy==="function")renderEconomy();if(typeof render==="function")setTimeout(render,200);alert("🎁 Recibiste nuevas recompensas SHDW. Revisa tu XP y Coins.")}}
document.getElementById("giveCoinsBtn")?.addEventListener("click",async()=>{const gamertag=document.getElementById("coinUser")?.value.trim(),amount=Number(document.getElementById("coinAmount")?.value||0),reason=document.getElementById("coinReason")?.value||"Recompensa manual";if(!gamertag||!amount)return alert("Escribe gamertag y cantidad.");await push(ref(db,"adminRewards"),{gamertag,coins:amount,xp:0,reason,status:"pending",createdAt:new Date().toISOString()});await push(ref(db,"notifications"),{title:"Coins otorgados",body:`${gamertag} recibió ${amount} SHDW Coins por ${reason}.`,createdAt:new Date().toISOString()});alert("Coins enviados. Se reflejarán cuando el usuario abra la app.")});
document.getElementById("giveXPBtn")?.addEventListener("click",async()=>{const gamertag=document.getElementById("xpUser")?.value.trim(),amount=Number(document.getElementById("xpAmount")?.value||0),reason=document.getElementById("xpReason")?.value||"Recompensa manual";if(!gamertag||!amount)return alert("Escribe gamertag y cantidad.");await push(ref(db,"adminRewards"),{gamertag,xp:amount,coins:0,reason,status:"pending",createdAt:new Date().toISOString()});await push(ref(db,"notifications"),{title:"XP otorgado",body:`${gamertag} recibió +${amount} XP por ${reason}.`,createdAt:new Date().toISOString()});alert("XP enviado. Se reflejará cuando el usuario abra la app.")});
function renderAdminRewards65(){const box=document.getElementById("adminRewardsLog");if(!box)return;const list=arr(adminRewards65).reverse().slice(0,40);box.innerHTML=list.length?list.map(r=>`<div class="rewardCard"><b>${r.gamertag||r.email||"Usuario"}</b><p>XP: ${r.xp||0} · Coins: ${r.coins||0}<br>${r.reason||""}</p><span class="rewardSynced">${r.status||"pending"}</span></div>`).join(""):"<p>Aún no hay recompensas otorgadas.</p>"}
setInterval(applyMyRewards65,5000);setTimeout(applyMyRewards65,1500);

// SHDW 7.0 Social Feed + Clan Wars + Mapa
let socialPosts70={},clanWars70={};
try{onValue(ref(db,"socialPosts"),s=>{socialPosts70=s.val()||{};renderSocial70();updateProfileSocial70()});onValue(ref(db,"clanWars"),s=>{clanWars70=s.val()||{};renderClanWars70()})}catch(e){}
async function file70(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
const postForm70=document.getElementById("postForm");if(postForm70){postForm70.onsubmit=async e=>{e.preventDefault();let p=Object.fromEntries(new FormData(e.target).entries());const me=currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null")||{};p.author=p.author||me.gamertag||"Operador SHDW";const f=e.target.querySelector('[name="postFile"]')?.files?.[0];if(f){if(f.size>4000000)return alert("Archivo muy pesado.");p.image=await file70(f)}p.likes=0;p.createdAt=new Date().toISOString();p.time=new Date().toLocaleString();await push(ref(db,"socialPosts"),p);await push(ref(db,"notifications"),{title:"Nueva publicación",body:`${p.author} publicó en el Feed Social.`,createdAt:new Date().toISOString()});e.target.reset()}}
function renderSocial70(){const box=document.getElementById("socialFeedList");if(!box)return;const list=arr(socialPosts70).sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));box.innerHTML=list.length?list.map(p=>{const isVid=(p.image||"").startsWith("data:video")||/\.(mp4|webm|ogg)$/i.test(p.image||"");const media=p.image?(isVid?`<video controls src="${p.image}"></video>`:`<img src="${p.image}">`):"";return `<article class="socialPost searchable"><div class="socialPostHeader"><b>${p.author}</b><span class="socialPostType">${p.type||"Publicación"}</span></div><p>${(p.text||"").replace(/[<>]/g,"")}</p>${media}<div class="socialActions"><button onclick="likePost70('${p.id}',${Number(p.likes)||0})">❤️ ${p.likes||0}</button><button onclick="sharePost70('${p.author}')">📤 Compartir</button></div><small>${p.time||""}</small></article>`}).join(""):"<p>Aún no hay publicaciones.</p>"}
window.likePost70=async(id,likes)=>{const key="likePost70_"+id;if(localStorage.getItem(key))return alert("Ya diste corazón a esta publicación.");localStorage.setItem(key,"1");await update(ref(db,"socialPosts/"+id),{likes:likes+1})}
window.sharePost70=(author)=>{if(navigator.share)navigator.share({title:"SHDW",text:`Mira la publicación de ${author} en Shadow Ops Global`});else alert("Copia el enlace de la app para compartir.")}

const clanWarForm70=document.getElementById("clanWarForm");if(clanWarForm70){clanWarForm70.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());const safe=(d.clan||"Clan").replace(/[.#$/\[\]]/g,"_");const current=clanWars70[safe]||{clan:d.clan,points:0,history:[]};current.points=(Number(current.points)||0)+Number(d.points||0);current.clan=d.clan;current.history=current.history||[];current.history.unshift({points:Number(d.points),reason:d.reason,time:new Date().toLocaleString()});await set(ref(db,"clanWars/"+safe),current);await push(ref(db,"notifications"),{title:"Guerra de Clanes",body:`${d.clan} ganó ${d.points} puntos por ${d.reason}.`,createdAt:new Date().toISOString()});e.target.reset()}}
function renderClanWars70(){const list=arr(clanWars70).sort((a,b)=>(Number(b.points)||0)-(Number(a.points)||0));const box=document.getElementById("clanWarRank");if(box)box.innerHTML=list.length?list.map((c,i)=>`<div class="clanWarRow searchable"><span>#${i+1}</span><b>${c.clan}</b><span>${c.points||0} pts</span></div>`).join(""):"<p>Sin puntos de clanes.</p>";const wc=document.getElementById("warClans"),wp=document.getElementById("warPoints");if(wc)wc.textContent=list.length;if(wp)wp.textContent=list.reduce((a,c)=>a+(Number(c.points)||0),0)}
function renderWorldMap70(){const box=document.getElementById("countryStats");if(!box)return;const all=[...arr(profiles||{}),...arr(creatorsData||{}),...arr(clansData||{})];const map={};all.forEach(x=>{const r=(x.region||x.country||"Global").trim()||"Global";map[r]=(map[r]||0)+1});const list=Object.entries(map).sort((a,b)=>b[1]-a[1]);box.innerHTML=list.length?list.map(([c,n])=>`<div class="countryCard"><b>${n}</b><span>${c}</span></div>`).join(""):"<p>Aún no hay regiones registradas.</p>"}
function updateProfileSocial70(){if(typeof openProfileModal64!=="function")return;const old=openProfileModal64;if(window._socialProfilePatched70)return;window._socialProfilePatched70=true;window.openProfileModal64=function(id){old(id);setTimeout(()=>{const content=document.getElementById("modalContent");const p=(profiles&&profiles[id])||arr(profiles||{}).find(x=>x.id===id)||currentPlayer||{};if(!content||!p.gamertag)return;const posts=arr(socialPosts70).filter(x=>(x.author||"").toLowerCase()===(p.gamertag||"").toLowerCase()).slice(0,5);const wall=`<h3>📰 Muro social</h3><div class="socialProfileWall">${posts.length?posts.map(po=>`<div class="miniPost"><b>${po.type||"Post"}</b><p>${po.text||""}</p><small>❤️ ${po.likes||0}</small></div>`).join(""):"<p>Sin publicaciones todavía.</p>"}</div>`;content.innerHTML+=wall},100)}}
document.querySelectorAll('[data-tab="socialFeed"],[data-tab="clanWars"],[data-tab="worldMap"]').forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{renderSocial70();renderClanWars70();renderWorldMap70()},150)));
setTimeout(()=>{renderSocial70();renderClanWars70();renderWorldMap70();updateProfileSocial70()},1200);

// SHDW 8.0 Mensajes privados, Studio, Verificación, Pase
let dmData80={},studioData80={},verifyData80={};let activeDM80=null;
try{onValue(ref(db,"privateMessages"),s=>{dmData80=s.val()||{};renderDM80()});onValue(ref(db,"streamerStudio"),s=>{studioData80=s.val()||{};renderStudio80()});onValue(ref(db,"verifyRequests"),s=>{verifyData80=s.val()||{};renderVerify80()})}catch(e){}
function me80(){try{return currentPlayer||JSON.parse(localStorage.getItem("shdw_current_player")||"null")||{}}catch(e){return {}}}
async function file80(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})}
function thread80(a,b){return [a||"anon",b||"anon"].sort().join("__").replace(/[.#$/\[\]]/g,"_")}
function renderDM80(){const me=me80();const contacts=document.getElementById("dmContacts");const msgs=document.getElementById("dmMessages");if(contacts){const players=arr(profiles||{}).filter(p=>p.gamertag!==me.gamertag);contacts.innerHTML=players.length?players.map(p=>`<div class="dmContact" onclick="openDM80('${p.gamertag}')"><b>${p.gamertag}</b><br><small>${p.region||"Global"} · ${p.game||"Warzone"}</small></div>`).join(""):"<p>No hay contactos.</p>"}if(msgs){if(!activeDM80){msgs.innerHTML="<p>Selecciona un contacto.</p>";return}const th=thread80(me.gamertag,activeDM80);const list=arr(dmData80[th]||{});msgs.innerHTML=list.length?list.map(m=>`<div class="dmMsg ${m.from===me.gamertag?"me":"them"}"><b>${m.from}</b><p>${(m.text||"").replace(/[<>]/g,"")}</p><small>${m.time||""}</small></div>`).join(""):"<p>Sin mensajes.</p>";msgs.scrollTop=msgs.scrollHeight}}
window.openDM80=(name)=>{activeDM80=name;const t=document.getElementById("dmTitle");if(t)t.textContent="Chat con "+name;renderDM80()}
document.getElementById("dmForm")?.addEventListener("submit",async e=>{e.preventDefault();const me=me80();if(!activeDM80)return alert("Selecciona contacto.");const input=document.getElementById("dmText");const text=(input?.value||"").trim();if(!text)return;await push(ref(db,"privateMessages/"+thread80(me.gamertag,activeDM80)),{from:me.gamertag||"Jugador",to:activeDM80,text,time:new Date().toLocaleString(),createdAt:new Date().toISOString()});input.value=""})
document.getElementById("studioForm")?.addEventListener("submit",async e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target).entries());const bf=e.target.querySelector('[name="bannerFile"]')?.files?.[0],af=e.target.querySelector('[name="avatarFile"]')?.files?.[0];if(bf)d.banner=await file80(bf);if(af)d.avatar=await file80(af);d.live=!!e.target.querySelector('[name="live"]')?.checked;d.updatedAt=new Date().toISOString();await push(ref(db,"streamerStudio"),d);await push(ref(db,"notifications"),{title:"Streamer Studio",body:`${d.name} actualizó su perfil streamer.`,createdAt:new Date().toISOString()});e.target.reset();alert("Studio guardado.")})
function renderStudio80(){const box=document.getElementById("studioList");if(!box)return;const list=arr(studioData80).reverse();box.innerHTML=list.length?list.map(s=>`<div class="studioCard searchable"><div class="studioBanner" ${s.banner?`style="background-image:url('${s.banner}')"`:""}></div><div class="studioBody">${s.avatar?`<img class="studioAvatar" src="${s.avatar}">`:""}<h3>${s.name}</h3>${s.live?`<span class="liveNowPill">🔴 EN VIVO</span>`:""} <span class="verifiedPill">🎥 Streamer</span><p>${s.bio||""}</p>${s.twitch?`<a href="${s.twitch}" target="_blank">Twitch</a> `:""}${s.youtube?`<a href="${s.youtube}" target="_blank">YouTube</a> `:""}${s.tiktok?`<a href="${s.tiktok}" target="_blank">TikTok</a> `:""}${s.instagram?`<a href="${s.instagram}" target="_blank">Instagram</a>`:""}</div></div>`).join(""):"<p>No hay perfiles Studio.</p>"}
document.getElementById("verifyForm")?.addEventListener("submit",async e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.target).entries());v.status="pending";v.createdAt=new Date().toISOString();await push(ref(db,"verifyRequests"),v);await push(ref(db,"notifications"),{title:"Solicitud de verificación",body:`${v.name} solicitó ${v.type}.`,createdAt:new Date().toISOString()});e.target.reset();alert("Solicitud enviada.")})
function renderVerify80(){const box=document.getElementById("verifyRequests");if(!box)return;box.innerHTML=arr(verifyData80).reverse().slice(0,20).map(v=>`<div class="rewardCard"><b>${v.name}</b><p>${v.type}<br>${v.status}</p></div>`).join("")||"<p>Sin solicitudes.</p>"}
const passRewards80=[["Nivel 1","100 Coins","level",1],["Nivel 5","Marco Bronce","level",5],["Nivel 10","Medalla Social","level",10],["Nivel 15","Perfil destacado","level",15],["Nivel 20","VIP 7 días","level",20],["100 Corazones","Badge Popular","hearts",100],["5 Amigos","Badge Squad","friends",5],["3 Publicaciones","Badge Activo","posts",3]];
function renderPass80(){const box=document.getElementById("battlePassList");if(!box)return;const me=me80();const hearts=Number(me.hearts)||0,friends=arr(friendsData64||{}).filter(f=>f.status==="accepted"&&(f.fromName===me.gamertag||f.toName===me.gamertag)).length,posts=arr(socialPosts70||{}).filter(p=>p.author===me.gamertag).length,level=Number(me.level)||1;box.innerHTML=passRewards80.map(r=>{const val=r[2]==="level"?level:r[2]==="hearts"?hearts:r[2]==="friends"?friends:posts;const ok=val>=r[3];return `<div class="passReward ${ok?"unlocked":""}"><b>${r[0]}</b><p>${r[1]}</p><small>${ok?"✅ Desbloqueado":"🔒 Bloqueado"}</small></div>`}).join("")}
document.querySelectorAll('[data-tab="privateChat"],[data-tab="streamerStudio"],[data-tab="verified"],[data-tab="battlePass"]').forEach(b=>b.addEventListener("click",()=>setTimeout(()=>{renderDM80();renderStudio80();renderVerify80();renderPass80()},150)))
setTimeout(()=>{renderDM80();renderStudio80();renderVerify80();renderPass80()},1200);
