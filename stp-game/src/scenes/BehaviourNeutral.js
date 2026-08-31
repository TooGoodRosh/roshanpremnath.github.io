
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourNeutral extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.moveSpeed = 60;
		this.loiterRadius = 150;
		this.directionChangeTimer = 0;
		this.directionChangeInterval = 2000;
		this.homePosition = { x: this.gameObject.x, y: this.gameObject.y };
		this.currentDirection = new Phaser.Math.Vector2(0, 0);
		this.active = false;
		this.pauseDuration = 1200;
		this.pauseTimer = 0;
		this.pausing = false;
		this.returnPauseDuration = 1000;
		this.returnPauseTimer = 0;
		this.returnPausing = false;
		this.bounceTimer = 0;
		this.gameObject.setData('returning', false);
		this.gameObject._behaviourNeutral = this;
		this.roaming = false;
	}

	onActivate() {
		if (this.roaming) {
			this.homePosition = { x: this.gameObject.x, y: this.gameObject.y };
		}
		this.active = true;
		this.pausing = false;
		this.pauseTimer = 0;
		this.returnPausing = false;
		this.returnPauseTimer = 0;
		this.bounceTimer = 0;
		this.gameObject.setData('returning', false);
		this.pickNewDirection();
	}

	onDeactivate() {
		this.active = false;
		if (this.gameObject && this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	update() {
		const isCurrentState = this.gameObject._stateManager?.currentState === 'neutral';

		if (!isCurrentState) return;

		if (!this.active) {
			this.onActivate();
			return;
		}

		this.directionChangeTimer += this.scene.game.loop.delta;

		const distFromHome = Phaser.Math.Distance.Between(
			this.gameObject.x, this.gameObject.y,
			this.homePosition.x, this.homePosition.y
		);

		const returning = this.gameObject.getData('returning') ?? false;

		if (returning) {
			if (distFromHome < 20) {
				this.gameObject.setData('returning', false);
				this.returnPausing = false;
				this.returnPauseTimer = 0;
				this.pickNewDirection();
			} else {
				if (!this.returnPausing) {
					this.returnPausing = true;
					this.returnPauseTimer = 0;
				}

				this.returnPauseTimer += this.scene.game.loop.delta;

				if (this.returnPauseTimer < this.returnPauseDuration) {
					this.gameObject.body.setVelocity(0, 0);
					return;
				}

				const angle = Phaser.Math.Angle.Between(
					this.gameObject.x, this.gameObject.y,
					this.homePosition.x, this.homePosition.y
				);
				this.gameObject.body.setVelocity(
					Math.cos(angle) * this.moveSpeed,
					Math.sin(angle) * this.moveSpeed
				);
				this.directionChangeTimer = 0;
				return;
			}
		} else if (distFromHome > this.loiterRadius) {
			this.gameObject.setData('returning', true);
			return;
		} else {
			if (this.bounceTimer > 0) {
				this.bounceTimer -= this.scene.game.loop.delta;
			} else {
				// Loiter — bounce off world bounds or static obstacles
				const body = this.gameObject.body;
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
					const bounceTime = this.scene.creatureTuning?.globals?.bounceTimers?.loiter ?? 800;
					this.bounceTimer = bounceTime; // Commit to the bounce to prevent pinballing
				}
			}

			if (this.pausing) {
				this.gameObject.body.setVelocity(0, 0);
				this.pauseTimer += this.scene.game.loop.delta;
				if (this.pauseTimer >= this.pauseDuration) {
					this.pausing = false;
					this.pauseTimer = 0;
					this.pickNewDirection();
				}
				return;
			}

			if (this.directionChangeTimer >= this.directionChangeInterval) {
				this.directionChangeTimer = 0;
				this.pausing = true;
				this.pauseTimer = 0;
				return;
			}

			this.gameObject.body.setVelocity(
				this.currentDirection.x * this.moveSpeed,
				this.currentDirection.y * this.moveSpeed
			);
		}
	}

	pickNewDirection() {
		const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
		this.currentDirection.set(Math.cos(angle), Math.sin(angle));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
