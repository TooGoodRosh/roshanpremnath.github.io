
// You can write more code here

/* START OF COMPILED CODE */

import YSort from "./YSort.js";
import AtmosphereDepth from "./AtmosphereDepth.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class EnvAss extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "A_Bush", frame);

		this.setOrigin(0.5, 1);

		// ySort
		new YSort(this);

		// atmosphereDepth
		new AtmosphereDepth(this);

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
