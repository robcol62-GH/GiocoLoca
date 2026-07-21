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
    drawOca(x, y, player, dimensione = Config.OCA_SIZE) {

        const oca = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );

        oca.setAttribute("href", "images/oche/oca_base.png");

        oca.setAttribute("x", x - dimensione / 2);
        oca.setAttribute("y", y - dimensione / 2);

        oca.setAttribute("width", dimensione);
        oca.setAttribute("height", dimensione);

        oca.classList.add("player");
        oca.dataset.playerId = player.id;

        // riferimento all'elemento SVG
        player.element = oca;
        if (Game.selectedPlayer === player) {
            oca.classList.add("player-selected");
        }
        Game.svg.appendChild(oca);

        return oca;
    },

    drawPlayer(player) {

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
        console.log({
            player: player.name,
            cellId: player.cellId,
            baseX,
            baseY,
            offsetX,
            offsetY,
            finalX: baseX + offsetX,
            finalY: baseY + offsetY
        });
        const pawn = this.drawOca(

            baseX + offsetX,
            baseY + offsetY,

            player

        );

        pawn.classList.add("player");

        pawn.dataset.playerId = player.id;

        // Quando una pedina è selezionata per lo spostamento,
        // le altre non devono intercettare il click.
        // In questo modo il click raggiunge direttamente la casella.
        /*
        if (
            Game.selectedPlayer &&
            Game.selectedPlayer.id !== player.id
        ) {
            pawn.style.pointerEvents = "none";
        } else {
            pawn.style.pointerEvents = "auto";
        }
        */

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
            Game.selectedPlayer.id === player.id
        ) {

            pawn.setAttribute("stroke", "black");

            pawn.setAttribute("stroke-width", "4");

            pawn.setAttribute("stroke-dasharray", "5 3");

        }
    },
        createPlayers() {

        for (const player of Game.players) {

            if (player.element) continue;

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
                Config.OCA_SIZE
            );

            oca.setAttribute(
                "height",
                Config.OCA_SIZE
            );

            oca.classList.add("player");

            oca.dataset.playerId = player.id;

            oca.addEventListener("click", (event) => {

                event.stopPropagation();

                if (
                    Game.director.enabled &&
                    Game.director.step === 1
                ) {
                    Director.selectPlayer(player);
                    return;
                }

                Game.selectedPlayer = player;
                Renderer.refresh();

            });

            player.element = oca;

            Game.svg.appendChild(oca);

        }

    }
};
