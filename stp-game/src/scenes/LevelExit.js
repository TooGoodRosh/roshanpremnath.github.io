
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LevelExit extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Ensure the parent GameObject has a static physics body to overlap with
		if (!this.gameObject.body) {
			this.scene.physics.add.existing(this.gameObject, true);
		}

		// You should add a User Property named 'targetScene' to this ScriptNode in Phaser Editor.
		// If you forget, we'll try to auto-detect the next level or default to "Level1".
		let nextLevel = "Level1";
		if (this.scene.scene.key === "Level1") nextLevel = "Level2";
		else if (this.scene.scene.key === "Level2") nextLevel = "Level3";

		this.targetScene = this.targetScene || nextLevel;

		this.scene.events.once('create', () => {
			const player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
			if (!player) return;

			this.scene.physics.add.overlap(player, this.gameObject, () => {
				this.triggerExit(player);
			});
		});
	}

	triggerExit(player) {
		if (player.getData('isTransitioning') || player.getData('isDead')) return;

		player.setData('isTransitioning', true);
		if (player.body) player.body.setVelocity(0, 0);

		// Clear the saved inventory so the next puzzle room starts fresh
		this.scene.game.registry.remove('savedInventory');

		this.scene.game.registry.remove('activeCheckpoint');
		this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
		this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
			this.scene.globalEntities = [];
			this.scene.globalObstacles = [];
			this.scene.creatureObstacles = [];
			this.scene.scene.start(this.targetScene);
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
