let Career={};



const select =
document.getElementById("clubSelect");



Object.keys(CLUBS).forEach(club=>{


let option=document.createElement("option");

option.value=club;

option.textContent=club;


select.appendChild(option);


});





function startCareer(){


let club=select.value;


let data=CLUBS[club];


Career={

club:club,

president:data.president,

budget:data.budget,

trust:75

};



document
.getElementById("setup")
.style.display="none";



document
.getElementById("career")
.classList.remove("hidden");



document
.getElementById("clubName")
.textContent=club;



document
.getElementById("president")
.textContent=
Career.president;



document
.getElementById("budget")
.textContent=
"€"+Career.budget.toLocaleString();



document
.getElementById("trust")
.textContent=
Career.trust+"/100";


}





function newEvent(){


let events=[

"👀 Un delantero estrella está molesto por sus minutos.",

"📢 La prensa pide explicaciones por una decisión táctica.",

"💰 Un club rival pregunta por un jugador importante.",

"🌟 Un joven de cantera pide una oportunidad.",

"👔 El presidente quiere una reunión contigo."

];


let text=
events[Math.floor(Math.random()*events.length)];



let div=document.createElement("div");


div.className="event";

div.textContent=text;


document
.getElementById("events")
.prepend(div);


}
