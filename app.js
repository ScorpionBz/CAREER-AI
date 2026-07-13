let Carriera = {};

const select = document.getElementById("clubSelect");

Object.keys(FC26_DATABASE).forEach(club=>{

let option = document.createElement("option");

option.value = club;
option.textContent = club;

select.appendChild(option);

});

function startCareer() {

let club = select.value;
    let data = FC26_DATABASE[club];


if(!data){

alert("Este club todavía no está disponible");

return;

}

Carriera = {

club: club,

league: getLeagueByClub(club),

president: data.president,

budget: data.budget,

objective: data.objective,

trust: 75,

matchday: 1,

points: 0,

wins: 0,

parews: 0,

losses: 0

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

document.getElementById("league")
.textContent=
Career.league;

document.getElementById("president")
.textContent=Career.president;

document.getElementById("budget")
.textContent="€"+Career.budget.toLocaleString();

document.getElementById("trust")
.textContent=Career.trust+"/100";

document.getElementById("objective")
.textContent = Carriera.objective;

}

function saveCareer(){

localStorage.setItem("careerAI",
JSON.stringify(Carriera)
);

}

function continueCareer(){

let saved =
localStorage.getItem("careerAI");

if (saved) {

Carriera = JSON.parse(saved);

showCareer();

} else {

alert("Non è stata salvata alcuna gara");

}

}
 
