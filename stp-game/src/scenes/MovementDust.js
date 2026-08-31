
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MovementDust extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {string} */
	dustColour = "#ffffff";
	/** @type {number} */
	dustScale = 1;

	/* START-USER-CODE */

	awake() {
		// =============================================
		// MOVEMENT DUST TUNING
		// =============================================
		this.tuning = {
			trailSpeedThreshold: 300,    // [px/s] Minimum speed to start kicking up dust
			trailDistance: 10,         // [px] Distance to travel before spawning the next puff
			impactSpeedThreshold: 30,  // [px/s] Speed required before a sudden stop triggers a burst
			stopSpeedThreshold: 20,    // [px/s] Speed at which we are considered "stopped"
			burstCount: 12,             // Particles to spawn on a hard stop/brake
			lifespan: 150,             // [ms] How long the dust lives
			gravityY: -40,             // Float upward slightly to look like rising dust
			endScaleMultiplier: 0.2    // Controls the final size of the dust particles (lower = smaller)
		};

		// Trackers
		this.lastVelocity = new Phaser.Math.Vector2(0, 0);
		this.lastEmitPos = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y);
		this.lastPos = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y);

		if (!this.scene.textures.exists('dust_particle')) {
			console.warn('MovementDust: "dust_particle" texture not found in cache!');
			return;
		}

		// Parse color (e.g. from string "#ffffff" to hex number 0xffffff)
		const tintColor = parseInt((this.dustColour || '#ffffff').replace('#', '0x'));

		// Create the standard Trail Particle Emitter
		this.emitter = this.scene.add.particles(0, 0, 'dust_particle', {
			scale: { start: 0.4 * this.dustScale, end: this.tuning.endScaleMultiplier * this.dustScale },
			alpha: { start: 0.3, end: 0 },
			lifespan: this.tuning.lifespan,
			gravityY: this.tuning.gravityY,
			speed: { min: 5, max: 20 },
			angle: { min: 0, max: 360 }, // Expand slightly outwards in all directions
			tint: tintColor,
			emitting: false // We will trigger emissions manually!
		});

		// Create a separate emitter for the directional brake burst
		this.brakeEmitter = this.scene.add.particles(0, 0, 'dust_particle', {
			scale: { start: 0.6 * this.dustScale, end: this.tuning.endScaleMultiplier * this.dustScale },
			alpha: { start: 0.4, end: 0 },
			lifespan: this.tuning.lifespan * 1.2,
			gravityY: this.tuning.gravityY,
			speed: {
				onEmit: () => {
					// Dynamically scale the particle speed based on the creature's momentum!
					const baseSpeed = this.currentBrakeSpeed || 200;
					return baseSpeed * Phaser.Math.FloatBetween(0.5, 1.5);
				}
			},
			tint: tintColor,
			angle: {
				onEmit: () => {
					// Dynamically calculate the angle spread every time it bursts
					return (this.currentBrakeAngle || 0) + Phaser.Math.FloatBetween(-35, 35);
				}
			},
			emitting: false
		});
	}

	update() {
		if (!this.emitter || !this.brakeEmitter || !this.gameObject || !this.gameObject.active) return;
		if (this.gameObject.getData('isDead') || this.gameObject.getData('isHeld')) return;

		// Keep the dust correctly sorted directly underneath the creature's feet!
		this.emitter.setDepth(this.gameObject.y - 1);
		this.brakeEmitter.setDepth(this.gameObject.y - 1);

		const body = this.gameObject.body;
		const dt = this.scene.game.loop.delta / 1000;

		let vx = 0;
		let vy = 0;

		// Safely get velocity from physics body OR positional delta
		if (body && body.enable !== false && body.velocity) {
			vx = body.velocity.x;
			vy = body.velocity.y;
		} else if (dt > 0) {
			vx = (this.gameObject.x - this.lastPos.x) / dt;
			vy = (this.gameObject.y - this.lastPos.y) / dt;
		}

		this.lastPos.set(this.gameObject.x, this.gameObject.y);

		const speed = Math.sqrt(vx * vx + vy * vy);
		const lastSpeed = this.lastVelocity.length();

		// 1. Trail Logic (Continuous Movement)
		if (speed > this.tuning.trailSpeedThreshold) {
			const distSinceLastEmit = Phaser.Math.Distance.BetweenPoints(this.lastPos, this.lastEmitPos);
			
			if (distSinceLastEmit >= this.tuning.trailDistance) {
				// Emit a particle exactly at the feet (assuming origin is 0.5, 1)
				this.emitter.emitParticleAt(this.gameObject.x, this.gameObject.y);
				this.lastEmitPos.set(this.gameObject.x, this.gameObject.y);
			}
		}

		// 2. Brake / Impact Logic (Sudden Stop)
		if (lastSpeed > this.tuning.impactSpeedThreshold && speed < this.tuning.stopSpeedThreshold) {
			// We just slammed on the brakes! Shoot particles in the direction we were moving!
			this.currentBrakeAngle = Phaser.Math.RadToDeg(Math.atan2(this.lastVelocity.y, this.lastVelocity.x));
			this.currentBrakeSpeed = lastSpeed; // Store the momentum to power the particle speed
			this.brakeEmitter.emitParticleAt(this.gameObject.x, this.gameObject.y, this.tuning.burstCount);
		}

		this.lastVelocity.set(vx, vy);
	}

	destroy() {
		// Prevent memory leaks if the creature is removed
		if (this.emitter) {
			this.emitter.destroy();
			this.emitter = null;
		}
		if (this.brakeEmitter) {
			this.brakeEmitter.destroy();
			this.brakeEmitter = null;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
