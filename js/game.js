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

    availablePlayers: [

        {
            id: 1,
            name: "Giocatore 1",
            cellId: 0,
            color: "red"
        },

        {
            id: 2,
            name: "Giocatore 2",
            cellId: 0,
            color: "blue"
        },

        {
            id: 3,
            name: "Giocatore 3",
            cellId: 0,
            color: "green"
        },

        {
            id: 4,
            name: "Giocatore 4",
            cellId: 0,
            color: "gold"
        }

    ],
    
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

    }

};
