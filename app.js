// ========================================
// CAREER AI v0.1
// Sistema Principal
// ========================================

console.log("Career AI iniciado");

// Esperar a que cargue toda la página
document.addEventListener("DOMContentLoaded", () => {

    const newCareerBtn = document.getElementById("newCareer");

    if(newCareerBtn){

        newCareerBtn.addEventListener("click", abrirNuevaCarrera);

    }

});

// ================================
// NUEVA CARRERA
// ================================

function abrirNuevaCarrera(){

    const modal = document.createElement("div");

    modal.id = "careerModal";

    modal.innerHTML = `

    <div class="career-box">

        <h2>⚽ NUEVA CARRERA</h2>

        <p>Selecciona tu juego</p>

        <div class="games-select">

            <button class="game-btn" data-game="FC25">
                EA SPORTS FC 25
            </button>

            <button class="game-btn" data-game="FC26">
                EA SPORTS FC 26
            </button>

        </div>

        <button id="closeModal">
            Cancelar
        </button>

    </div>

    `;

    document.body.appendChild(modal);

    document.querySelectorAll(".game-btn").forEach(btn=>{

        btn.addEventListener("click",()=>{

            const game = btn.dataset.game;

            localStorage.setItem("careerGame",game);

            alert("Has seleccionado "+game);

            cerrarModal();

            // Próximo paso
            mostrarSeleccionLiga();

        });

    });

    document.getElementById("closeModal").onclick=cerrarModal;

}

function cerrarModal(){

    const modal=document.getElementById("careerModal");

    if(modal){

        modal.remove();

    }

}

// =================================
// SIGUIENTE PASO
// =================================

function mostrarSeleccionLiga(){

    alert("En la siguiente versión aparecerán todas las ligas de FC.");

}
