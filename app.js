/* =====================================
   CAREER AI 3.0 - APP CORE FIX
===================================== */
console.log("Career AI cargando...");
console.log(CLUBS);

let Career = {};


const clubSelect = document.getElementById("clubSelect");


// Cargar clubes

Object.keys(CLUBS).forEach(club => {

    let option = document.createElement("option");

    option.value = club;
    option.textContent = club;

    clubSelect.appendChild(option);

});



// Iniciar carrera

function startCareer(){


    let selectedClub = clubSelect.value;


    let data = CLUBS[selectedClub];


    Career = {

        club:selectedClub,

        league:data.league,

        budget:data.budget,

        president:data.president,

        trust:75,

        events:[]

    };


    localStorage.setItem(
        "careerAI",
        JSON.stringify(Career)
    );


    showCareer();

}



// Mostrar pantalla principal

function showCareer(){


    document
    .getElementById("setup")
    .style.display="none";


    document
    .getElementById("career")
    .classList.remove("hidden");



    document
    .getElementById("clubName")
    .textContent =
    Career.club;



    document
    .getElementById("president")
    .textContent =
    Career.president;



    document
    .getElementById("budget")
    .textContent =
    "€"+Career.budget.toLocaleString();



    document
    .getElementById("trust")
    .textContent =
    Career.trust+"/100";


}



// Eventos

function generateEvent(){


const events=[

"👀 Un jugador importante está molesto por sus minutos.",

"💰 Un club rival pregunta por una estrella.",

"📰 La prensa analiza tus últimas decisiones.",

"🌟 Un joven de cantera pide una oportunidad.",

"👔 El presidente quiere hablar contigo."

];


let event =
events[Math.floor(Math.random()*events.length)];



let div =
document.createElement("div");


div.className="event";

div.textContent=event;


document
.getElementById("events")
.prepend(div);


}
window.startCareer = startCareer;
window.generateEvent = generateEvent;
