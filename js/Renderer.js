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

    drawCircle(parent, x, y, radius, color) {

        const circle = this.create("circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);

        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", 4);

        parent.appendChild(circle);

        return circle;

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
    drawOca(parent, player, dimensione = Config.OCA_SIZE) {

        const oca = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );

        oca.setAttribute("href", player.pawnImage);
        
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

        parent.appendChild(oca);

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
        // I giocatori nel Laghetto non si disegnano sul tabellone

        if (player.cellId === 0) {
            return;
        }
        const cell = Game.cells.find(
            cell => cell.id === player.cellId
        );
        console.log(
            player.name,
            player.cellId,
            cell.id
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

        let baseX = point.x;
        let baseY = point.y;

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
        // ALTRE CASELLE:
        // disposizione centrata
        // ==============================

        offsetX =
            (playerIndex - (playersOnSameCell.length - 1) / 2)
            * spacing;


        const selected =
            Game.selectedPlayer &&
            Game.selectedPlayer.id === player.id;
       
        const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        group.classList.add("player");
        group.dataset.playerId = player.id;

        Game.svg.appendChild(group);

        const ringRadius = Math.round(Config.OCA_SIZE / 2) + 3;

        if (selected) {

            this.drawCircle(
                group,
                baseX + offsetX,
                baseY + offsetY,
                ringRadius,
                "black"
            );

        }

        const ocaSize = selected
            ? Config.OCA_SIZE + 6
            : Config.OCA_SIZE;

        const pawn = this.drawOca(
            group,
            player,
            ocaSize
        );

        this.positionPlayer(
            player,
            baseX + offsetX,
            baseY + offsetY,
            ocaSize
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
