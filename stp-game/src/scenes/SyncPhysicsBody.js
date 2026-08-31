
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SyncPhysicsBody extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		const go = this.gameObject;
		
		if (go && go.body) {
			// Calculate the new size based on the texture's base dimensions and current scale
			const scaledWidth = go.width * Math.abs(go.scaleX);
			const scaledHeight = go.height * Math.abs(go.scaleY);
			
			// If your obstacle has a (0,0) origin (like obs_rock1), we pass false 
			// to prevent Phaser from trying to auto-center the body.
			const isCentered = go.originX === 0.5 && go.originY === 0.5;
			
			go.body.setSize(scaledWidth, scaledHeight, isCentered);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
