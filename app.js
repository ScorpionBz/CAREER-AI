let Career = {};


const select = document.getElementById("clubSelect");



Object.keys(FC26_DATABASE).forEach(club => {


    let option = document.createElement("option");


    option.value = club;
    option.textContent = club;


    select.appendChild(option);


});





function startCareer(){


    let club = select.value;


    let data = FC26_DATABASE[club];



    if(!data){


        alert("Este club todavía no está disponible");

        return;

    }



    Career = {


        club: club,


        league: getLeagueByClub(club),


        president: data.president || "Presidente del club",


        budget: data.budget,


        stadium: data.stadium,


        captain: data.captain,


        players: data.players,


        objective: data.objective || "Ganar títulos",


        trust: 75,


        matchday: 1,


        points: 0,


        wins: 0,


        draws: 0,


        losses: 0



    };



    saveCareer();


    showCareer();



}






function showCareer(){



    document.getElementById("setup")
    .style.display="none";



    document.getElementById("career")
    .classList.remove("hidden");





    document.getElementById("clubName")
    .textContent = Career.club;





    if(document.getElementById("league")){

        document.getElementById("league")
        .textContent = Career.league;

    }






    document.getElementById("president")
    .textContent = Career.president;





    document.getElementById("budget")
    .textContent =
    "€" + Career.budget.toLocaleString();





    document.getElementById("trust")
    .textContent =
    Career.trust + "/100";





    if(document.getElementById("objective")){

        document.getElementById("objective")
        .textContent = Career.objective;

    }





    if(document.getElementById("points")){

        document.getElementById("points")
        .textContent =
        Career.points + " pts";

    }





    if(document.getElementById("season")){

        document.getElementById("season")
        .textContent =
        "Jornada " + Career.matchday;

    }



}







function saveCareer(){


    localStorage.setItem(
        "careerAI",
        JSON.stringify(Career)
    );


}








function continueCareer(){



    let saved =
    localStorage.getItem("careerAI");




    if(saved){


        Career = JSON.parse(saved);


        showCareer();



    }else{


        alert(
        "No existe una carrera guardada"
        );


    }



}







function deleteCareer(){


    localStorage.removeItem("careerAI");


    alert("Carrera eliminada");


    location.reload();


}







window.startCareer = startCareer;

window.continueCareer = continueCareer;

window.saveCareer = saveCareer;

window.deleteCareer = deleteCareer;
