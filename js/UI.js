/*********************************************************************

    Gioco dell'LoCa
    File: UI.js

*********************************************************************/

const UI = {

    init() {

        messageTimer=null,
        lastStatus= "",

        this.status = document.getElementById("statusMessage");   
        this.status = document.getElementById("statusMessage");
        this.btnMenu = document.getElementById("btnMenu");
        this.menuPanel = document.getElementById("menuPanel");
        this.btnFullscreen = document.getElementById("btnFullscreen");

        this.events();
        Game.log("UI inizializzata");

    },

    events() {

        this.btnMenu.addEventListener(

            "click",

            () => this.toggleMenu()

        );

        this.btnFullscreen.addEventListener(

            "click",

            () => this.fullscreen()

        );

        document.addEventListener(

            "keydown",

            (event) => {

                switch (event.key) {

                    case "F10":

                        event.preventDefault();
                        this.toggleMenu();
                        break;

                    case " ":

                        if (!Game.selectedPlayer)
                            return;

                        // Nel laghetto lo SPACE non ha effetto
                        if (Game.selectedPlayer.cellId === 0)
                            return;

                        event.preventDefault();

                        Game.selectedPlayer.stopTurns =
                            Game.selectedPlayer.stopTurns ? 0 : 1;

                        Renderer.refresh();

                        break;
                }

            }

        );
    },

    toggleMenu() {

        this.menuPanel.classList.toggle("hidden");

    },

    fullscreen() {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        }
        else {

            document.exitFullscreen();

        }

    },
    
    setStatus(message) {

        this.lastStatus = message;
        this.status.textContent = message;

    },
    message(message, duration = 2000) {

        clearTimeout(this.messageTimer);

        const previousStatus = this.lastStatus;

        this.status.textContent = message;

        this.messageTimer = setTimeout(() => {

            this.setStatus(previousStatus);

        }, duration);

    },    
};
