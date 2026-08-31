
// You can write more code here

/* START OF COMPILED CODE */

import HideOnAwake from "./HideOnAwake.js";
import CheckpointLogic from "./CheckpointLogic.js";
import SyncPhysicsBody from "./SyncPhysicsBody.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Checkpoint extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "guapen", frame);

		this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 416, 120), Phaser.Geom.Rectangle.Contains);
		this.scaleX = 2;
		this.scaleY = 0.5;
		scene.physics.add.existing(this, true);
		this.body.setSize(416, 120, false);

		// hideOnAwake
		new HideOnAwake(this);

		// checkpointLogic
		new CheckpointLogic(this);

		// syncPhysicsBody
		new SyncPhysicsBody(this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
