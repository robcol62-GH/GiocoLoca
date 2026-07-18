/*********************************************************************

    Gioco dell'LoCa
    File: app.js
    Versione: 0.1.0

*********************************************************************/

document.addEventListener(

    "DOMContentLoaded",

    startApplication

);



async function startApplication() {

    Game.log("--------------------------------");

    Game.log(Game.title);

    Game.log("Versione " + Game.version);

    Game.log("--------------------------------");


    Board.init();

    Board.debug();


    Renderer.init();


    await Storage.loadCells();
    await Dice.load();

    Renderer.refresh();

    UI.init();

    Config.init();

    PlayerSetup.init();

    Director.init();

    Game.initialized = true;

    Game.log("Applicazione pronta");

    UI.setStatus("🟢 Applicazione pronta");

}
