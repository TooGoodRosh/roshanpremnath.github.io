
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class AtmosphereDepth extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Pre-calculate the fog color RGB values for lightning-fast math (0xD6C7FB)
		this.fogR = 214;
		this.fogG = 199;
		this.fogB = 251;
	}

	update() {
		if (!this.gameObject || !this.gameObject.active || !this.scene.cameras.main) return;

		const view = this.scene.cameras.main.worldView;
		
		// --- CPU OPTIMIZATION: CAMERA CULLING ---
		// If the object is off-screen (with a 200px padding), skip the color math entirely!
		if (
			this.gameObject.x < view.left - 200 ||
			this.gameObject.x > view.right + 200 ||
			this.gameObject.y < view.top - 200 ||
			this.gameObject.y > view.bottom + 200
		) {
			return;
		}

		const fogBottomY = view.y + (view.height * 0.45);

		// If the object is safely below the mist, remove any tint and skip the math
		if (this.gameObject.y > fogBottomY) {
			this.gameObject.clearTint();
			return;
		}

		// Object is in the mist! Calculate how deep it is (0.0 at the bottom edge, 1.0 at the top edge)
		let depthRatio = (fogBottomY - this.gameObject.y) / (view.height * 0.45);
		depthRatio = Math.min(Math.max(depthRatio, 0), 1) * 0.75; // Clamp to 0-1, scale to 75% max intensity

		// Heavily optimized manual color interpolation
		const r = Math.floor(255 + (this.fogR - 255) * depthRatio);
		const g = Math.floor(255 + (this.fogG - 255) * depthRatio);
		const b = Math.floor(255 + (this.fogB - 255) * depthRatio);

		this.gameObject.setTint((r << 16) | (g << 8) | b);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
