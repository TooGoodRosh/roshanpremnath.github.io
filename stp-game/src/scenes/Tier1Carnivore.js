
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import StateDecider from "./StateDecider.js";
import StateManager from "./StateManager.js";
import BehaviourPatrol from "./BehaviourPatrol.js";
import BehaviourEatCorpse from "./BehaviourEatCorpse.js";
import BehaviourChase from "./BehaviourChase.js";
import BehaviourCombat from "./BehaviourCombat.js";
import AttackResolution from "./AttackResolution.js";
import Tier1CarnivoreController from "./Tier1CarnivoreController.js";
import DetectionGlow from "./DetectionGlow.js";
import SquashStretch from "./SquashStretch.js";
import AtmosphereDepth from "./AtmosphereDepth.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier1Carnivore extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_carnivore2", frame);

		this.scaleX = 0.5;
		this.scaleY = 0.5;
		this.setOrigin(0.5, 1);
		scene.physics.add.existing(this, false);
		this.body.setSize(1406, 554, false);

		// detectionRadius
		new DetectionRadius(this);

		// stateDecider
		new StateDecider(this);

		// stateManager
		new StateManager(this);

		// behaviourPatrol
		new BehaviourPatrol(this);

		// behaviourEatCorpse
		new BehaviourEatCorpse(this);

		// behaviourChase
		new BehaviourChase(this);

		// behaviourCombat
		new BehaviourCombat(this);

		// attackResolution
		new AttackResolution(this);

		// tier1CarnivoreController
		new Tier1CarnivoreController(this);

		// detectionGlow
		new DetectionGlow(this);

		// squashStretch
		new SquashStretch(this);

		// atmosphereDepth
		new AtmosphereDepth(this);

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
