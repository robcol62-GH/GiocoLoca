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

            faceBox.textContent = face.text;

            await new Promise(resolve => setTimeout(resolve, delay));

        }

        faceBox.classList.remove("rolling");
        return face;
}

};
