// ======================================
// CAREER AI - DATA ENGINE v0.1
// ======================================

console.log("⚽ Career AI cargando sistema de datos...");

let selectedGame = null;
let selectedLeague = null;
let selectedClub = null;

// Botón Nueva Carrera
document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("newCareer");

    if (btn) {
        btn.addEventListener("click", openGameSelect);
    }

});

// ======================================
// 1. SELECCIONAR JUEGO
// ======================================

function openGameSelect() {

    createModal(`
        <h2>⚽ Nueva Carrera</h2>
        <p>Selecciona tu juego</p>

        <button onclick="selectGame('FC25')">FC 25</button>
        <button onclick="selectGame('FC26')">FC 26</button>

        <br><br>
        <button onclick="closeModal()">Cerrar</button>
    `);

}

function selectGame(game) {

    selectedGame = game;
    console.log("Juego seleccionado:", game);

    closeModal();
    loadLeagues();

}

// ======================================
// 2. CARGAR LIGAS DESDE JSON
// ======================================

async function loadLeagues() {

    const res = await fetch("./data/leagues.json");
    const leagues = await res.json();

    let html = `<h2>🌍 Selecciona una Liga</h2>`;

    leagues.forEach(l => {
        html += `<button onclick="selectLeague('${l.name}')">${l.name}</button><br>`;
    });

    createModal(html);

}

function selectLeague(league) {

    selectedLeague = league;
    console.log("Liga:", league);

    closeModal();
    loadClubs();

}

// ======================================
// 3. CARGAR CLUBS DESDE JSON
// ======================================

async function loadClubs() {

    const res = await fetch("./data/clubs.json");
    const clubs = await res.json();

    let html = `<h2>🛡️ Selecciona un Club</h2>`;

    clubs
    .filter(c => c.league === selectedLeague)
    .forEach(c => {
        html += `<button onclick="selectClub('${c.name}')">${c.name}</button><br>`;
    });

    createModal(html);

}

function selectClub(club) {

    selectedClub = club;

    console.log("Club:", club);

    closeModal();

    startCareer();

}

// ======================================
// 4. INICIAR CARRERA
// ======================================

function startCareer() {

    createModal(`
        <h2>👔 Carrera Iniciada</h2>

        <p>Juego: ${selectedGame}</p>
        <p>Liga: ${selectedLeague}</p>
        <p>Club: ${selectedClub}</p>

        <br>
        <button onclick="closeModal()">Continuar</button>
    `);

}

// ======================================
// MODAL SYSTEM
// ======================================

function createModal(content) {

    closeModal();

    const div = document.createElement("div");

    div.id = "modal";

    div.innerHTML = `
        <div class="modal-box">
            ${content}
        </div>
    `;

    document.body.appendChild(div);

}

function closeModal() {

    const m = document.getElementById("modal");

    if (m) m.remove();

}
