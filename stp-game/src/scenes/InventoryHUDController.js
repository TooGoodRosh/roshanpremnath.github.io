
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class InventoryHUDController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	itemIcon;

	/* START-USER-CODE */

	awake() {
		// Ensure this is always drawn on top of the world (YSort won't bury it)
		this.gameObject.setDepth(10000);

		// Find the player dynamically on create so we don't need a strict parent-child hierarchy
		this.scene.events.once('create', () => {
			this.player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
		});

		// We get the globally-scoped inventory from the scene.
		this.inventory = this.scene.playerInventory;
		if (!this.inventory) {
			// This might happen if the script execution order is wrong, but it's unlikely with the current setup.
			this.scene.events.once('create', () => this.inventory = this.scene.playerInventory);
		}

		// These are assigned automatically by Phaser Editor if you've set their scope to 'CLASS' in the prefab.
		if (!this.gameObject.itemIcon) {
			console.error("InventoryHUDController: 'itemIcon' is not assigned. Please check its name and scope in the InventoryHUD prefab.");
		}
	}

	update() {
		// Safety check: Prevent accidentally hiding the Player if attached incorrectly!
		if (this.gameObject.getData && this.gameObject.getData('type') === 'player') {
			console.error("InventoryHUDController is attached to the Player! Please remove it from the Player prefab and attach it ONLY to the InventoryHUD prefab.");
			return;
		}

		if (!this.inventory || !this.player || this.player.getData('isDead')) {
			if (this.gameObject.visible) {
				this.gameObject.setVisible(false);
			}
			return;
		}

		const isFull = this.inventory.isFull();
		const isAiming = this.player._playerThrow?.isAiming ?? false;

		// The HUD should only be visible when the inventory is full AND the player is not currently aiming.
		// The throw arc indicator will take over when aiming.
		const shouldShow = isFull && !isAiming;

		// Only run the logic if the visibility needs to change.
		if (shouldShow !== this.gameObject.visible) {
			if (shouldShow) {
				// Snap instantly to the player when it first appears so it doesn't fly across the screen
				this.gameObject.setPosition(this.player.x - 80, this.player.y - 120);
			}
			this.gameObject.setVisible(shouldShow);
		}

		// Smooth follow with lag when visible
		if (this.gameObject.visible) {
			// Constantly ensure the icon matches the current item
			const itemType = this.inventory.getCurrentItem();
			const textureKey = itemType === 'corpse' ? 'sprite_corpse' : 'sprite_fruit';
			if (this.gameObject.itemIcon.texture.key !== textureKey) {
				this.gameObject.itemIcon.setTexture(textureKey);
				// Adjust scale dynamically since the corpse asset is much larger than the fruit
				this.gameObject.itemIcon.setScale(itemType === 'corpse' ? 0.075 : 0.05);
			}

			const targetX = this.player.x - 80;
			const targetY = this.player.y - 120;
			this.gameObject.x += (targetX - this.gameObject.x) * 0.15;
			this.gameObject.y += (targetY - this.gameObject.y) * 0.15;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here