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

        Board.clearOverlay();


        if (Game.showNumbers) {

            for (const cell of Game.cells) {

                this.drawCellNumber(cell);

            }

        }


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

    drawPlayer(player) {

        const cell = Game.cells.find(
            cell => cell.id === player.cellId
        );

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

            const column =
                playerIndex % playersPerRow;

            const row =
                Math.floor(playerIndex / playersPerRow);

            offsetX =
                column * spacing;

            offsetY =
                -row * spacing;

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
        const pawn = this.drawCircle(

            point.x + offsetX,

            point.y + offsetY,

            18,

            player.color

        );

        pawn.classList.add("player");

        pawn.dataset.playerId = player.id;

        if (
            Game.selectedPlayer &&
            Game.selectedPlayer.id === player.id
        ) {

            pawn.setAttribute("stroke", "black");

            pawn.setAttribute("stroke-width", "4");

            pawn.setAttribute("stroke-dasharray", "5 3");

        }
    }
};
