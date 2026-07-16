/*********************************************************************

    Gioco dell'LoCa
    File: UI.js

*********************************************************************/

const UI = {

    init() {

        this.status =
            document.getElementById("statusMessage");   

        this.status =
            document.getElementById("statusMessage");

        this.btnMenu =
            document.getElementById("btnMenu");

        this.menuPanel =
            document.getElementById("menuPanel");

        this.btnFullscreen =
            document.getElementById("btnFullscreen");

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

                if (event.key === "F10") {

                    event.preventDefault();

                    this.toggleMenu();

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
    
    setStatus(message){

       this.status.textContent = message;

    }
};
