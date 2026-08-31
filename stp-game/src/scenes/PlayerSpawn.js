
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerSpawn extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Find the target landing spot
		let targetX = this.gameObject.x;
		let targetY = this.gameObject.y;
		
		const checkpoint = this.scene.game.registry.get('activeCheckpoint');
		if (checkpoint) {
			targetX = checkpoint.x;
			targetY = checkpoint.y;
		}

		// Save the target so CameraController knows where to look
		this.gameObject.setData('spawnTarget', { x: targetX, y: targetY });
		
		// Lock player actions and tell CameraController we are spawning
		this.gameObject.setData('isTransitioning', true);
		this.gameObject.setData('isSpawning', true);
		
		// Teleport player high into the air and disable physics so they don't hit trees mid-drop
		this.gameObject.setPosition(targetX, targetY - 1200);
		if (this.gameObject.body) this.gameObject.body.enable = false;
		
		this.scene.events.once('create', () => {
			// Check if the main menu is active (so we don't drop during the diorama)
			if (this.scene.game.registry.get('isMenuOpen')) {
				this.scene.game.events.once('play_button_pressed', () => {
					this.executeDrop(targetX, targetY);
				});
			} else {
				// Drop immediately (used for normal level transitions and respawns)
				this.executeDrop(targetX, targetY);
			}
		});
	}

	executeDrop(targetX, targetY) {
		this.scene.tweens.add({
			targets: this.gameObject,
			y: targetY,
			duration: 800,
			ease: 'Cubic.easeIn',
			onComplete: () => {
				// Unlock player actions and re-enable physics
				this.gameObject.setData('isTransitioning', false);
				this.gameObject.setData('isSpawning', false);
				if (this.gameObject.body) {
					this.gameObject.body.enable = true;
					this.gameObject.body.reset(targetX, targetY);
				}
				
				// Tell camera to start following now that we've landed
				this.scene.cameras.main.startFollow(this.gameObject, true, 0.08, 0.08);
			}
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
