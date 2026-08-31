
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourOpportunity extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.moveSpeed = 80;
		this.eatDuration = 2000;
		this.target = null;
		this.eating = false;
		this.eatTimer = 0;
		this.active = false;
		this.gameObject._behaviourOpportunity = this;
	}

	onActivate() {
		this.active = true;
		this.eating = false;
		this.eatTimer = 0;
		this.findTarget();
	}

	onDeactivate() {
		this.active = false;
		this.target = null;
		this.eating = false;
		if (this.gameObject && this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	findTarget() {
		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const foodEntity = detected.find(d => d.tag === 'food');
		this.target = foodEntity ? foodEntity.entity : null;
	}

	update() {
		if (!this.active || !this.target || !this.target.active) {
			if (this.active && !this.eating) this.findTarget();
			return;
		}

		if (this.eating) {
			this.eatTimer += this.scene.game.loop.delta;
			this.gameObject.body.setVelocity(0, 0);

			// Cancel eating if fruit has moved too far
			const eatDist = Phaser.Math.Distance.Between(
				this.gameObject.x, this.gameObject.y,
				this.target.x, this.target.y
			);
			if (eatDist > 30) {
				this.eating = false;
				this.eatTimer = 0;
				return;
			}

			if (this.eatTimer >= this.eatDuration) {
				this.target.destroy();
				this.target = null;
				this.eating = false;
				// Notify state decider to re-evaluate
				if (this.gameObject._stateDecider) {
					this.gameObject._stateDecider.evaluate(
						this.gameObject._detectionRadius?.detected ?? []
					);
				}
			}
			return;
		}

		const dist = Phaser.Math.Distance.Between(
			this.gameObject.x, this.gameObject.y,
			this.target.x, this.target.y
		);

		if (dist < 10) {
			this.eating = true;
			this.eatTimer = 0;
			this.gameObject.body.setVelocity(0, 0);
		} else {
			// Always track current target position
			const angle = Phaser.Math.Angle.Between(
				this.gameObject.x, this.gameObject.y,
				this.target.x, this.target.y
			);
			this.gameObject.body.setVelocity(
				Math.cos(angle) * this.moveSpeed,
				Math.sin(angle) * this.moveSpeed
			);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
