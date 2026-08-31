
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class StateDecider extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Priority list — index 0 is highest priority
		// Subclasses override this array to define creature-specific priorities
		this.priorities = [];

		// Register self on game object for DetectionRadius to find
		this.gameObject._stateDecider = this;
	}

	evaluate(detected) {
		const tags = detected.map(d => d.tag);

		// Don't interrupt flee until it completes
		if (this.gameObject._stateManager?.currentState === 'flee') {
			const fleeBehaviour = this.gameObject._behaviourFlee;
			if (fleeBehaviour && !fleeBehaviour.fleeComplete) return;
		}

		// Find highest priority condition that is satisfied
		for (const rule of this.priorities) {
			if (rule.condition(tags, detected)) {
				this.setState(rule.state);
				return;
			}
		}

		// Default to dynamic state if no rule matched
		const defaultState = this.gameObject.getData('defaultState') ?? 'neutral';
		this.setState(defaultState);
	}

	setState(stateName) {
		if (this.gameObject._stateManager) {
			this.gameObject._stateManager.switchState(stateName);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
