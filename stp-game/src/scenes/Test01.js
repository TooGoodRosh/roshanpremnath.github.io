
// You can write more code here

/* START OF COMPILED CODE */

import Obstacle from "./Obstacle.js";
import HideOnAwake from "./HideOnAwake.js";
import Fruit from "./Fruit.js";
import Tier2Herbivore from "./Tier2Herbivore.js";
import Player from "./Player.js";
import Mimic from "./Mimic.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Test01 extends Phaser.Scene {

	constructor() {
		super("Test01");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// diorama
		this.cache.tilemap.add("diorama_c3f61193-9e33-4d94-96cf-0d34cfe35154", {
			format: 1,
			data: {
				width: 30,
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
						image: "tileset_diorama",
						name: "tileset_diorama",
						imagewidth: 256,
						imageheight: 256,
					},
				],
				layers: [
					{
						type: "tilelayer",
						name: "ground",
						width: 30,
						height: 10,
						opacity: 1,
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 9, 9, 1, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					},
					{
						type: "tilelayer",
						name: "Front Edge",
						width: 30,
						height: 10,
						opacity: 1,
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 0, 0, 0],
					},
				],
			},
		});
		const diorama = this.add.tilemap("diorama_c3f61193-9e33-4d94-96cf-0d34cfe35154");
		diorama.addTilesetImage("tileset_diorama");

		// layer_1
		const layer_1 = this.add.layer();

		// ground
		const ground = diorama.createLayer("ground", ["tileset_diorama"], 0, 256);
		layer_1.add(ground);

		// Front Edge
		const front_Edge = diorama.createLayer("Front Edge", ["tileset_diorama"], 0, 256);
		layer_1.add(front_Edge);

		// layer_2
		const layer_2 = this.add.layer();

		// obstacle
		const obstacle = new Obstacle(this, 66, 79);
		obstacle.scaleX = 8.85;
		obstacle.scaleY = 1;
		layer_2.add(obstacle);

		// hideOnAwake
		new HideOnAwake(obstacle);

		// obstacle_1
		const obstacle_1 = new Obstacle(this, 66, 79);
		obstacle_1.scaleX = 8.85;
		obstacle_1.scaleY = 1;
		layer_2.add(obstacle_1);

		// hideOnAwake_1
		new HideOnAwake(obstacle_1);

		// fruit
		const fruit = new Fruit(this, 552, 536);
		this.add.existing(fruit);

		// tier2Herbivore
		const tier2Herbivore = new Tier2Herbivore(this, 1123, 544);
		this.add.existing(tier2Herbivore);

		// player
		const player = new Player(this, 274, 637);
		this.add.existing(player);

		// mimic
		const mimic = new Mimic(this, 800, 536);
		this.add.existing(mimic);

		this.diorama = diorama;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.Tilemaps.Tilemap} */
	diorama;

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
