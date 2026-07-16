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

        }

    }

};