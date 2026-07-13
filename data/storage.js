function saveCareer(){

localStorage.setItem(
"careerAI",
JSON.stringify(Career)
);

}



function loadCareer(){

let data=
localStorage.getItem("careerAI");


if(data){

return JSON.parse(data);

}


return null;

}
