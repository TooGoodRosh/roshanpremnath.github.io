import config from '../config.js';
import Level from "./scenes/Level.js";
import Preload from "./scenes/Preload.js";
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js'; // 1. Import Level 2
import Level3 from './scenes/Level3.js';
import MainMenu from './scenes/MainMenu.js';

window.addEventListener('load', function () {

	var game = new Phaser.Game(config);

	game.scene.add("MainMenu", MainMenu);
	game.scene.add("Level1", Level1);
	game.scene.add("Level2", Level2);    // 2. Register Level 2
	game.scene.add("Level3", Level3);
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {
		// 3. Start Preload first so your animations get created!
		this.scene.start("Preload"); 
	}
}
