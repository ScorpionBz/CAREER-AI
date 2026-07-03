/*====================================
    CAREER AI 2.0 - CORE SYSTEM
====================================*/

/*==============================
    BASE DE CLUBS
==============================*/

const CLUB_DATABASE = {
"Real Madrid": {
budget: 180000000,
pressure: "high",
president: "Florentino Pérez",
style: "galactico"
},

"FC Barcelona": {
budget: 120000000,
pressure: "high",
president: "Joan Laporta",
style: "academy"
},

"Manchester City": {
budget: 200000000,
pressure: "medium",
president: "Sheikh Mansour",
style: "winning"
},

"Manchester United": {
budget: 150000000,
pressure: "high",
president: "INEOS Board",
style: "rebuild"
},

"PSG": {
budget: 170000000,
pressure: "high",
president: "Nasser Al-Khelaifi",
style: "stars"
},

"Bayern Munich": {
budget: 140000000,
pressure: "medium",
president: "Herbert Hainer",
style: "stable"
},

"Juventus": {
budget: 90000000,
pressure: "medium",
president: "Board",
style: "rebuild"
}
};

/*==============================
    OBTENER CLUB
==============================*/

function getClubData(team){

return CLUB_DATABASE[team] || {
budget: 50000000,
pressure: "medium",
president: "Directiva",
style: "normal"
};

}

/*==============================
    CARGAR EQUIPO
==============================*/

let savedTeam = localStorage.getItem("career-team");

if(!savedTeam){
savedTeam = "Real Madrid";
}

let clubData = getClubData(savedTeam);

/*==============================
    ESTADO DEL JUEGO
==============================*/

let CareerAI = {
team: savedTeam,
budget: clubData.budget,
president: clubData.president,
pressure: clubData.pressure,
morale: 75,
fans: 80,
boardTrust: 70
};

/*==============================
    OBJETIVO DINÁMICO
==============================*/

function getObjective(){

if(CareerAI.budget > 150000000){
return "Ganar la liga o Champions";
}

if(CareerAI.budget > 90000000){
return "Clasificar a Champions";
}

return "Evitar descenso y construir proyecto";
}

/*==============================
    MENSAJE DEL PRESIDENTE
==============================*/

function getPresidentMessage(){

let club = getClubData(CareerAI.team);

return `${club.president}:

Tu objetivo es: ${getObjective()}

Presupuesto actual: €${CareerAI.budget}

Confío en ti, pero necesito resultados.`;

}

/*==============================
    REACCIÓN DEL PRESIDENTE
==============================*/

function presidentReaction(result){

if(result === "win"){

CareerAI.boardTrust += 5;
CareerAI.fans += 4;
CareerAI.budget += 2000000;

return "El presidente está satisfecho con la victoria.";

}

if(result === "draw"){

CareerAI.boardTrust -= 2;
CareerAI.fans -= 1;

return "El presidente esperaba más.";

}

if(result === "loss"){

CareerAI.boardTrust -= 10;
CareerAI.fans -= 8;
CareerAI.budget -= 3000000;

return "El presidente está muy molesto contigo.";

}

}

/*==============================
    GUARDADO
==============================*/

function saveGame(){

localStorage.setItem("career-ai-data", JSON.stringify(CareerAI));

}

/*==============================
    CARGAR JUEGO
==============================*/

function loadGame(){

let data = localStorage.getItem("career-ai-data");

if(data){
CareerAI = JSON.parse(data);
}

}

/*==============================
    INICIALIZAR
==============================*/

window.onload = () => {

loadGame();
saveGame();

console.log("Career AI iniciado:", CareerAI);

};

/*==============================
    SIMULACIÓN BÁSICA (TEST)
==============================*/

function testWin(){
console.log(presidentReaction("win"));
saveGame();
}

function testDraw(){
console.log(presidentReaction("draw"));
saveGame();
}

function testLoss(){
console.log(presidentReaction("loss"));
saveGame();
}
/*====================================
    PARTIDOS IA - CAREER AI
====================================*/

const MATCH_FIXTURES = [
"Real Madrid vs Barcelona",
"Manchester City vs Liverpool",
"PSG vs Bayern Munich",
"Juventus vs AC Milan",
"Arsenal vs Chelsea",
"Inter Miami vs LA Galaxy"
];

let currentMatch = null;

/*==============================
    GENERAR PARTIDO
==============================*/

function generateMatch(){

currentMatch = MATCH_FIXTURES[
Math.floor(Math.random() * MATCH_FIXTURES.length)
];

return currentMatch;

}

/*==============================
    PROBABILIDAD DE VICTORIA
==============================*/

function calculateWinChance(){

let base = 50;

// presupuesto influye
if(CareerAI.budget > 150000000){
base += 15;
}
if(CareerAI.budget < 80000000){
base -= 15;
}

// moral influye
base += (CareerAI.morale - 50) / 5;

// confianza directiva
base += (CareerAI.boardTrust - 50) / 10;

if(base > 85) base = 85;
if(base < 10) base = 10;

return base;

}

/*==============================
    SIMULAR PARTIDO
==============================*/

function playMatch(){

let winChance = calculateWinChance();

let random = Math.random() * 100;

let result;

if(random < winChance){
result = "win";
} else if(random < winChance + 20){
result = "draw";
} else {
result = "loss";
}

// reacción del presidente
let reaction = presidentReaction(result);

// actualizar moral
if(result === "win") CareerAI.morale += 5;
if(result === "loss") CareerAI.morale -= 7;

// guardar
saveGame();

return {
match: currentMatch,
result: result,
reaction: reaction,
winChance: winChance.toFixed(1)
};

}

/*==============================
    NEXT MATCH SYSTEM
==============================*/

function nextMatch(){

let match = generateMatch();

console.log("📅 Próximo partido:", match);

return match;

}
