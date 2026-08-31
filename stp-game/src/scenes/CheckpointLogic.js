
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CheckpointLogic extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject.setData('type', 'checkpoint');
		
		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this._activated = false;
		this.scene.events.once('create', () => {
			this.player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
		});
	}

	update() {
		// Stop checking if this specific checkpoint was already hit
		if (this._activated) return;
		if (!this.gameObject || !this.gameObject.active) return;
		if (!this.player || !this.player.body || !this.player.active) return;

		// Check if the player touches the checkpoint sensor
		if (this.scene.physics.overlap(this.gameObject, this.player)) {
			this._activated = true;

			// Save the checkpoint coordinates globally
			this.scene.game.registry.set('activeCheckpoint', {
				x: this.gameObject.x,
				y: this.gameObject.y
			});

			console.log('Checkpoint saved at:', this.gameObject.x, this.gameObject.y);

			// Visual Feedback: Floating Text
			const text = this.scene.add.text(this.gameObject.x, this.gameObject.y - 40, "Checkpoint Reached!", {
				fontFamily: 'Arial',
				fontSize: '24px',
				color: '#ffffff',
				stroke: '#000000',
				strokeThickness: 4
			}).setOrigin(0.5);
			text.setDepth(100);

			// Float up and fade out over 1.5 seconds
			this.scene.tweens.add({
				targets: text,
				y: text.y - 60,
				alpha: 0,
				duration: 1500,
				ease: 'Power2',
				onComplete: () => text.destroy()
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here