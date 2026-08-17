const $ = selector =>
  document.querySelector(selector);


const $$ = selector =>
  [...document.querySelectorAll(selector)];


/* =========================
   EJEMPLO
========================= */

const example = `Escena 1 — Ciudad de Tokio, de noche.

La lluvia cae sobre los edificios.

Kaelen camina solo por una calle
iluminada por neones.

LYRA: No debiste venir aquí.

Kaelen se detiene y mira hacia atrás.

Lyra aparece bajo un paraguas negro.

KAELEN: Lo sé... pero tenía que encontrarte.


Escena 2 — Azotea.

Kaelen y Lyra observan la ciudad
desde una enorme azotea.

Una criatura aparece entre los edificios.

KAELEN: ¿Qué demonios es eso?

LYRA: Es la razón por la que regresé.


Escena 3 — La batalla.

La criatura ruge.

Kaelen desenvaina su espada.

Lyra prepara un hechizo.

LYRA: ¡Kaelen, ahora!

KAELEN: ¡Vamos!`;


/* =========================
   PROYECTO
========================= */

let project =
  JSON.parse(
    localStorage.getItem(
      "animeAIProject"
    )
  ) ||
  {

    name:"Mi Anime",

    script:"",

    format:"anime",

    style:
      "Anime cinematográfico",

    language:"Español",

    duration:8,

    scenes:[],

    characters:[]

  };


function save(){

  localStorage.setItem(

    "animeAIProject",

    JSON.stringify(project)

  );

}


/* =========================
   ANALIZAR GUION
========================= */

function parseScript(text){

  const lines =
    text
      .split(/\n+/)
      .map(x => x.trim())
      .filter(Boolean);


  const sceneLines =
    lines.filter(
      x =>
        /^escena\s*\d+/i.test(x)
    );


  const scenes=[];


  if(sceneLines.length){

    sceneLines.forEach(
      (line,index)=>{

        const start =
          lines.indexOf(line);


        const end =
          index + 1 <
          sceneLines.length

            ? lines.indexOf(
                sceneLines[index+1]
              )

            : lines.length;


        const body =
          lines
            .slice(
              start + 1,
              end
            )
            .join(" ");


        scenes.push({

          title:
            line.replace(
              /^escena\s*\d+\s*[—:-]?\s*/i,
              ""
            ) ||
            `Escena ${index+1}`,

          body

        });

      }
    );

  }


  else{

    const chunks =
      text
        .split(
          /(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/
        )
        .filter(Boolean);


    for(
      let i=0;
      i<chunks.length;
      i+=3
    ){

      scenes.push({

        title:
          `Escena ${i/3+1}`,

        body:
          chunks
            .slice(i,i+3)
            .join(" ")

      });

    }

  }


  /* PERSONAJES */

  const characters =
    new Set();


  const regex =
    /^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 _-]{1,30}):/gm;


  let match;


  while(
    (match =
      regex.exec(text))
  ){

    characters.add(
      match[1].trim()
    );

  }


  /*
    También detectamos
    algunos nombres comunes
  */

  const commonNames =
    [
      "Kaelen",
      "Lyra",
      "Akira",
      "Yuki",
      "Kenji",
      "Sora",
      "Mika"
    ];


  commonNames.forEach(name=>{

    if(
      new RegExp(
        `\\b${name}\\b`,
        "i"
      ).test(text)
    ){

      characters.add(name);

    }

  });


  return{

    scenes,

    characters:
      [...characters]

  };

}


/* =========================
   HTML SEGURO
========================= */

