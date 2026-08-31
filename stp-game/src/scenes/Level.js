
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// diorama
		this.cache.tilemap.add("diorama_b2047956-7452-4d32-bc8d-e4a8da11aaaf", {
			format: 1,
			data: {
				width: 40,
				height: 9,
				orientation: "orthogonal",
				tilewidth: 256,
				tileheight: 256,
				tilesets: [
					{
						columns: 1,
						margin: 0,
						spacing: 0,
						tilewidth: 256,
						tileheight: 256,
						tilecount: 1,
						firstgid: 1,
						image: "tileset_ground",
						name: "tileset_ground",
						imagewidth: 256,
						imageheight: 256,
					},
					{
						columns: 1,
						margin: 0,
						spacing: 0,
						tilewidth: 256,
						tileheight: 256,
						tilecount: 1,
						firstgid: 2,
						image: "tileset_edge",
						name: "tileset_edge",
						imagewidth: 256,
						imageheight: 256,
					},
				],
				layers: [
					{
						type: "tilelayer",
						name: "ground",
						width: 40,
						height: 8,
						opacity: 1,
						data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					},
					{
						type: "tilelayer",
						name: "edge",
						width: 40,
						height: 1,
						opacity: 1,
						data: [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					},
				],
			},
		});
		const diorama = this.add.tilemap("diorama_b2047956-7452-4d32-bc8d-e4a8da11aaaf");
		diorama.addTilesetImage("tileset_ground");
		diorama.addTilesetImage("tileset_edge");

		// dino
		const dino = this.add.image(640, 288, "dino");
		dino.setInteractive(new Phaser.Geom.Rectangle(0, 0, 250, 250), Phaser.Geom.Rectangle.Contains);

		// welcome
		const welcome = this.add.text(640, 478, "", {});
		welcome.setOrigin(0.5, 0.5);
		welcome.text = "Phaser 4 + Phaser Editor v5";
		welcome.setStyle({ "fontFamily": "Arial", "fontSize": "30px" });

		// ground
		diorama.createLayer("ground", ["tileset_ground"], 0, 0);

		// edge
		diorama.createLayer("edge", ["tileset_edge"], 0, 462);

		this.welcome = welcome;
		this.diorama = diorama;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Text} */
	welcome;
	/** @type {Phaser.Tilemaps.Tilemap} */
	diorama;

	/* START-USER-CODE */

	// Write more your code here

	create() {

		this.editorCreate();		
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
