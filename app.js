let Career={};



const clubSelect=
document.getElementById("clubSelect");



Object.keys(CLUBS).forEach(club=>{

let option=document.createElement("option");

option.value=club;

option.textContent=club;

clubSelect.appendChild(option);

});





function startCareer(){


let club=
clubSelect.value;


let data=
CLUBS[club];


Career={

club:club,

budget:data.budget,

president:data.president,

trust:75,

events:[]

};



saveCareer();


showCareer();


}





function showCareer(){


document.getElementById("setup")
.classList.add("hidden");


document.getElementById("career")
.classList.remove("hidden");



document.getElementById("clubName")
.textContent=
Career.club;



document.getElementById("president")
.textContent=
Career.president;



document.getElementById("budget")
.textContent=
"€"+Career.budget.toLocaleString();



document.getElementById("trust")
.textContent=
Career.trust+"/100";


}




function generateEvent(){


let events=[


"El delantero estrella está molesto por sus minutos.",

"La directiva quiere un fichaje importante.",

"La prensa critica tus últimos resultados.",

"Un joven de cantera pide una oportunidad.",

"Un club rival pregunta por tu capitán."

];



let text=
events[Math.floor(Math.random()*events.length)];



let box=
document.getElementById("events");


let div=
document.createElement("div");


div.className="event";

div.textContent=text;


box.prepend(div);



}
