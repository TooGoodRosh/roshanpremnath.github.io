
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SquashStretch extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	update() {
		if (!this.gameObject) return;

		// Lazy initialization ensures this works even for objects dynamically spawned mid-game!
		if (!this._initialized) {
			this.idleThreshold = 10;
			this.maxSpeed = 300;
			this.impactTriggerDelta = 250;
			this.impactStopSpeed = 80;
			this.movementStretchMin = 0.015;
			this.movementStretchMax = 0.05;
			this.movementTweenDuration = 240;
			this.baseScale = new Phaser.Math.Vector2(this.gameObject.scaleX, this.gameObject.scaleY);
			this.idleTween = null;
			this.movementTween = null;
			this.impactTween = null;
			this.lastVelocity = new Phaser.Math.Vector2();
			this._lastPos = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y);
			this.isImpacting = false;
			this.state = 'idle';
			this._initialized = true;

			this.startIdleBreathing();
		}
		
		if (this.gameObject.getData('isDead')) {
			this.stopIdleBreathing();
			this.stopMovementTween();
			return;
		}

		const body = this.gameObject.body;
		const dt = this.scene.game.loop.delta / 1000;

		let vx = 0;
		let vy = 0;

		// Use physics velocity if body is active, otherwise fallback to true positional tracking!
		if (this.gameObject.getData('isHeld')) {
			// Do not stretch wildly while carried in the player's hands
		} else if (body && body.enable !== false && body.velocity) {
			vx = body.velocity.x;
			vy = body.velocity.y;
		} else if (dt > 0 && this._lastPos) {
			vx = (this.gameObject.x - this._lastPos.x) / dt;
			vy = (this.gameObject.y - this._lastPos.y) / dt;
		}

		if (this._lastPos) this._lastPos.set(this.gameObject.x, this.gameObject.y);

		// --- ANTI-CLIPPING FIX ---
		if (body && body.blocked && (body.blocked.left || body.blocked.right || body.blocked.up || body.blocked.down)) {
			this.stopMovementTween();
			this.stopImpactTween();
			this.resetScale();
			this.lastVelocity.set(vx, vy);
			return;
		}

		const speed = Math.sqrt(vx * vx + vy * vy);
		const lastSpeed = this.lastVelocity.length();
		const speedDelta = Math.abs(speed - lastSpeed);
		const newState = speed < this.idleThreshold ? 'idle' : 'moving';

		const stopImpact = !this.isImpacting && this.state === 'moving' && newState === 'idle' && lastSpeed > this.impactStopSpeed;
		
		let isImpact = false;
		let impactSpeed = 0;

		if (stopImpact) {
			isImpact = true;
			impactSpeed = lastSpeed;
		} else if (!this.isImpacting && speedDelta > this.impactTriggerDelta && speed < lastSpeed) {
			isImpact = true;
			impactSpeed = Math.max(lastSpeed, speedDelta);
		}

		if (isImpact) {
			// Dynamic intensity based on standard movement speed (~200px/s)
			// A drop from the sky yields a massive speed and will cleanly cap out at a 4x multiplier.
			const intensity = Phaser.Math.Clamp(impactSpeed / 200, 1, 4);
			this.triggerImpact(intensity);
		}

		if (this.isImpacting) {
			this.lastVelocity.set(vx, vy);
			return;
		}

		if (newState !== this.state) {
			this.state = newState;
			if (newState === 'idle') {
				this.startIdleBreathing();
			} else {
				this.stopIdleBreathing();
			}
		}

		if (this.state === 'moving') {
			this.updateMovementStretch(speed);
		}

		this.lastVelocity.set(vx, vy);
	}

	startIdleBreathing() {
		if (this.idleTween || !this.gameObject) return;

		this.stopMovementTween();
		this.stopImpactTween();

		this.idleTween = this.scene.tweens.add({
			targets: this.gameObject,
			scaleX: this.baseScale.x * 0.99,
			scaleY: this.baseScale.y * 1.01,
			ease: 'Sine.easeInOut',
			duration: 1800,
			yoyo: true,
			repeat: -1
		});
	}

	stopIdleBreathing() {
		if (this.idleTween) {
			this.idleTween.stop();
			this.idleTween = null;
		}
		this.resetScale();
	}

	updateMovementStretch(speed) {
		const ratio = Phaser.Math.Clamp(speed / this.maxSpeed, 0, 1);
		const stretch = this.movementStretchMin + ratio * this.movementStretchMax;
		const targetX = this.baseScale.x * (1 + stretch);
		const targetY = this.baseScale.y * (1 - stretch);

		if (this.movementTween) return;

		this.stopIdleBreathing();
		this.stopImpactTween();

		this.movementTween = this.scene.tweens.add({
			targets: this.gameObject,
			scaleX: targetX,
			scaleY: targetY,
			ease: 'Quad.easeOut',
			duration: this.movementTweenDuration,
			overwrite: true,
			onComplete: () => {
				this.movementTween = null;
			}
		});
	}

	triggerImpact(intensity = 1) {
		if (this.isImpacting) return;

		this.isImpacting = true;
		this.stopIdleBreathing();
		this.stopMovementTween();
		this.stopImpactTween();

		const absX = Math.abs(this.lastVelocity.x);
		const absY = Math.abs(this.lastVelocity.y);
		const horizontalImpact = absX >= absY;

		// Calculate dynamic squash/stretch bounds based on intensity
		const flex = 0.15 * intensity;
		const squash = Math.max(0.2, 1 - flex);
		const stretch = 1 + flex;

		let impactX;
		let impactY;
		if (horizontalImpact) {
			impactX = this.baseScale.x * squash;
			impactY = this.baseScale.y * stretch;
		} else {
			impactX = this.baseScale.x * stretch;
			impactY = this.baseScale.y * squash;
		}

		const impactTween1 = this.scene.tweens.add({
			targets: this.gameObject,
			scaleX: impactX,
			scaleY: impactY,
			ease: 'Quad.easeOut',
			duration: 100,
			onComplete: () => {
				const impactTween2 = this.scene.tweens.add({
					targets: this.gameObject,
					scaleX: this.baseScale.x,
					scaleY: this.baseScale.y,
					ease: 'Quad.easeOut',
					duration: 180,
					onComplete: () => {
						this.isImpacting = false;
						this.impactTween = null;
					}
				});
				this.impactTween = impactTween2;
			}
		});
		this.impactTween = impactTween1;
	}

	stopMovementTween() {
		if (this.movementTween) {
			this.movementTween.stop();
			this.movementTween = null;
		}
	}

	stopImpactTween() {
		if (this.impactTween) {
			this.impactTween.stop();
			this.impactTween = null;
		}
	}

	resetScale() {
		if (this.gameObject && this.baseScale) {
			this.gameObject.scaleX = this.baseScale.x;
			this.gameObject.scaleY = this.baseScale.y;
		}
	}

	destroy() {
		this.stopIdleBreathing();
		this.stopMovementTween();
		this.stopImpactTween();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
