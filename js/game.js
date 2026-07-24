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

    pawnImage: null,

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
        // Casella esente dal controllo di affollamento
        if (cell.ignoreCrowding) {
            return;
        }

        const event = Events.get("CROWDING");
        Popup.showEvent(event, cell, players);

    },
    createAvailablePlayers() {

        this.availablePlayers = [];

        const colors = [
            "blue",
            "red",
            "green",
            "gold",
            "orange",
            "purple",
            "cyan",
            "magenta",
            "brown",
            "lime",
            "pink",
            "teal",
            "navy",
            "olive",
            "coral",
            "turquoise",
            "crimson",
            "chocolate",
            "violet",
            "gray"
        ];
        const pawnImages = [
            "images/oche/oca_blu.png",
            "images/oche/oca_rossa.png",
            "images/oche/oca_verde.png",
            "images/oche/oca_gialla.png",            

            /*
            "images/oche/oca_arancione.png",
            "images/oche/oca_viola.png",
            "images/oche/oca_gold.png",
            "images/oche/oca_cyan.png",
            "images/oche/oca_magenta.png",
            "images/oche/oca_brown.png",
            "images/oche/oca_lime.png",
            "images/oche/oca_pink.png",
            "images/oche/oca_teal.png",
            "images/oche/oca_navy.png",
            "images/oche/oca_olive.png",
            "images/oche/oca_coral.png"
            */
        ];

        for (let i = 1; i <= Config.MAX_PLAYERS; i++) {

            this.availablePlayers.push({

                id: i,
                name: `Giocatore ${i}`,
                cellId: 0,
                stopTurns: 0,          // <-- NUOVO
                color: colors[(i - 1) % colors.length],

                pawnImage:
                    i <= pawnImages.length
                        ? pawnImages[i - 1]
                        : "images/oche/oca_base.png"

            });
        }
    }

};
