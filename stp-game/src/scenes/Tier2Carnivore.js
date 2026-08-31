
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import StateDecider from "./StateDecider.js";
import StateManager from "./StateManager.js";
import BehaviourEatCorpse from "./BehaviourEatCorpse.js";
import BehaviourChase from "./BehaviourChase.js";
import BehaviourFlee from "./BehaviourFlee.js";
import AttackResolution from "./AttackResolution.js";
import Tier2CarnivoreController from "./Tier2CarnivoreController.js";
import BehaviourPatrol from "./BehaviourPatrol.js";
import BehaviourCombat from "./BehaviourCombat.js";
import DetectionGlow from "./DetectionGlow.js";
import SquashStretch from "./SquashStretch.js";
import AtmosphereDepth from "./AtmosphereDepth.js";
import YSort from "./YSort.js";
import MovementDust from "./MovementDust.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2Carnivore extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "spritesheet_car01_idle1", frame ?? 0);

		this.scaleX = 0.2;
		this.scaleY = 0.2;
		this.setOrigin(0.5, 1);
		scene.physics.add.existing(this, false);
		this.body.setSize(730, 700, false);

		// detectionRadius
		new DetectionRadius(this);

		// stateDecider
		new StateDecider(this);

		// stateManager
		new StateManager(this);

		// behaviourEatCorpse
		new BehaviourEatCorpse(this);

		// behaviourChase
		new BehaviourChase(this);

		// behaviourFlee
		new BehaviourFlee(this);

		// attackResolution
		new AttackResolution(this);

		// tier2CarnivoreController
		new Tier2CarnivoreController(this);

		// behaviourPatrol
		new BehaviourPatrol(this);

		// behaviourCombat
		new BehaviourCombat(this);

		// detectionGlow
		new DetectionGlow(this);

		// squashStretch
		new SquashStretch(this);

		// atmosphereDepth
		new AtmosphereDepth(this);

		// ySort
		const ySort = new YSort(this);

		// movementDust
		new MovementDust(this);

		// ySort (prefab fields)
		ySort.isStatic = false;

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
