
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class DetectionRadius extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.radius = 300;
		this.detected = [];
		this.previousTags = '';

		const myX = this.gameObject.body ? this.gameObject.body.center.x : this.gameObject.x;
		const myY = this.gameObject.body ? this.gameObject.body.center.y : this.gameObject.y;

		// Create zone for visual reference only — detection done via distance
		this.zone = this.scene.add.zone(
			myX,
			myY,
			this.radius * 2,
			this.radius * 2
		);

		this.gameObject._detectionRadius = this;
	}

	update() {
		const myX = this.gameObject.body ? this.gameObject.body.center.x : this.gameObject.x;
		const myY = this.gameObject.body ? this.gameObject.body.center.y : this.gameObject.y;

		// Keep zone centered on creature
		this.zone.setPosition(myX, myY);

		// Scan all detectable entities by distance every frame
		const detectableTypes = ['player', 'food', 'corpse', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'];

		const newDetected = [];
		const entities = this.scene.globalEntities || [];

		entities.forEach(child => {
			if (!child || !child.active || !child.getData) return;
			const tag = child.getData('type');
			if (!tag || !detectableTypes.includes(tag)) return;
			if (child === this.gameObject) return; // ignore self

			const childX = child.body ? child.body.center.x : child.x;
			const childY = child.body ? child.body.center.y : child.y;

			// --- CPU OPTIMIZATION ---
			// Use DistanceSquared to avoid heavy Math.sqrt() calculations on the CPU
			const distSq = Phaser.Math.Distance.Squared(
				myX, myY,
				childX, childY
			);

			if (distSq <= (this.radius * this.radius)) {
				newDetected.push({ tag, entity: child });
			}
		});

		this.detected = newDetected;

		// Only notify StateDecider if detected tags changed
		const currentTags = newDetected.map(d => d.tag).sort().join(',');
		if (currentTags !== this.previousTags) {
			this.previousTags = currentTags;
			this.onDetectionChanged();
		}
	}

	onDetectionChanged() {
		if (this.gameObject._stateDecider) {
			this.gameObject._stateDecider.evaluate(this.detected);
		}
	}

	getDetectedTags() {
		return this.detected.map(d => d.tag);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
