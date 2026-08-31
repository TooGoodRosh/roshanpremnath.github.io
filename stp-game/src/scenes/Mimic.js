
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import MimicStateDecider from "./MimicStateDecider.js";
import StateManager from "./StateManager.js";
import AttackResolution from "./AttackResolution.js";
import BehaviourCombat from "./BehaviourCombat.js";
import BehaviourStalk from "./BehaviourStalk.js";
import BehaviourCharge from "./BehaviourCharge.js";
import BehaviourEatCorpse from "./BehaviourEatCorpse.js";
import BehaviourOpportunity from "./BehaviourOpportunity.js";
import BehaviourChase from "./BehaviourChase.js";
import MimicController from "./MimicController.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Mimic extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "guapen", frame);

		scene.physics.add.existing(this, false);
		this.body.setSize(208, 240, false);

		// detectionRadius
		new DetectionRadius(this);

		// mimicStateDecider
		new MimicStateDecider(this);

		// stateManager
		new StateManager(this);

		// attackResolution
		new AttackResolution(this);

		// behaviourCombat
		new BehaviourCombat(this);

		// behaviourStalk
		new BehaviourStalk(this);

		// behaviourCharge
		new BehaviourCharge(this);

		// behaviourEatCorpse
		new BehaviourEatCorpse(this);

		// behaviourOpportunity
		new BehaviourOpportunity(this);

		// behaviourChase
		new BehaviourChase(this);

		// mimicController
		new MimicController(this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
