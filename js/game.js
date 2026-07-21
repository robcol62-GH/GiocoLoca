/*********************************************************************

    Gioco dell'LoCa
    File: game.js
    Versione: 0.1.0

*********************************************************************/

const Game = {

    version: "0.1.0",

    title: "Gioco dell'LoCa",

    debug: true,

    board: null,

    overlay: null,

    boardRect: null,

    players: [],

    availablePlayers: [],

    // Elenco delle caselle configurate
    cells: [],

    // Modalità corrente
    mode: "play",

    configurationMode: false,

    showNumbers: false,

    selectedCell: null,

    selectedPlayer: null,

    initialized: false,

    boardRect: null,

    containerRect: null,

    renderQueue: [],

    director: {

        enabled: true,

        action: null,    //DirectorAction.MOVE,

        selectedPlayer: null,   //player

        selectedCell: null,

        status: ""
    },

    log(message) {

        if (this.debug) {

            console.log(message);

        }

    },
 
    getPlayersOnCell(cellId) {

       return this.players.filter(player => player.cellId === cellId);

    },

    checkCrowding(cell, players) {

        if (players.length < Config.CROWDING_LIMIT) {
            return;
        }

        const event = Events.get("CROWDING");

        Popup.showEvent(event, cell, players);

    },
    createAvailablePlayers() {

        this.availablePlayers = [];

        const colors = [
            "red",
            "blue",
            "green",
            "gold",
            "purple",
            "orange",
            "cyan",
            "magenta",
            "brown",
            "lime",
            "pink",
            "teal",
            "navy",
            "olive",
            "coral",
            "violet",
            "turquoise",
            "crimson",
            "chocolate",
            "gray"
        ];

        for (let i = 1; i <= Config.MAX_PLAYERS; i++) {

            this.availablePlayers.push({

                id: i,
                name: `Giocatore ${i}`,
                cellId: 0,
                color: colors[(i - 1) % colors.length]

            });

        }

    }

};
