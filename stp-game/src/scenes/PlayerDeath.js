
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import Corpse from "./Corpse.js";
/* END-USER-IMPORTS */

export default class PlayerDeath extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this._overlapTimer = 0;
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;
		if (this.gameObject.getData('isDead')) return;

		const dangerousTags = ['t1carn', 't2carn', 't1herb', 'mimic'];
		const entities = this.scene.globalEntities || [];
		const dangerousCreatures = entities.filter(child => {
			return child && child.active && child.getData && dangerousTags.includes(child.getData('type'));
		});

		let isOverlapping = false;
		let killer = null;

		for (const creature of dangerousCreatures) {
			// Ignore creatures that are distracted by eating or fighting
			const state = creature._stateManager?.currentState;
			if (state === 'combat' || state === 'opportunity' || state === 'eatCorpse') {
				continue;
			}

			if (this.scene.physics.overlap(this.gameObject, creature)) {
				isOverlapping = true;
				killer = creature;
				break;
			}
		}

		if (isOverlapping) {
			const threshold = this.scene.playerTuning?.health?.deathTimerThreshold ?? 500;
			
			this._overlapTimer += this.scene.game.loop.delta;
			if (this._overlapTimer >= threshold) {
				this.die(killer);
			}
		} else {
			this._overlapTimer = 0;
		}
	}

	die(killer) {
		this.gameObject.setData('isDead', true);
		this.scene.isPlayerDead = true; // Tell the CameraController to let go
		
		// Stop player movement immediately
		this.gameObject.body.setVelocity(0);

		// Freeze scene physics for dramatic "Game Over" effect
		this.scene.physics.pause();

		// Dramatic Camera FX
		const cam = this.scene.cameras.main;

		this.scene.tweens.add({
			targets: cam,
			zoom: cam.zoom * 1.3, // Zoom in by 30%
			duration: 1000,
			ease: 'Sine.easeInOut'
		});
		cam.pan(this.gameObject.x, this.gameObject.y, 1000, 'Sine.easeInOut');

		if (this.gameObject.anims && this.scene.anims.exists('player_death')) {
			this.gameObject.play('player_death', true);
			this.gameObject.once('animationcomplete-player_death', () => {
				this.spawnCorpseAndFeast();
			});
		} else {
			this.scene.time.delayedCall(1000, () => {
				this.spawnCorpseAndFeast();
			});
		}
	}

	spawnCorpseAndFeast() {
		// Hide and disable the player completely
		this.gameObject.setVisible(false);
		if (this.gameObject.body) this.gameObject.body.enable = false;

		// Remove player from global tracking so AI stops hunting them
		if (this.scene.globalEntities) {
			this.scene.globalEntities = this.scene.globalEntities.filter(e => e !== this.gameObject);
		}

		// Swap player with a fresh corpse
		const corpse = new Corpse(this.scene, this.gameObject.x, this.gameObject.y);
		this.scene.add.existing(corpse);
		
		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(corpse);

		// Unfreeze the game so the killer can feast!
		this.scene.physics.resume();

		// Wait 5 seconds to force the player to watch, then fade and restart
		this.scene.time.delayedCall(5000, () => {
			this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
			this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
				// Clear the inventory on death to prevent puzzle-breaking carry-over
				this.scene.game.registry.remove('savedInventory');
				
				this.scene.globalEntities = [];
				this.scene.globalObstacles = [];
				this.scene.creatureObstacles = [];
				this.scene.scene.restart();
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here