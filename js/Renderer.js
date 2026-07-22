/*********************************************************************

    Gioco dell'LoCa

    File: Renderer.js

    Versione: 0.2.0

*********************************************************************/

const Renderer = {

    init() {

        Game.log("Renderer inizializzato");

    },

    clear() {

        Game.svg.innerHTML = "";

    },

    create(tag) {

        return document.createElementNS(

            "http://www.w3.org/2000/svg",

            tag

        );

    },

    drawCircle(x, y, radius = 12, color = "red") {

        const circle = this.create("circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);

        circle.setAttribute("r", radius);
        circle.setAttribute("fill", color);

        Game.svg.appendChild(circle);

        return circle;

    },

    drawCircleRelative(x, y, radius = 12, color = "red") {

        const point = Board.relativeToBoard(x, y);

        this.drawCircle(

            point.x,

            point.y,

            radius,

            color

        );

    },

    drawText(text, x, y) {

        const label = this.create("text");

        label.textContent = text;

        label.setAttribute("x", x);

        label.setAttribute("y", y);

        label.setAttribute("text-anchor", "middle");

        label.setAttribute("dominant-baseline", "middle");

        label.setAttribute("font-size", 22);

        label.setAttribute("font-weight", "bold");

        label.setAttribute("fill", "#003366");

        Game.svg.appendChild(label);

        return label;

    },

    refresh() {

        Game.log("Renderer refresh");
        //console.log("=== INIZIO REFRESH ===");
        //console.table(Game.players);
        Board.clearOverlay();


        if (Game.showNumbers) {

            for (const cell of Game.cells) {

                this.drawCellNumber(cell);

            }

        }
        //console.log("=== PLAYERS ===");
        //console.table(Game.players);

        for (const player of Game.players) {

            this.drawPlayer(player);

        }

    },

    drawCellNumber(cell) {

        const point = Board.relativeToBoard(

            cell.position.x,

            cell.position.y

        );

        this.drawText(

            cell.id,

            point.x,

            point.y

        );

    },
    drawOca(player, dimensione = Config.OCA_SIZE) {

        const oca = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );

        oca.setAttribute(
            "href",
            "images/oche/oca_base.png"
        );

        oca.setAttribute(
            "width",
            dimensione
        );

        oca.setAttribute(
            "height",
            dimensione
        );

        oca.classList.add("player");

        oca.dataset.playerId = player.id;

        player.element = oca;

        if (Game.selectedPlayer === player) {
            oca.classList.add("player-selected");
        }

        Game.svg.appendChild(oca);

        return oca;

    },

    drawPlayer(player) {

        if (
            !player ||
            player.id === undefined ||
            player.cellId === undefined
        ) {
            return;
        }

        const cell = Game.cells.find(
            cell => cell.id === player.cellId
        );
/*
        console.log(
            player.name,
            player.cellId
        );
*/
        if (!cell) {

            Game.log(
                `Casella ${player.cellId} non trovata per ${player.name}`
            );

            return;

        }

        const point = Board.relativeToBoard(
            cell.position.x,
            cell.position.y
        );

        let baseX = point.x;
        let baseY = point.y;

        if (player.cellId === 0) {

            baseX += Config.START_CELL_OFFSET_X;
            baseY += Config.START_CELL_OFFSET_Y;

        };

        // Trova tutte le pedine presenti sulla stessa casella
        const playersOnSameCell = Game.players.filter(
            p => p.cellId === player.cellId
        );


        // Trova la posizione di questa pedina nel gruppo
        const playerIndex = playersOnSameCell.findIndex(
            p => p.id === player.id
        );


        // Distanza tra le pedine
        const spacing = 22;

        let offsetX = 0;
        let offsetY = 0;


        // ==============================
        // CASELLA ZERO:
        // pedine da sinistra verso destra,
        // poi nuova riga sopra
        // ==============================

        if (player.cellId === 0) {

            const playersPerRow = 4;

            const totalPlayers = playersOnSameCell.length;
            const totalRows = Math.ceil(totalPlayers / playersPerRow);

            const row = Math.floor(playerIndex / playersPerRow);
            const column = playerIndex % playersPerRow;

            const playersInThisRow = Math.min(
                playersPerRow,
                totalPlayers - row * playersPerRow
            );

            // Centro orizzontale della riga
            offsetX =
                (column - (playersInThisRow - 1) / 2) * spacing;

            // Centro verticale dell'intero gruppo
            offsetY =
                (row - (totalRows - 1) / 2) * spacing;

        }

        // ==============================
        // ALTRE CASELLE:
        // disposizione centrata
        // ==============================

        else {

            offsetX =
                (playerIndex - (playersOnSameCell.length - 1) / 2)
                * spacing;

        }

        let radius = Config.PLAYER_RADIUS;

        const selected =
            Game.selectedPlayer &&
            Game.selectedPlayer.id === player.id;

        if (selected) {
            radius += 4;
        }

        const circle = this.drawCircle(
            baseX + offsetX,
            baseY + offsetY,
            radius,
            player.color
        );

        if (selected) {
            circle.setAttribute("stroke", "black");
            circle.setAttribute("stroke-width", "4");
        }        
        let pawn = this.drawOca(
            player,
            Config.OCA_SIZE
        );

        this.positionPlayer(
            player,
            baseX + offsetX,
            baseY + offsetY,
            Config.OCA_SIZE
        );

        pawn.classList.add("player");
        pawn.dataset.playerId = player.id;

        pawn.addEventListener("click", (event) => {

            console.log("CLICK PEDINA", player.id);
            event.stopPropagation();

            // Modalità Director
            if (Game.director.enabled &&
                Game.director.step === 1) {

                Director.selectPlayer(player);

                return;

            }

            // Seleziona quella cliccata
            Game.selectedPlayer = player;
            Renderer.refresh();

        });
        if (
            Game.selectedPlayer &&
            Game.selectedPlayer.id !== player.id
        ) {
            pawn.style.pointerEvents = "none";
        } else {
            pawn.style.pointerEvents = "auto";
        }
    },
    
    positionPlayer(player, x, y, dimensione = Config.OCA_SIZE) {

        const oca = player.element;

        if (!oca) return;

        oca.setAttribute(
            "x",
            x - dimensione / 2
        );

        oca.setAttribute(
            "y",
            y - dimensione / 2
        );

    }    
};
