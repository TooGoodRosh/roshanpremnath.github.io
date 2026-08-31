
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourCombat extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.active = false;
		this.gameObject._behaviourCombat = this;
	}

	onActivate() {
		this.active = true;
		if (this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	onDeactivate() {
		this.active = false;
	}

	update() {
		const isCurrentState = this.gameObject._stateManager?.currentState === 'combat';
		if (!isCurrentState) return;

		// Keep creature stopped during combat
		if (this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}

		// Play universal combat animation
		if (this.gameObject.anims) {
			this.gameObject.play('creature_combat', true);
		}
	}
}

/* END OF COMPILED CODE */

// You can write more code here
