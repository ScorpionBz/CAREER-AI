let Career = {};

const select = document.getElementById("clubSelect");


Object.keys(CLUBS).forEach(club => {

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

league:getLeagueByClub(club),

president:data.president,

budget:data.budget,

objective:data.objective,

trust:75,

matchday:1,

points:0,

wins:0,

draws:0,

losses:0

};


saveCareer();

showCareer();


}




function showCareer(){


document.getElementById("setup").style.display="none";

document.getElementById("career")
.classList.remove("hidden");



document.getElementById("clubName")
.textContent=Career.club;


document.getElementById("president")
.textContent=Career.president;


document.getElementById("budget")
.textContent="€"+Career.budget.toLocaleString();


document.getElementById("trust")
.textContent=Career.trust+"/100";


document.getElementById("objective")
.textContent=Career.objective;


}



function saveCareer(){

localStorage.setItem(
"careerAI",
JSON.stringify(Career)
);

}



function continueCareer(){


let saved=
localStorage.getItem("careerAI");


if(saved){

Career=JSON.parse(saved);

showCareer();


}else{

alert("No existe una carrera guardada");

}


}




function newEvent(){


const events=[


{
text:"👀 El delantero estrella está molesto por no ser titular.",
change:-5
},


{
text:"📰 La prensa alaba tus decisiones tácticas.",
change:5
},


{
text:"💰 El club recibe una oferta importante por una estrella.",
change:0
},


{
text:"🌟 Un juvenil sorprende en los entrenamientos.",
change:3
},


{
text:"👔 El presidente duda de tus últimos resultados.",
change:-8
}


];



let event=
events[Math.floor(Math.random()*events.length)];



Career.trust+=event.change;


if(Career.trust>100)
Career.trust=100;


if(Career.trust<0)
Career.trust=0;



saveCareer();



document.getElementById("trust")
.textContent=
Career.trust+"/100";



let div=document.createElement("div");

div.className="event";

div.textContent=
event.text+
" ("+
(event.change>=0?"+":"")+
event.change+
" confianza)";


document.getElementById("events")
.prepend(div);



}



window.startCareer=startCareer;

window.continueCareer=continueCareer;

window.newEvent=newEvent;
