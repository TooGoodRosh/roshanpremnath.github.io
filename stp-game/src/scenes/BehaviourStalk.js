
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourStalk extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.stalkDistance = 200;
		this.moveSpeed = 100;
		this.patienceThreshold = 3000;
		this.patienceTimer = 0;
		this.active = false;
		this.gameObject._behaviourStalk = this;
	}

	onActivate() {
		this.active = true;
		this.patienceTimer = 0;
	}

	onDeactivate() {
		this.active = false;
		this.patienceTimer = 0;
		if (this.gameObject && this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	update() {
		if (!this.active) return;

		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const playerEntity = detected.find(d => d.tag === 'player');

		if (!playerEntity || !playerEntity.entity.active) {
			this.gameObject.body.setVelocity(0, 0);
			return;
		}

		const player = playerEntity.entity;
		const dist = Phaser.Math.Distance.Between(
			this.gameObject.x, this.gameObject.y,
			player.x, player.y
		);

		// Check if player is stationary
		const playerBody = player.body;
		const playerMoving = playerBody && (Math.abs(playerBody.velocity.x) > 5 || Math.abs(playerBody.velocity.y) > 5);

		if (!playerMoving) {
			this.patienceTimer += this.scene.game.loop.delta;
			if (this.patienceTimer >= this.patienceThreshold) {
				// Trigger charge
				if (this.gameObject._stateDecider) {
					this.gameObject._stateDecider.forceState('charge');
				}
				return;
			}
		} else {
			this.patienceTimer = 0;
		}

		// Maintain stalk distance
		const angle = Phaser.Math.Angle.Between(
			this.gameObject.x, this.gameObject.y,
			player.x, player.y
		);

		if (dist > this.stalkDistance + 20) {
			// Too far — move closer
			this.gameObject.body.setVelocity(
				Math.cos(angle) * this.moveSpeed,
				Math.sin(angle) * this.moveSpeed
			);
		} else if (dist < this.stalkDistance - 20) {
			// Too close — move away
			this.gameObject.body.setVelocity(
				-Math.cos(angle) * this.moveSpeed,
				-Math.sin(angle) * this.moveSpeed
			);
		} else {
			// In range — orbit slowly
			this.gameObject.body.setVelocity(
				Math.cos(angle + Math.PI / 2) * (this.moveSpeed * 0.3),
				Math.sin(angle + Math.PI / 2) * (this.moveSpeed * 0.3)
			);
		}
	}
}

/* END OF COMPILED CODE */

// You can write more code here
