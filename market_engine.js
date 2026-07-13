[]/* =====================================
   CAREER AI 3.4
   MARKET ENGINE
===================================== */


// Crear valor de mercado del jugador

function calculateMarketValue(player){

let value =
(player.overall * player.overall) *
10000;


// Potencial aumenta valor

if(player.potential > player.overall){

value += 
(player.potential-player.overall)
*500000;

}


// Jugadores jóvenes valen más

if(player.age < 23){

value += 10000000;

}


return Math.floor(value);

}





// Crear oferta de otro club

function generateTransferOffer(player){


let value =
calculateMarketValue(player);


let clubs=[

"Manchester City",

"Real Madrid",

"PSG",

"FC Barcelona",

"Liverpool",

"Bayern Munich"

];


let buyer =
clubs[Math.floor(Math.random()*clubs.length)];



let offer = {

club:buyer,

player:player.name,

amount:
Math.floor(
value*(0.8+Math.random()*0.5)
)

};



return offer;

}





// Respuesta del entrenador

function respondToOffer(player,offer,decision){


switch(decision){


case "accept":


return {

message:
`Has vendido a ${player.name} por €${offer.amount.toLocaleString()}`,

effect:
"Presupuesto aumentado"

};



case "reject":


return {

message:
`Rechazaste la oferta por ${player.name}`,

effect:
"Jugador puede estar satisfecho o molesto"

};



case "negotiate":


offer.amount *=1.2;


return {

message:
`Nueva oferta: €${Math.floor(offer.amount).toLocaleString()}`,

effect:
"Negociación abierta"

};


}



}





// Renovaciones

function renewContract(player){


if(player.morale>70){


player.contractYears +=3;


return {

message:
`${player.name} renovó su contrato.`,

effect:
"Vestuario positivo"

};


}



return {

message:
`${player.name} rechazó renovar por ahora.`,

effect:
"Buscará otras opciones"

};


}





// Jugador con contrato próximo a terminar

function checkContracts(players){


let alerts=[];


players.forEach(player=>{


if(player.contractYears<=1){


alerts.push(
`${player.name} termina contrato pronto.`
);


}


});


return alerts;

}
