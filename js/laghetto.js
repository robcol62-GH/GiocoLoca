const Laghetto = {

    firstShow: true,

    init() {

        Game.log("Laghetto inizializzato");

    },

    show() {
        

        const panel = document.getElementById("laghettoPanel");
        panel.style.display = "block";
        document.getElementById("laghettoPanel").style.display="block";
        this.refresh();
    },

    hide() {

        const panel = document.getElementById("laghettoPanel");
        panel.style.display = "none";

    },

    refresh() {

        const body = document.getElementById("laghettoBody");
        body.innerHTML = "";

        Game.players.forEach((player, index) => {
            console.log(
                "Laghetto:",
                player.id,
                "cellId=",
                player.cellId
            );

            if (player.cellId !== 0) {
                return;
            }
            const pawn = document.createElement("div");
            pawn.className = "laghettoPawn";
            if (
                Game.selectedPlayer &&
                Game.selectedPlayer.id === player.id
            ) {
                pawn.classList.add("selected");
            }
            if (this.firstShow) {

                pawn.style.opacity = "0";

                setTimeout(() => {

                    requestAnimationFrame(() => {

                        pawn.style.opacity = "1";

                    });

                }, index * 120);

            } else {

                pawn.style.opacity = "1";

            }
            pawn.style.backgroundColor = player.color;
            pawn.dataset.playerId = player.id;

            const img = document.createElement("img");
            img.src = "images/oche/oca_base.png";

            pawn.appendChild(img);
            body.appendChild(pawn);            
            pawn.addEventListener("click", () => {
                Game.selectedPlayer = player;
                Renderer.refresh();
                Laghetto.refresh();
            });
        });
        this.firstShow = false;
    }
};
