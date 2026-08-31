
// You can write more code here

/* START OF COMPILED CODE */

import FruitPickup from "./FruitPickup.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Fruit extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_fruit", frame);

		this.scaleX = 0.5;
		this.scaleY = 0.5;
		scene.physics.add.existing(this, false);
		this.body.pushable = false;
		this.body.immovable = true;
		this.body.setSize(64, 64, false);

		// fruitPickup
		new FruitPickup(this);

		/* START-USER-CTR-CODE */
		this.body.onOverlap = true;
		this.setData('type', 'food');
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
