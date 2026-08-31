
// You can write more code here

/* START OF COMPILED CODE */

import Fruit from "./Fruit.js";
import Obstacle from "./Obstacle.js";
import HideOnAwake from "./HideOnAwake.js";
import CameraController from "./CameraController.js";
import Player from "./Player.js";
import Tier2Herbivore from "./Tier2Herbivore.js";
import Corpse from "./Corpse.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Test02 extends Phaser.Scene {

	constructor() {
		super("Test02");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// editabletilemap
		this.cache.tilemap.add("editabletilemap_0011afad-b347-4087-9230-2fc2b8778dbd", {
			format: 1,
			data: {
				width: 40,
				height: 10,
				orientation: "orthogonal",
				tilewidth: 64,
				tileheight: 64,
				tilesets: [
					{
						columns: 4,
						margin: 0,
						spacing: 0,
						tilewidth: 64,
						tileheight: 64,
						tilecount: 16,
						firstgid: 1,
						image: "tilesheet_ground01",
						name: "tilesheet_ground01",
						imagewidth: 256,
						imageheight: 256,
					},
				],
				layers: [
					{
						type: "tilelayer",
						name: "Ground",
						width: 40,
						height: 15,
						opacity: 1,
						data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 5, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 1, 1, 5, 5, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 5, 1, 5, 5, 1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 1, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 1, 5, 5, 5, 5, 1, 2, 2, 2, 5, 5, 2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 3, 3, 3, 3, 3, 2, 2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0],
					},
				],
			},
		});
		const editabletilemap = this.add.tilemap("editabletilemap_0011afad-b347-4087-9230-2fc2b8778dbd");
		editabletilemap.addTilesetImage("tilesheet_ground01");

		// Ground
		editabletilemap.createLayer("Ground", ["tilesheet_ground01"], 0, 74);

		// fruit
		const fruit = new Fruit(this, 491, 463);
		this.add.existing(fruit);

		// obstacle
		const obstacle = new Obstacle(this, -7, -168);
		this.add.existing(obstacle);
		obstacle.scaleX = 10;
		obstacle.scaleY = 1;
		obstacle.body.setSize(2080, 240, false);

		// hideOnAwake
		new HideOnAwake(obstacle);

		// cameraController
		new CameraController(obstacle);

		// player
		const player = new Player(this, 218, 569);
		this.add.existing(player);

		// tier2Herbivore
		const tier2Herbivore = new Tier2Herbivore(this, 1484, 336);
		this.add.existing(tier2Herbivore);

		// corpse
		const corpse = new Corpse(this, 705, 649);
		this.add.existing(corpse);

		this.editabletilemap = editabletilemap;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.Tilemaps.Tilemap} */
	editabletilemap;

	/* START-USER-CODE */

	create() {
		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
