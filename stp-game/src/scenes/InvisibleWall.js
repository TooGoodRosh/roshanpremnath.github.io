
// You can write more code here

/* START OF COMPILED CODE */

import InvisibleWallCollider from "./InvisibleWallCollider.js";
import HideOnAwake from "./HideOnAwake.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class InvisibleWall extends Phaser.GameObjects.Rectangle {

	constructor(scene, x, y, width, height) {
		super(scene, x ?? 0, y ?? 0, width ?? 200, height ?? 100);

		this.setOrigin(0, 0);
		this.isFilled = true;
		this.fillColor = 16714250;

		// invisibleWallCollider
		new InvisibleWallCollider(this);

		// hideOnAwake
		new HideOnAwake(this);

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
