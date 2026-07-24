const Dice = {

    list: [],

    async load() {

        const response = await fetch("data/dice.json");

        this.list = await response.json();

        Game.log(
            `Caricati ${this.list.length} dadi`
        );

    },

    get(id) {

        return this.list.find(
            dice => dice.id === id
        );

    },

    roll(id, cell) {

        const dice = this.get(id);

        if (!dice) {

            Game.log(`Dado '${id}' non trovato`);

            return null;

        }

        // Selettore giocatori
        if (dice.type === "players") {

            const players =
                (dice.scope === "CELL")
                    ? Game.getPlayersOnCell(cell.id)
                    : Game.players;

            const index = Math.floor(Math.random() * players.length);

            return players[index];
        }

        // Dado classico
        const index = Math.floor(
            Math.random() * dice.faces.length
        );

        return dice.faces[index];

    },

    async animate(faceBox, diceId, cell) {
        
        faceBox.classList.add("rolling");

        const delays = [
            60, 70, 80, 90,
            110, 140, 180,
            240, 320, 450
        ];

        let face = null;

        for (const delay of delays) {

            face = this.roll(diceId, cell);

            this.showFace(faceBox, face);

            await new Promise(resolve => setTimeout(resolve, delay));

        }

        faceBox.classList.remove("rolling");
        return face;
    },

    showFace(faceBox, face) {

        if (!face) {
            faceBox.innerHTML = "";
            return;
        }

        faceBox.innerHTML = "";

        //==========================
        // IMMAGINE
        //==========================

        if (face.image) {

            const img = document.createElement("img");
            img.src = "images/selectors/" + face.image;
            img.className = "selectorImage";
            faceBox.appendChild(img);

        }
        //==========================
        // TESTO
        //==========================
        else if (typeof face.text === "string" && face.text.trim() !== "") {
            faceBox.textContent = face.text;
        }
        //==========================
        // PEDINA
        //==========================
        else {

            const token = document.createElement("div");
            token.className = "playerToken";
            token.style.background = face.color;
            faceBox.appendChild(token);

        }
    }

};
