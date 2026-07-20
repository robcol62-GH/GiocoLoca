const Popup = {

    createOverlay() {

        // Evita di aprire più popup contemporaneamente
        if (document.getElementById("gamePopup")) {
            return null;
        }

        const overlay = document.createElement("div");

        overlay.id = "gamePopup";

        document.body.appendChild(overlay);

        // Click sullo sfondo = chiude il popup
        overlay.addEventListener("click", (event) => {

            if (event.target === overlay) {

                Popup.close();

            }

        });

        return overlay;

    },


    showImage(imageName) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const img = document.createElement("img");

        img.src = "images/card/" + imageName;

        img.alt = "Contenuto della casella";

        overlay.appendChild(img);

    },


    showVideo(videoName) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const video = document.createElement("video");

        video.src = "video/" + videoName;

        video.controls = true;

        video.autoplay = true;

        overlay.appendChild(video);

    },


    showAudio(audioName) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const audio = document.createElement("audio");

        audio.src = "audio/" + audioName;

        audio.controls = true;

        audio.autoplay = true;

        overlay.appendChild(audio);

    },


    close() {

        const overlay =
            document.getElementById("gamePopup");

        if (overlay) {

            const media =
                overlay.querySelector("video, audio");

            if (media) {

                media.pause();

            }

            overlay.remove();

            //UI.setStatus("🟢 Applicazione pronta");

        }

    },

    showDice(diceId) {

        const dice = Dice.get(diceId);
        UI.setStatus("🎲 " + dice.name);

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const window = document.createElement("div");

        window.id = "diceWindow";

        overlay.appendChild(window);

        const faceBox = document.createElement("div");

        faceBox.id = "diceFace";

        faceBox.textContent = "?";

        window.appendChild(faceBox);

        faceBox.addEventListener("click", async () => {

            await Dice.animate(faceBox, diceId);

        });

    },
    buildPopup(data) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        //==============================
        // Finestra principale
        //==============================

        const window = document.createElement("div");

        window.id = "cellWindow";

        overlay.appendChild(window);

        //==============================
        // AREA CONTENUTO
        //==============================

        const mediaArea = document.createElement("div");

        mediaArea.className = "mediaArea";

        window.appendChild(mediaArea);

        //==============================
        // Immagine
        //==============================

        if (data.image) {

            const img = document.createElement("img");

            img.src = "images/card/" + data.image;

            img.alt = "";

            mediaArea.appendChild(img);

        }

        //==============================
        // Audio
        //==============================

        if (data.audio) {

            const audio = document.createElement("audio");

            audio.src = "audio/" + data.audio;

            audio.controls = true;

            audio.autoplay = true;

            mediaArea.appendChild(audio);

        }

        //==============================
        // Video
        //==============================

        if (data.video) {

            const video = document.createElement("video");

            video.src = "video/" + data.video;

            video.controls = true;

            video.autoplay = true;

            mediaArea.appendChild(video);

        }

        //==============================
        // AREA TESTO
        //==============================

        //console.log("CELL =", cell);
        //console.log("TXT =", cell.txt);
        
        if (data.txt && data.txt.trim() !== "") {

            const textArea = document.createElement("div");

            textArea.className = "textArea";

            textArea.textContent = data.txt;

            window.appendChild(textArea);

        }

        //==============================
        // AREA SELETTORE
        //==============================

        if (data.selector) {

            const selectorArea = document.createElement("div");

            selectorArea.className = "selectorArea";

            selectorArea.appendChild(this.createDice(data.selector));

            window.appendChild(selectorArea);

        }

        //==============================
        // FOOTER
        //==============================

        const footerArea = document.createElement("div");

        footerArea.className = "footerArea";

        const closeButton = document.createElement("button");

        closeButton.className = "popupButton";

        closeButton.textContent = "Chiudi";

        closeButton.onclick = () => overlay.remove();

        footerArea.appendChild(closeButton);

        window.appendChild(footerArea);

    },

    createDice(diceId) {

        const dice = Dice.get(diceId);

        UI.setStatus("🎲 " + dice.name);

        const window = document.createElement("div");

        window.id = "diceWindow";

        const faceBox = document.createElement("div");

        faceBox.id = "diceFace";

        faceBox.textContent = "?";

        window.appendChild(faceBox);

        faceBox.addEventListener("click", async () => {

            await Dice.animate(faceBox, diceId);

        });

        return window;

    },

    showCell(cell) {
        this.buildPopup(cell);

    },

    showEvent(event, cell, players) {
       
        this.buildPopup(event);            
    }
};