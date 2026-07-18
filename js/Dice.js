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

    roll(id) {

        const dice = this.get(id);

        if (!dice) {

            Game.log(`Dado '${id}' non trovato`);

            return null;

        }

        // Selettore giocatori
        if (dice.type === "players") {

            const index = Math.floor(
                Math.random() * Game.players.length
            );
            console.log("Giocatori:", Game.players.length);
            console.log("Indice estratto:", index);
            return Game.players[index];

        }

        // Dado classico
        const index = Math.floor(
            Math.random() * dice.faces.length
        );

        return dice.faces[index];

    },

    async animate(faceBox, diceId) {
        
        faceBox.classList.add("rolling");

        const delays = [
            40, 40, 45, 50,
            60, 70, 90,
            120, 160, 220
        ];

        let face = null;

        for (const delay of delays) {

            face = this.roll(diceId);

            this.showFace(faceBox, face);

            await new Promise(resolve => setTimeout(resolve, delay));

        }

        faceBox.classList.remove("rolling");
        return face;
    },

    showFace(faceBox, face) {
        
        console.log(face);

        if (face.text !== undefined) {

            faceBox.textContent = face.text;
            return;

        }

        faceBox.innerHTML = "";

        const token = document.createElement("div");

        token.className = "playerToken";
        token.style.background = face.color;

        faceBox.appendChild(token);

    }
};
