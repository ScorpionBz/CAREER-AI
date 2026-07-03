/*====================================
    CAREER AI 2.0
    APP.JS
====================================*/

const CareerAI = {

    version: "2.0 Beta",

    presidentTrust: 86,

    lockerRoom: 74,

    fans: 91,

    budget: 85000000,

    objective: "Clasificar a Champions League",

    nextMatch: "Real Madrid vs Barcelona",

    morale: "Alta"

};

/*====================================
    MENSAJES DEL PRESIDENTE
====================================*/

const presidentMessages = [

"Buenos días entrenador. Confío plenamente en tu trabajo.",

"Necesitamos terminar entre los cuatro primeros.",

"La afición espera mejores resultados.",

"Tenemos presupuesto para un gran fichaje.",

"Evita conflictos dentro del vestuario.",

"No vendas a nuestras estrellas.",

"Los patrocinadores están muy satisfechos.",

"Hay rumores sobre tu futuro."

];

/*====================================
    NOTICIAS
====================================*/

const news = [

"La afición está muy ilusionada con el proyecto.",

"Tu delantero ha despertado interés en Inglaterra.",

"Un juvenil destaca en los entrenamientos.",

"El presidente prepara nuevas inversiones.",

"Los aficionados llenarán el estadio.",

"Se acerca el mercado de fichajes.",

"Un jugador solicita una mejora salarial.",

"La prensa elogia tu estilo de juego.",

"Varios clubes preguntan por tu capitán."

];

/*====================================
    CARGAR MENSAJE
====================================*/

function loadPresidentMessage(){

const message = presidentMessages[
Math.floor(Math.random()*presidentMessages.length)
];

document.getElementById("presidentMessage").textContent = message;

}

/*====================================
    CARGAR NOTICIAS
====================================*/

function loadNews(){

const list = document.getElementById("newsList");

list.innerHTML="";

let randomNews=[...news]
.sort(()=>0.5-Math.random())
.slice(0,3);

randomNews.forEach(item=>{

const li=document.createElement("li");

li.innerHTML="📰 "+item;

list.appendChild(li);

});

}

/*====================================
    ACTUALIZAR ESTADOS
====================================*/

function updateStatus(){

document.getElementById("presidentTrust").textContent =
CareerAI.presidentTrust+"%";

document.getElementById("lockerRoom").textContent =
CareerAI.lockerRoom+"%";

document.getElementById("fansTrust").textContent =
CareerAI.fans+"%";

}

/*====================================
    BOTÓN PRESIDENTE
====================================*/

document
.getElementById("openPresident")
.addEventListener("click",()=>{

loadPresidentMessage();

alert(
"📞 El presidente quiere hablar contigo.\n\nRevisa sus nuevas instrucciones."
);

});

/*====================================
    GUARDADO
====================================*/

function saveCareer(){

localStorage.setItem(

"career-ai",

JSON.stringify(CareerAI)

);

}

/*====================================
    CARGAR
====================================*/

function loadCareer(){

const data=

localStorage.getItem("career-ai");

if(!data) return;

Object.assign(

CareerAI,

JSON.parse(data)

);

}

/*====================================
    INICIO
====================================*/

window.onload=()=>{

loadCareer();

updateStatus();

loadPresidentMessage();

loadNews();

saveCareer();

console.log(

"Career AI "+CareerAI.version+" iniciado."

);

};

/*====================================
    ACTUALIZAR CADA 30 SEGUNDOS
====================================*/

setInterval(()=>{

loadNews();

loadPresidentMessage();

},30000);
//====================================
// SELECCIÓN DE EQUIPO
//====================================

function initTeamSelect(){

const screen = document.getElementById("teamSelectScreen");

const savedTeam = localStorage.getItem("career-team");

if(savedTeam){

screen.style.display = "none";

CareerAI.team = savedTeam;

return;

}

document.querySelectorAll(".team-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

const team = btn.dataset.team;

CareerAI.team = team;

localStorage.setItem("career-team",team);

screen.style.display = "none";

alert("Has elegido: " + team);

});

});

}

initTeamSelect();
