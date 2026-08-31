
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourCharge extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.chargeSpeed = 400;
		this.chargeDuration = 800;
		this.chargeTimer = 0;
		this.chargeDirection = { x: 0, y: 0 };
		this.bounceTimer = 0;
		this.active = false;
		this.gameObject._behaviourCharge = this;
	}

	onActivate() {
		this.active = true;
		this.chargeTimer = 0;
		this.bounceTimer = 0;

		// Lock charge direction toward player at moment of activation
		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const playerEntity = detected.find(d => d.tag === 'player');

		if (playerEntity && playerEntity.entity.active) {
			const angle = Phaser.Math.Angle.Between(
				this.gameObject.x, this.gameObject.y,
				playerEntity.entity.x, playerEntity.entity.y
			);
			this.chargeDirection = {
				x: Math.cos(angle),
				y: Math.sin(angle)
			};
		} else {
			this.chargeDirection = { x: 1, y: 0 };
		}

		this.gameObject.body.setVelocity(
			this.chargeDirection.x * this.chargeSpeed,
			this.chargeDirection.y * this.chargeSpeed
		);
	}

	onDeactivate() {
		this.active = false;
		if (this.gameObject && this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	update() {
		if (!this.active) return;

		this.chargeTimer += this.scene.game.loop.delta;

		if (this.chargeTimer >= this.chargeDuration) {
			this.gameObject.body.setVelocity(0, 0);
			if (this.gameObject._stateDecider) {
				this.gameObject._stateDecider.evaluate(
					this.gameObject._detectionRadius?.detected ?? []
				);
			}
			this.active = false;
			return;
		}

		if (this.bounceTimer > 0) {
			this.bounceTimer -= this.scene.game.loop.delta;
		} else {
			// Bounce off walls while charging
			const body = this.gameObject.body;
			if (body) {
				const blockedLeft = body.blocked.left;
				const blockedRight = body.blocked.right;
				const blockedUp = body.blocked.up;
				const blockedDown = body.blocked.down;

				let bounced = false;
				if ((blockedLeft && this.chargeDirection.x < 0) || (blockedRight && this.chargeDirection.x > 0)) {
					this.chargeDirection.x *= -1;
					bounced = true;
				}
				if ((blockedUp && this.chargeDirection.y < 0) || (blockedDown && this.chargeDirection.y > 0)) {
					this.chargeDirection.y *= -1;
					bounced = true;
				}
				if (bounced) {
					const bounceTime = this.scene.creatureTuning?.globals?.bounceTimers?.charge ?? 600;
					this.bounceTimer = bounceTime; // Commit to the bounce to prevent pinballing
				}
			}
		}

		this.gameObject.body.setVelocity(
			this.chargeDirection.x * this.chargeSpeed,
			this.chargeDirection.y * this.chargeSpeed
		);
	}
}

/* END OF COMPILED CODE */

// You can write more code here
