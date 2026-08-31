
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CorpsePickup extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			const player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
			if (!player) return;

			const playerBody = player;
			const corpse = this.gameObject;

			corpse.setData('type', 'corpse');
			corpse.setData('isHeld', false);

			this.scene.physics.add.overlap(playerBody, corpse, () => {
				if (corpse.getData('pickupDisabled')) return;
				if (corpse.getData('isHeld')) return;
				const inv = this.scene.playerInventory;
				if (inv && !inv.isFull()) {
					inv.addItem('corpse');
					corpse.destroy();
				}
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
