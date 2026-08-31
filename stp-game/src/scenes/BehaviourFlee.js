
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourFlee extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.moveSpeed = 160;
		this.boundaryMargin = 32;
		this.active = false;
		this.threatPosition = { x: 0, y: 0 };
		this.fleeDuration = 2000;
		this.fleeTimer = 0;
		this.fleeComplete = false;
		this.currentDirection = { x: 0, y: 0 };
		this.bounceTimer = 0;
		this.gameObject._behaviourFlee = this;
	}

	onActivate() {
		this.active = true;
		this.fleeTimer = 0;
		this.bounceTimer = 0;
		this.fleeComplete = false;
		this.updateThreatPosition();
		this.flee();
	}

	onDeactivate() {
		this.active = false;
		if (this.gameObject && this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	updateThreatPosition() {
		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const threat = detected.find(d => d.tag === 'player' || d.tag === 't2carn' || d.tag === 't1carn' || d.tag === 't1herb');
		if (threat && threat.entity) {
			this.threatPosition = { x: threat.entity.x, y: threat.entity.y };
		}
	}

	flee() {
		if (!this.gameObject || !this.gameObject.active || !this.gameObject.body) return;

		if (this.bounceTimer > 0) {
			this.bounceTimer -= this.scene.game.loop.delta;
		} else {
			const body = this.gameObject.body;
			// Bounce off walls while fleeing
			const blockedLeft = body.blocked.left;
			const blockedRight = body.blocked.right;
			const blockedUp = body.blocked.up;
			const blockedDown = body.blocked.down;

			let bounced = false;
			if ((blockedLeft && this.currentDirection.x < 0) || (blockedRight && this.currentDirection.x > 0)) {
				this.currentDirection.x *= -1;
				bounced = true;
			}
			if ((blockedUp && this.currentDirection.y < 0) || (blockedDown && this.currentDirection.y > 0)) {
				this.currentDirection.y *= -1;
				bounced = true;
			}

			if (bounced) {
				const bounceTime = this.scene.creatureTuning?.globals?.bounceTimers?.flee ?? 1200;
				this.bounceTimer = bounceTime; // Panic ricochet long enough to prevent U-turning back into the wall!
			} else {
				const angle = Phaser.Math.Angle.Between(
					this.threatPosition.x, this.threatPosition.y,
					this.gameObject.x, this.gameObject.y
				);
				this.currentDirection.x = Math.cos(angle);
				this.currentDirection.y = Math.sin(angle);
			}
		}

		let fleeX = this.currentDirection.x;
		let fleeY = this.currentDirection.y;

		// Boundary aware fleeing
		if (this.scene.dioramaBounds) {
			const bounds = this.scene.dioramaBounds.getBounds();
			const nearLeft = this.gameObject.x - bounds.left < this.boundaryMargin;
			const nearRight = bounds.right - this.gameObject.x < this.boundaryMargin;
			const nearTop = this.gameObject.y - bounds.top < this.boundaryMargin;
			const nearBottom = bounds.bottom - this.gameObject.y < this.boundaryMargin;

			if ((nearLeft && fleeX < 0) || (nearRight && fleeX > 0)) fleeX = 0;
			if ((nearTop && fleeY < 0) || (nearBottom && fleeY > 0)) fleeY = 0;
		}

		this.gameObject.body.setVelocity(fleeX * this.moveSpeed, fleeY * this.moveSpeed);
	}

	update() {
		if (!this.active || !this.gameObject || !this.gameObject.active || !this.gameObject.body) return;

		this.fleeTimer += this.scene.game.loop.delta;

		if (this.fleeTimer >= this.fleeDuration) {
			if (!this.fleeComplete) {
				this.fleeComplete = true;
				this.gameObject.body.setVelocity(0, 0);
				this.gameObject._stateManager.currentState = null;
				
				if (this.gameObject._stateDecider) {
					this.gameObject._stateDecider.evaluate(this.gameObject._detectionRadius?.detected ?? []);
				} else {
					const defaultState = this.gameObject.getData('defaultState') ?? 'neutral';
					this.gameObject._stateManager.switchState(defaultState);
				}
			}
			return;
		}

		this.updateThreatPosition();
		this.flee();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
