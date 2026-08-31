// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class YSort extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Fallback in case the property hasn't been added in the editor yet
		this.isStatic = this.isStatic ?? false;
		/* END-USER-CTR-CODE */
	}

	/** @type {boolean} */
	isStatic = true;

	/* START-USER-CODE */

	awake() {
		// If this is a static prop (like a tree), sort it once and then ignore it
		if (this.isStatic && this.gameObject) {
			this.gameObject.setDepth(this.gameObject.y);
		}
	}

	update() {
		// If this is a dynamic actor (like the Player or Creature), update depth every frame
		if (!this.isStatic && this.gameObject && this.gameObject.active) {
			// --- CPU OPTIMIZATION: CAMERA CULLING ---
			if (this.scene && this.scene.cameras && this.scene.cameras.main) {
				const view = this.scene.cameras.main.worldView;
				if (
					this.gameObject.x < view.left - 200 ||
					this.gameObject.x > view.right + 200 ||
					this.gameObject.y < view.top - 200 ||
					this.gameObject.y > view.bottom + 200
				) {
					return;
				}
			}
			this.gameObject.setDepth(this.gameObject.y);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
