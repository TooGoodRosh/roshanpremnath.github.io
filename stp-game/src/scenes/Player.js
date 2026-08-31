
// You can write more code here

/* START OF COMPILED CODE */

import PlayerInventory from "./PlayerInventory.js";
import PlayerMovement from "./PlayerMovement.js";
import PlayerThrow from "./PlayerThrow.js";
import SquashStretch from "./SquashStretch.js";
import ThrowArcIndicator from "./ThrowArcIndicator.js";
import PlayerDeath from "./PlayerDeath.js";
import PlayerTuning from "./PlayerTuning.js";
import AtmosphereDepth from "./AtmosphereDepth.js";
import YSort from "./YSort.js";
import PlayerSpawn from "./PlayerSpawn.js";
import MovementDust from "./MovementDust.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Player extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_player_01", frame);

		this.scaleX = 0.2;
		this.scaleY = 0.2;
		this.setOrigin(0.5, 1);
		scene.physics.add.existing(this, false);
		this.body.setSize(300, 580, false);
		this.play("player_idle");

		// playerInventory
		new PlayerInventory(this);

		// playerMovement
		new PlayerMovement(this);

		// playerThrow
		new PlayerThrow(this);

		// squashStretch
		new SquashStretch(this);

		// throwArcIndicator
		new ThrowArcIndicator(this);

		// playerDeath
		new PlayerDeath(this);

		// playerTuning
		new PlayerTuning(this);

		// atmosphereDepth
		new AtmosphereDepth(this);

		// ySort
		const ySort = new YSort(this);

		// playerSpawn
		new PlayerSpawn(this);

		// movementDust
		const movementDust = new MovementDust(this);

		// ySort (prefab fields)
		ySort.isStatic = false;

		// movementDust (prefab fields)
		movementDust.dustColour = "#ffffffff";
		movementDust.dustScale = 0.5;

		/* START-USER-CTR-CODE */
		this.setData('type', 'player');
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
