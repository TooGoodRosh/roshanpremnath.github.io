
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CreatureTilemapCollider extends ScriptNode {

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
			console.warn("CreatureTilemapCollider must be attached to a Tilemap Layer.");
			return;
		}

		// Enable Arcade Physics on every painted tile
		layer.setCollisionByExclusion([-1]);

		// Announce this layer to the CREATURE-ONLY obstacle registry
		if (!this.scene.creatureObstacles) {
			this.scene.creatureObstacles = [];
		}
		this.scene.creatureObstacles.push(layer);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
