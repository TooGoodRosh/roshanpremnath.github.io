
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourChase extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.moveSpeed = 120;
		this.targetTags = ['t2herb'];
		this.target = null;
		this.active = false;
		this.gameObject._behaviourChase = this;
	}

	onActivate() {
		this.active = true;
		this.findTarget();
	}

	onDeactivate() {
		this.active = false;
		this.target = null;
		if (this.gameObject && this.gameObject.body) {
			this.gameObject.body.setVelocity(0, 0);
		}
	}

	findTarget() {
		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const targetEntity = detected.find(d => this.targetTags.includes(d.tag));
		this.target = targetEntity ? targetEntity.entity : null;
	}

	update() {
		if (!this.active) return;

		if (!this.target || !this.target.active) {
			this.findTarget();
			if (!this.target) {
				this.gameObject.body.setVelocity(0, 0);
				return;
			}
		}

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

/* END OF COMPILED CODE */

// You can write more code here
