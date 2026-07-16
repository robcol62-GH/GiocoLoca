const PlayerSetup = {

    init() {

        const setup =
            document.getElementById("playerSetup");

        const buttons =
            document.querySelectorAll(
                "#playerChoices button"
            );

        if (!setup || !buttons.length) {

            return;

        }


        buttons.forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    const numberOfPlayers =
                        Number(
                            button.dataset.players
                        );

                    this.startGame(
                        numberOfPlayers
                    );

                }

            );

        });


        // ==============================
        // PULSANTE NUOVA PARTITA
        // ==============================

        const newGameButton =
            document.getElementById("btnNewGame");

        if (newGameButton) {

            newGameButton.addEventListener(

                "click",

                () => this.newGame()

            );

        }

    },

    startGame(numberOfPlayers) {

        Game.players =
            Game.availablePlayers
                .slice(0, numberOfPlayers)
                .map(player => ({

                    ...player,

                    cellId: 0

                }));


        Game.selectedPlayer = null;


        Renderer.refresh();


        const setup =
            document.getElementById("playerSetup");

        if (setup) {

            setup.style.display = "none";

        }


        console.log(
            `Partita iniziata con ${numberOfPlayers} giocatori`
        );

    },

    newGame() {

        // Elimina i giocatori della partita precedente
        Game.players = [];

        // Annulla eventuali selezioni
        Game.selectedPlayer = null;
        Game.selectedCell = null;

        // Aggiorna il tabellone
        Renderer.refresh();

        // Riapre la finestra di scelta giocatori
        const setup =
            document.getElementById("playerSetup");

        if (setup) {

            setup.style.display = "flex";

        }

    }
};

