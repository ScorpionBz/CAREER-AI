function getRival(){

let league = LEAGUES[Career.league];


let rivals = league.filter(
team => team !== Career.club
);


return rivals[
Math.floor(Math.random()*rivals.length)
];

}




function getTeamStrength(team){


let data = FC26_DATABASE[team];


if(!data || !data.players){

return 75;

}


let total=0;


data.players.forEach(player=>{

total += player.overall;

});


return Math.round(
total / data.players.length
);


}





function playMatch(){


let rival = getRival();


let myStrength =
getTeamStrength(Career.club);


let rivalStrength =
getTeamStrength(rival);



let difference =
myStrength-rivalStrength;


let result =
Math.random()*100 + difference;



let text="";



if(result > 55){


text=
"🏆 Victoria contra "+rival;


Career.points+=3;

Career.wins++;

Career.trust+=5;


}


else if(result > 35){


text=
"🤝 Empate contra "+rival;


Career.points+=1;

Career.draws++;


}


else{


text=
"❌ Derrota contra "+rival;


Career.losses++;

Career.trust-=5;


}




Career.matchday++;


saveCareer();



document.getElementById("match")
.textContent=text;



document.getElementById("points")
.textContent=
Career.points+" pts";



document.getElementById("trust")
.textContent=
Career.trust+"/100";



generateNews(text);



}






function generateNews(match){


let container=
document.getElementById("events");



let div=document.createElement("div");


div.className="event";


div.textContent=
"📰 "+match;



container.prepend(div);


}
