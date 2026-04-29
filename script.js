document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración (15 misiones) ---
    const quests = [
        { goal: "UNA CANCIÓN QUE TE HAGA SONREÍR AL INSTANTE", emotion: "happy", sug: "EJ: HAPPY (PHARRELL), DYNAMITE (BTS)." },
        { goal: "UNA CANCIÓN QUE TE DÉ FUERZA CUANDO ESTÁS CANSADO", emotion: "brave", sug: "EJ: BELIEVER (IMAGINE DRAGONS)." },
        { goal: "UNA CANCIÓN QUE SEA TU REFUGIO Y TE DÉ PAZ", emotion: "calm", sug: "EJ: WEIGHTLESS, O LO-FI BEATS." },
        { goal: "UNA CANCIÓN QUE TE RECUERDE A TUS AMIGOS", emotion: "epic", sug: "EJ: COUNT ON ME (BRUNO MARS)." },
        { goal: "UNA CANCIÓN QUE TE HAGA SENTIR QUE PUEDES CON TODO", emotion: "brave", sug: "EJ: POWER (KANYE WEST)." },
        { goal: "UNA CANCIÓN QUE TE AYUDE A SOLTAR LO QUE DUELE", emotion: "calm", sug: "EJ: GHOST (JUSTIN BIEBER)." },
        { goal: "UNA CANCIÓN QUE DEFINA TU IDENTIDAD ACTUAL", emotion: "epic", sug: "EJ: MY WAY, O ESA QUE TE DEFINE." },
        { goal: "UNA CANCIÓN QUE TE HAGA QUERER BAILAR SIN PARAR", emotion: "happy", sug: "EJ: UPTOWN FUNK (BRUNO MARS)." },
        { goal: "UNA CANCIÓN QUE TE RECUERDE UN MOMENTO FELIZ", emotion: "happy", sug: "EJ: SUNFLOWER (POST MALONE)." },
        { goal: "UNA CANCIÓN QUE TE HAGA SENTIR VALIENTE", emotion: "brave", sug: "EJ: ROAR (KATY PERRY)." },
        { goal: "UNA CANCIÓN PARA SOÑAR DESPIERTO", emotion: "calm", sug: "EJ: IMAGINE (JOHN LENNON)." },
        { goal: "UNA CANCIÓN QUE TE DÉ ESPERANZA", emotion: "happy", sug: "EJ: HERE COMES THE SUN (THE BEATLES)." },
        { goal: "UNA CANCIÓN QUE TE HAGA SENTIR NOSTÁLGICO", emotion: "calm", sug: "EJ: PHOTOGRAPH (ED SHEERAN)." },
        { goal: "UNA CANCIÓN QUE TE MOTIVE A ESTUDIAR O TRABAJAR", emotion: "epic", sug: "EJ: CAN'T STOP THE FEELING (JUSTIN TIMBERLAKE)." },
        { goal: "LA CANCIÓN QUE SERÍA EL TEMA PRINCIPAL DE TU VIDA", emotion: "epic", sug: "EJ: THE NIGHTS (AVICII)." }
    ];

    const ranks = [
        { min: 0, name: "INICIADO" },
        { min: 5, name: "EXPLORADOR" },
        { min: 10, name: "MAESTRO" },
        { min: 15, name: "LEYENDA" }
    ];

    // --- Estado ---
    let playlist = [];
    function loadData() {
        try {
            const saved = localStorage.getItem('musicaQuest_playlist');
            if (saved) {
                playlist = JSON.parse(saved);
                console.log("Datos cargados:", playlist.length, "canciones.");
            }
        } catch (e) {
            console.error("Error al cargar datos:", e);
            playlist = [];
        }
    }
    loadData();

    // --- Elementos DOM ---
    const el = {
        intro: document.getElementById('intro-screen'),
        map: document.getElementById('map-screen'),
        startBtn: document.getElementById('start-btn'),
        questBtn: document.getElementById('quest-info-btn'),
        songIn: document.getElementById('song-input'),
        artistIn: document.getElementById('artist-input'),
        addBtn: document.getElementById('add-song-btn'),
        finishBtn: document.getElementById('finish-quest-btn'),
        hearts: document.getElementById('hearts-container'),
        rank: document.getElementById('rank-name'),
        path: document.getElementById('path-container'),
        char: document.getElementById('character'),
        dialog: document.getElementById('dialog-box'),
        text: document.getElementById('dialog-text'),
        mapArea: document.getElementById('adventure-map')
    };

    // --- Lógica de Diálogo ---
    let typeTimeout;
    function showDialog(text, duration = 4000) {
        clearTimeout(typeTimeout);
        if (!el.dialog || !el.text) return;
        el.dialog.classList.remove('hidden');
        el.text.innerHTML = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                el.text.innerHTML += (text.charAt(i) === '\n' ? '<br>' : text.charAt(i));
                i++;
                typeTimeout = setTimeout(typeWriter, 30);
            } else if (duration > 0) {
                typeTimeout = setTimeout(() => el.dialog.classList.add('hidden'), duration);
            }
        }
        typeWriter();
    }

    function showCurrentQuest() {
        const count = playlist.length;
        if (count < quests.length) {
            const q = quests[count];
            showDialog(`MISIÓN ${count + 1}/15:\n${q.goal}\n\nSUGERENCIA:\n${q.sug}`, 7000);
        } else {
            showDialog("¡VIAJE COMPLETADO!\n\nPULSA EL BOTÓN VERDE 'VER RESUMEN FINAL' PARA TU DIARIO.", 7000);
        }
    }

    // --- Lógica de UI ---
    function updateUI() {
        const count = playlist.length;
        
        // Rango
        if (el.rank) {
            let r = ranks[0];
            for (let i = ranks.length - 1; i >= 0; i--) {
                if (count >= ranks[i].min) { r = ranks[i]; break; }
            }
            el.rank.textContent = r.name;
        }

        // Corazones
        if (el.hearts) {
            el.hearts.innerHTML = '';
            for (let i = 0; i < Math.min(count + 3, 10); i++) {
                const h = document.createElement('span');
                h.textContent = '❤';
                el.hearts.appendChild(h);
            }
        }

        // Camino
        if (el.path) {
            el.path.innerHTML = '';
            playlist.forEach((s, idx) => {
                const n = document.createElement('div');
                n.className = 'path-node';
                n.style.left = `${(idx + 1) * 200}px`;
                const icons = { happy: '😊', brave: '⚔️', calm: '🍃', epic: '👑' };
                n.innerHTML = `<span class="icon">${icons[s.emotion] || '🎵'}</span>
                               <span style="font-size: 7px">${(s.goal || "RETO").substring(0, 15)}...</span>
                               <span style="font-weight: bold; font-size: 8px">${s.title.toUpperCase()}</span>`;
                el.path.appendChild(n);
            });
        }

        // Link
        if (el.char) {
            const pos = count > 0 ? (count * 200) + 40 : 40;
            el.char.style.left = `${pos}px`;
            if (el.mapArea) el.mapArea.scrollLeft = pos - 200;
        }

        // Botones e Inputs
        if (el.songIn) {
            const done = count >= quests.length;
            el.songIn.disabled = el.artistIn.disabled = el.addBtn.disabled = done;
            el.songIn.placeholder = done ? "¡FIN DEL VIAJE!" : "TÍTULO...";
            el.artistIn.placeholder = done ? "¡FIN!" : "ARTISTA...";
            el.finishBtn.textContent = done ? "VER RESUMEN FINAL" : "MI DIARIO (PROGRESO)";
            if (done) el.finishBtn.style.backgroundColor = "#007000";
        }
    }

    // --- Acciones ---
    function addSong() {
        if (playlist.length >= quests.length) {
            showDialog("¡EL VIAJE YA HA TERMINADO! PULSA EL BOTÓN VERDE.", 3000);
            return;
        }
        
        const title = el.songIn.value.trim();
        const artist = el.artistIn.value.trim();
        
        if (!title || !artist) { 
            showDialog("¡ALTO AHÍ! NECESITAS ESCRIBIR EL TÍTULO Y EL ARTISTA.", 3000); 
            return; 
        }

        const q = quests[playlist.length];
        playlist.push({ title, artist, emotion: q.emotion, goal: q.goal, id: Date.now() });
        localStorage.setItem('musicaQuest_playlist', JSON.stringify(playlist));
        
        el.songIn.value = el.artistIn.value = '';
        updateUI();

        const nextCount = playlist.length;
        if (nextCount < quests.length) {
            showDialog(`¡MELODÍA REGISTRADA!\n\nSIGUIENTE RETO (${nextCount + 1}/15):\n${quests[nextCount].goal}`, 6000);
        } else {
            showDialog("¡LO HAS LOGRADO! HAS ALCANZADO EL RANGO DE LEYENDA.\n\nPULSA EL BOTÓN VERDE PARA VER TU DIARIO FINAL.", 8000);
        }
    }

    function goToSummary() {
        if (playlist.length === 0) {
            showDialog("¡TU DIARIO ESTÁ VACÍO! AÑADE AL MENOS UNA CANCIÓN.", 3000);
            return;
        }
        // Guardar explícitamente antes de salir
        localStorage.setItem('musicaQuest_playlist', JSON.stringify(playlist));
        console.log("Navegando a summary.html...");
        showDialog("PREPARANDO TU DIARIO DE VIAJE...", 2000);
        setTimeout(() => {
            window.location.href = 'summary.html';
        }, 1500);
    }

    // --- Inicialización ---
    if (el.startBtn) {
        el.startBtn.addEventListener('click', () => {
            el.intro.classList.add('hidden');
            el.map.classList.remove('hidden');
            if (playlist.length === 0) {
                showDialog("¡BIENVENIDO, JOVEN AVENTURERO! TU PRIMERA MISIÓN EMPIEZA AHORA.", 3000);
                setTimeout(showCurrentQuest, 3500);
            } else { 
                showCurrentQuest(); 
            }
        });
    }
    
    if (el.questBtn) el.questBtn.addEventListener('click', showCurrentQuest);
    if (el.addBtn) el.addBtn.addEventListener('click', addSong);
    if (el.finishBtn) el.finishBtn.addEventListener('click', goToSummary);
    
    if (el.songIn) {
        [el.songIn, el.artistIn].forEach(i => {
            i.addEventListener('keypress', (e) => { 
                if (e.key === 'Enter') addSong(); 
            });
        });
    }
    
    updateUI();
});
