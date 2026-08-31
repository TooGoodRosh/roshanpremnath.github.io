
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerInventory extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.items = [];
		this.maxCapacity = 1;
		this.selectedIndex = 0;
		this.scene.playerInventory = this;

		// Load carried items from the previous level (if any)
		const savedItems = this.scene.game.registry.get('savedInventory');
		if (savedItems && Array.isArray(savedItems)) {
			this.items = [...savedItems];
		}
	}

	addItem(itemType) {
		if (this.items.length >= this.maxCapacity) {
			console.log('Inventory full');
			return false;
		}
		this.items.push(itemType);
		console.log('Item added:', itemType, '| Inventory:', this.items);

		// Trigger pickup animation safely
		if (this.gameObject.anims && this.scene.anims.exists('player_pickup')) {
			this.gameObject.play('player_pickup');
			this.gameObject.setData('isPickingUp', true);
			this.gameObject.off('animationcomplete-player_pickup'); // Clear previous listeners if picking up rapidly
			this.gameObject.once('animationcomplete-player_pickup', () => {
				this.gameObject.setData('isPickingUp', false);
			});
		} else {
			const loadedAnims = Array.from(this.scene.anims.anims.keys()).join(', ');
			console.warn('Pickup animation missing!');
			console.warn(`Phaser currently only knows about these animations: [${loadedAnims}]`);
		}

		return true;
	}

	removeItem() {
		if (this.items.length === 0) return null;
		const item = this.items.splice(this.selectedIndex, 1)[0];
		this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, this.items.length - 1));
		return item;
	}

	cycleItem() {
		if (this.items.length === 0) return;
		this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
		console.log('Selected item:', this.getCurrentItem());
	}

	getCurrentItem() {
		return this.items[this.selectedIndex] ?? null;
	}

	isFull() {
		return this.items.length >= this.maxCapacity;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
