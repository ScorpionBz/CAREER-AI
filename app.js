let Career = {};

const select = document.getElementById("clubSelect");


Object.keys(CLUBS).forEach(club => {

    let option = document.createElement("option");

    option.value = club;
    option.textContent = club;

    select.appendChild(option);

});



function startCareer(){

    let club = select.value;

    let data = CLUBS[club];


    Career = {

        club: club,
        president: data.president,
        budget: data.budget,
        trust: 75

    };


    document.getElementById("setup").style.display="none";

    document.getElementById("career").classList.remove("hidden");


    document.getElementById("clubName").textContent =
    Career.club;


    document.getElementById("president").textContent =
    Career.president;


    document.getElementById("budget").textContent =
    "€" + Career.budget.toLocaleString();


    document.getElementById("trust").textContent =
    Career.trust + "/100";


}




function newEvent(){


    console.log("Generando evento...");


    const events = [

        "👀 El delantero estrella está molesto por no ser titular.",

        "📰 La prensa cuestiona tu última decisión.",

        "💰 Un club ofrece dinero por una de tus figuras.",

        "🌟 Un juvenil pide minutos en el primer equipo.",

        "👔 El presidente quiere hablar contigo."

    ];



    const randomEvent =
    events[Math.floor(Math.random()*events.length)];



    const container =
    document.getElementById("events");



    if(!container){

        alert("No existe el panel de eventos");

        return;

    }



    const div=document.createElement("div");


    div.className="event";


    div.textContent=randomEvent;



    container.prepend(div);


}



window.startCareer=startCareer;

window.newEvent=newEvent;
