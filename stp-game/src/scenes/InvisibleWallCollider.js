
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class InvisibleWallCollider extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Add static physics body to the Rectangle
		this.scene.physics.add.existing(this.gameObject, true);
		this.gameObject._isInvisibleWall = true;

		// Initialize the global registry if it doesn't exist yet
		if (!this.scene.globalObstacles) {
			this.scene.globalObstacles = [];
		}
		
		// Announce myself to the scene
		this.scene.globalObstacles.push(this.gameObject);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
