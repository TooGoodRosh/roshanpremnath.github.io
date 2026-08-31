// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class TilemapCollider extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		const layer = this.gameObject;
		
		if (!layer || !layer.setCollisionByExclusion) {
			console.warn("TilemapCollider must be attached to a Tilemap Layer.");
			return;
		}

		// 1. Hide the collision tiles so they act as invisible bounds
		layer.setVisible(false);

		// 2. Enable Arcade Physics on every tile that isn't completely empty (-1)
		layer.setCollisionByExclusion([-1]);

		// 3. Announce this layer to the global obstacle registry
		if (!this.scene.globalObstacles) {
			this.scene.globalObstacles = [];
		}
		this.scene.globalObstacles.push(layer);
	}

	/* END-USER-CODE */
}