function escapeHtml(text){

  return String(text)
    .replace(
      /[&<>"']/g,
      character =>
        ({
          "&":"&amp;",
          "<":"&lt;",
          ">":"&gt;",
          '"':"&quot;",
          "'":"&#039;"
        })[character]
    );

}


/* =========================
   RENDER
========================= */

function render(){

  $("#projectName").value =
    project.name;


  $("#projectNameSide").textContent =
    project.name;


  $("#script").value =
    project.script;


  $("#format").value =
    project.format;


  $("#style").value =
    project.style;


  $("#language").value =
    project.language;


  $("#duration").value =
    project.duration;


  $("#charCount").textContent =
    `${project.script.length} caracteres`;


  $("#status").textContent =

    project.scenes.length

      ? `${project.scenes.length} escenas detectadas`

      : "Esperando guion";


  $("#exportTitle").textContent =
    project.name;


  $("#exportSummary").textContent =

    project.scenes.length

      ?
        `${project.scenes.length} escenas · ${project.characters.length} personajes · ${project.format}`

      :
        "Analiza un guion primero.";


  /* RESULTADO */

  $("#result").innerHTML =

    project.scenes.length

      ?

        `<div class="cards">

          ${project.scenes
            .map(
              (scene,index)=>`

              <div class="character">

                <span class="badge">
                  ESCENA ${index+1}
                </span>

                <h3>
                  ${escapeHtml(
                    scene.title
                  )}
                </h3>

                <p class="muted">

                  ${escapeHtml(
                    scene.body
                      .slice(0,180)
                  )}

                  ${
                    scene.body.length>180
                      ? "…"
                      : ""
                  }

                </p>

              </div>

            `
            )
            .join("")}

        </div>`

      :

        "Escribe un guion y pulsa <b>Analizar guion</b>.";


  /* PERSONAJES */

  $("#charactersList").innerHTML =

    project.characters.length

      ?

        project.characters
          .map(
            (character,index)=>`

              <div class="card character">

                <div class="avatar">
                  👤
                </div>

                <h3>
                  ${escapeHtml(
                    character
                  )}
                </h3>

                <p class="muted">

                  Voz ${index+1}
                  ·
                  ${project.language}

                </p>

                <span class="badge">

                  ${project.style}

                </span>

              </div>

            `
          )
          .join("")

      :

        `<div class="card">

          <p class="muted">

            Aún no hay personajes
            detectados.

          </p>

        </div>`;


  /* ESCENAS */

  $("#scenesList").innerHTML =

    project.scenes.length

      ?

        project.scenes
          .map(
            (scene,index)=>`

              <div class="card scene">

                <div class="scene-num">
                  ${index+1}
                </div>

                <div>

                  <h3>
                    ${escapeHtml(
                      scene.title
                    )}
                  </h3>

                  <p>
                    ${escapeHtml(
                      scene.body
                    )}
                  </p>

                  <span class="badge">

                    ${project.duration}s
                    ·
                    ${project.format}

                  </span>

                </div>

              </div>

            `
          )
          .join("")

      :

        `<div class="card">

          <p class="muted">
            Aún no hay escenas.
          </p>

        </div>`;


  /* VOCES */

  $("#voicesList").innerHTML =

    project.characters.length

      ?

        project.characters
          .map(
            character=>`

              <div class="card">

                <h3>
                  🎙️
                  ${escapeHtml(
                    character
                  )}
                </h3>

                <label>

                  Tipo de voz

                  <select>

                    <option>
                      Joven / protagonista
                    </option>

                    <option>
                      Joven / femenina
                    </option>

                    <option>
                      Adulto
                    </option>

                    <option>
                      Villano
                    </option>

                    <option>
                      Robótica
                    </option>

                  </select>

                </label>


                <button
                  class="secondary voiceBtn"
                  data-name="${escapeHtml(character)}"
                >

                  ▶ Vista previa

                </button>

              </div>

            `
          )
          .join("")

      :

        `<div class="card">

          <p class="muted">

            Analiza un guion para
            configurar voces.

          </p>

        </div>`;

}


/* =========================
   INPUT GUION
========================= */

$("#script")
.addEventListener(
  "input",
  event=>{

    project.script =
      event.target.value;

    $("#charCount").textContent =
      `${project.script.length} caracteres`;

    save();

  }
);


/* =========================
   NOMBRE
========================= */

$("#projectName")
.addEventListener(
  "input",
  event=>{

    project.name =
      event.target.value ||
      "Mi Anime";

    $("#projectNameSide")
      .textContent =
      project.name;

    save();

  }
);


/* =========================
   CONFIGURACIÓN
========================= */

[
  "format",
  "style",
  "language",
  "duration"

].forEach(id=>{

  $(`#${id}`)
    .addEventListener(
      "change",
      event=>{

        project[id] =
          event.target.value;

        save();

      }
    );

});


/* =========================
   EJEMPLO
========================= */

$("#demoScript")
.onclick=()=>{

  $("#script").value =
    example;

  project.script =
    example;

  $("#charCount")
    .textContent =
    `${example.length} caracteres`;

  save();

};


/* =========================
   GENERAR
========================= */

$("#generate")
.onclick=()=>{

  if(
    !project.script.trim()
  ){

    alert(
      "Escribe un guion primero."
    );

    return;

  }


  const result =
    parseScript(
      project.script
    );


  project.scenes =
    result.scenes;


  project.characters =
    result.characters;


  save();


  render();


  alert(

    `¡Listo!

    Escenas:
    ${result.scenes.length}

    Personajes:
    ${result.characters.length}`

  );

};


/* =========================
   NAVEGACIÓN
========================= */

$$(".nav")
.forEach(button=>{

  button.onclick=()=>{

    $$(".nav")
      .forEach(
        item =>
          item.classList
            .remove("active")
      );


    button.classList
      .add("active");


    $$(".view")
      .forEach(
        view =>
          view.classList
            .add("hidden")
      );


    $(
      `#${button.dataset.view}View`
    )
      .classList
      .remove("hidden");

  };

});


/* =========================
   NUEVO PROYECTO
========================= */

$("#newProject")
.onclick=()=>{

  if(
    confirm(
      "¿Crear un proyecto nuevo?"
    )
  ){

    project={

      name:"Mi Anime",

      script:"",

      format:"anime",

      style:
        "Anime cinematográfico",

      language:"Español",

      duration:8,

      scenes:[],

      characters:[]

    };


    save();

    render();

  }

};


/* =========================
   DESCARGAR JSON
========================= */

$("#downloadJson")
.onclick=()=>{

  const blob =
    new Blob(
      [
        JSON.stringify(
          project,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href=url;


  link.download =
    (
      project.name ||
      "anime-project"
    )
    .replace(
      /\s+/g,
      "-"
    )
    +
    ".json";


  link.click();


  URL.revokeObjectURL(
    url
  );

};


/* =========================
   COPIAR PROMPT
========================= */

$("#copyPrompt")
.onclick=async()=>{

  const prompt =

`PRODUCCIÓN DE ANIME

Título:
${project.name}

Estilo:
${project.style}

Idioma:
${project.language}

Formato:
${project.format}


PERSONAJES:

${project.characters.join(", ")}


ESCENAS:

${project.scenes
  .map(
    (scene,index)=>
`
ESCENA ${index+1}

Título:
${scene.title}

Descripción:
${scene.body}
`
  )
  .join("\n")}`;


  await navigator
    .clipboard
    .writeText(
      prompt
    );


  alert(
    "Prompt copiado."
  );

};


/* =========================
   VOCES
========================= */

document.addEventListener(
  "click",
  event=>{

    if(
      event.target
        .classList
        .contains(
          "voiceBtn"
        )
    ){

      alert(

        `Vista previa de voz para ${event.target.dataset.name}.

La generación de voz real se conectará en la siguiente versión.`

      );

    }

  }
);


/* =========================
   INICIO
========================= */

render();
