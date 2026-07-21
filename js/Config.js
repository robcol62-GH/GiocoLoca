/*********************************************************************

    Gioco dell'LoCa
    File: Config.js

*********************************************************************/

const Config = {

    // Numero Massimo di Giocatori
    MAX_PLAYERS:20,

    // Numero minimo di pedine sulla stessa casella per attivare l'evento di affollamento.
    CROWDING_LIMIT:3,

    // Grandezza Segnalino OCA
    OCA_SIZE:46,


    START_CELL_OFFSET_X: 28,
    START_CELL_OFFSET_Y: 0,

    init() {

        this.button =
            document.getElementById("btnConfig");

        if (this.button) {

            this.button.addEventListener(

                "click",

                () => this.start()

            );

        };
        this.exportButton =
                document.getElementById("btnExport");

        if (this.exportButton) {

            this.exportButton.addEventListener(

                "click",

                () => this.exportJSON()

            );

        }

        this.numbersButton =
            document.getElementById("btnNumbers");

        if (this.numbersButton) {

            this.updateNumbersButton();

            this.numbersButton.addEventListener(

                "click",

                () => {

                    Game.showNumbers = !Game.showNumbers;

                    Renderer.refresh();

                    this.updateNumbersButton();

                }

            );

        }

        Game.log("Configuratore pronto");
        Game.overlay.addEventListener(

            "click",

            (event) => {
                this.handleClick(event);
            }

        )
    },

    start() {

        Game.mode = "config";
        Game.overlay.style.pointerEvents = "auto";

        UI.setStatus("🟡 Modalità configurazione");

        Game.log("Modalità configurazione attiva");

    },

    createCell(x, y) {

        const cell = {

            id: Game.cells.length + 1,

            position: {

                x,

                y

            },

            image: null

        };

        Game.cells.push(cell);

        return cell;

    },

    handleClick(event) {

        const point = Board.screenToBoard(
            event.clientX,
            event.clientY
        );

        const relative = Board.boardToRelative(
            point.x,
            point.y
        );


        // ==============================
        // MODALITÀ PLAY
        // ==============================

        if (Game.mode === "play") {
            // ==============================
            // CLICK SULLA PEDINA
            // ==============================
            
            //console.log("Target:", event.target);
            //console.log("PlayerElement:", playerElement);
            //console.log("SelectedPlayer =", Game.selectedPlayer);

            // Se sto già spostando una pedina,
            // ignoro eventuali click sulle altre pedine.
            if (!Game.selectedPlayer) {

                const playerElement = event.target.closest(".player");

                if (playerElement) {

                    const playerId = Number(
                        playerElement.dataset.playerId
                    );

                    const player = Game.players.find(
                        player => player.id === playerId
                    );

                    if (player) {

                        Game.selectedPlayer = player;

                        console.log(
                            "Pedina selezionata:",
                            player.name
                        );

                        Renderer.refresh();

                    }

                    return;

                }

            }            

            let nearestCell = null;
            let nearestDistance = Infinity;

            for (const cell of Game.cells) {

                const dx = relative.x - cell.position.x;
                const dy = relative.y - cell.position.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < nearestDistance) {

                    nearestDistance = distance;
                    nearestCell = cell;

                }

            }

            const clickRadius = 0.04;

            // ==============================
            // MODALITÀ DIRECTOR
            // ==============================

            if (
                Game.director.enabled &&
                Game.director.step === 2
            ) {

                Director.moveSelectedPlayer(nearestCell);

                return;

            }            

            if (
                nearestCell &&
                nearestDistance <= clickRadius
            ) {
                
                console.log("CLICK CASELLA");
                console.log(
                    "Casella cliccata:",
                    nearestCell.id
                );


                // ==============================
                // PEDINA SELEZIONATA:
                // SPOSTAMENTO SULLA CASELLA
                // ==============================

                if (Game.selectedPlayer) {

                    Game.selectedPlayer.cellId = nearestCell.id;

                    const players = Game.getPlayersOnCell(nearestCell.id);
                   
                    Game.checkCrowding(
                        nearestCell,
                        players
                    );

                    console.log(
                        "Pedine presenti:",
                        players.length,
                        players.map(p => p.color)
                    );

                    Game.selectedPlayer = null;

                    Renderer.refresh();

                    return;

                }


                // ==============================
                // NESSUNA PEDINA SELEZIONATA:
                // APRE IL CONTENUTO DELLA CASELLA
                // ==============================

                Popup.showCell(nearestCell);
            }
            return;
        }

        // ==============================
        // MODALITÀ CONFIG
        // ==============================

        if (Game.mode !== "config") {
            return;
        }

        const cell = {

            id: Game.cells.length,

            position: relative,

            image: null,

            video: null,

            audio: null

        };

        Game.cells.push(cell);

        Renderer.drawCellNumber(cell);

        Game.log(
            `Click: x=${relative.x.toFixed(4)}  y=${relative.y.toFixed(4)}`
        );

    },

    exportJSON() {
        console.log(Game.cells);
        
        const data = {

            version: "1.0",

            cells: Game.cells

        };

        const json = JSON.stringify(

            data,

            null,

            4

        );

        const blob = new Blob(

            [json],

            {

                type: "application/json"

            }

        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "caselle.json";

        link.click();

        URL.revokeObjectURL(link.href);

        Game.log("JSON esportato");

    },

    updateNumbersButton() {

        if (!this.numbersButton) return;

        this.numbersButton.textContent =
            Game.showNumbers
                ? "Nascondi Numeri"
                : "Mostra Numeri";

    }
};
