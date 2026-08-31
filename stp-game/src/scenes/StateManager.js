
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class StateManager extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.currentState = null;
		this._pendingState = null;
		this.states = {};

		// Register self on game object for StateDecider to find
		this.gameObject._stateManager = this;
	}

	registerState(stateName, behaviourNode) {
		this.states[stateName] = behaviourNode;
	}

	switchState(stateName, instant = false) {
		// If we are already in this state, do nothing
		if (this.currentState === stateName) return;

		// If we are already transitioning to this state, do nothing
		if (this._pendingState === stateName) return;

		// Clear any existing delayed switch timer
		if (this._switchTimer) {
			this._switchTimer.remove();
		}

		// If this is the initial state load, or combat, or explicitly instant: skip the delay
		if (!this.currentState || instant || stateName === 'combat') {
			// FIX: Ensure the previous state is properly deactivated even on instant transitions!
			if (this.currentState && this.states[this.currentState]) {
				this.states[this.currentState].onDeactivate();
			}
			this._executeSwitch(stateName);
			return;
		}

		// Store the state we are waiting to transition into
		this._pendingState = stateName;

		// 1. Deactivate current behaviour immediately so the creature physically stops reacting
		if (this.currentState && this.states[this.currentState]) {
			this.states[this.currentState].onDeactivate();
		}

		// 2. Put into a dummy transition state so old behaviour updates don't keep firing
		this.currentState = 'transition';

		// 3. Apply the ballsy 500ms delay before activating the new behaviour
		this._switchTimer = this.scene.time.delayedCall(500, () => {
			this._pendingState = null;
			this._executeSwitch(stateName);
		});
	}

	_executeSwitch(stateName) {
		this.currentState = stateName;

		// Activate new behaviour node
		if (this.states[stateName]) {
			this.states[stateName].onActivate();
		} else {
			console.warn('StateManager: no behaviour node registered for state:', stateName);
		}
	}

	getCurrentState() {
		// Expose pending state if transitioning so decider logic doesn't freak out
		return this.currentState === 'transition' ? this._pendingState : this.currentState;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
