
// You can write more code here

/* START OF COMPILED CODE */

import InventoryHUDController from "./InventoryHUDController.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class InventoryHUD extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 0, y ?? 0);

		// ellipse_1
		const ellipse_1 = scene.add.ellipse(0, 0, 128, 128);
		ellipse_1.scaleX = 0.5;
		ellipse_1.scaleY = 0.5;
		ellipse_1.isFilled = true;
		ellipse_1.fillColor = 0;
		ellipse_1.fillAlpha = 0.25;
		this.add(ellipse_1);

		// itemIcon
		const itemIcon = scene.add.image(0, 0, "sprite_fruit");
		itemIcon.scaleX = 0.5;
		itemIcon.scaleY = 0.5;
		this.add(itemIcon);

		// inventoryHUDController
		const inventoryHUDController = new InventoryHUDController(this);

		this.ellipse_1 = ellipse_1;
		this.itemIcon = itemIcon;
		this.inventoryHUDController = inventoryHUDController;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Ellipse} */
	ellipse_1;
	/** @type {Phaser.GameObjects.Image} */
	itemIcon;
	/** @type {InventoryHUDController} */
	inventoryHUDController;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
