
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import StateDecider from "./StateDecider.js";
import StateManager from "./StateManager.js";
import BehaviourNeutral from "./BehaviourNeutral.js";
import BehaviourOpportunity from "./BehaviourOpportunity.js";
import BehaviourChase from "./BehaviourChase.js";
import BehaviourCombat from "./BehaviourCombat.js";
import AttackResolution from "./AttackResolution.js";
import Tier1HerbivoreController from "./Tier1HerbivoreController.js";
import DetectionGlow from "./DetectionGlow.js";
import SquashStretch from "./SquashStretch.js";
import AtmosphereDepth from "./AtmosphereDepth.js";
import MovementDust from "./MovementDust.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier1Herbivore extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_herb2", frame);

		this.scaleX = 0.27;
		this.scaleY = 0.27;
		this.setOrigin(0.5, 1);
		scene.physics.add.existing(this, false);
		this.body.setSize(750, 650, false);

		// detectionRadius
		new DetectionRadius(this);

		// stateDecider
		new StateDecider(this);

		// stateManager
		new StateManager(this);

		// behaviourNeutral
		new BehaviourNeutral(this);

		// behaviourOpportunity
		new BehaviourOpportunity(this);

		// behaviourChase
		new BehaviourChase(this);

		// behaviourCombat
		new BehaviourCombat(this);

		// attackResolution
		new AttackResolution(this);

		// tier1HerbivoreController
		new Tier1HerbivoreController(this);

		// detectionGlow
		new DetectionGlow(this);

		// squashStretch
		new SquashStretch(this);

		// atmosphereDepth
		new AtmosphereDepth(this);

		// movementDust
		new MovementDust(this);

		/* START-USER-CTR-CODE */
		this.play("tier1herb_idle", true);
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
