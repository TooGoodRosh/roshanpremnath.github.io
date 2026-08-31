
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import StateDecider from "./StateDecider.js";
/* END-USER-IMPORTS */

export default class MimicStateDecider extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject._stateDecider = this;
		this.gameObject._mimicStateDecider = this;
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

	forceState(stateName) {
		const stateManager = this.gameObject?._stateManager;
		if (!stateManager) return;
		stateManager.switchState(stateName);
	}

	switchPriorityList() {
		if (!this._hasEaten) {
			this.priorities = this._postEatPriorities;
			this._hasEaten = true;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
