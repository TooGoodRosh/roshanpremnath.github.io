
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import Fruit from "./Fruit.js";
import Corpse from "./Corpse.js";
/* END-USER-IMPORTS */

export default class PlayerThrow extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.cKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
		this.heldItemType = null;
		this.isAiming = false;
		this.gameObject._playerThrow = this;

		// Execute throw when clicking left mouse button while aiming
		this.scene.input.on('pointerdown', (pointer) => {
			if (this.scene.game.registry.get('isMenuOpen')) return;

			if (pointer.leftButtonDown() && this.isAiming && !this.gameObject.getData('isDead')) {
				this.isAiming = false;
				this.releaseFruit();
			}
		}, this);
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;
		if (this.gameObject.getData('isDead')) return;
		if (this.gameObject.getData('isTransitioning')) return;
		if (this.scene.game.registry.get('isMenuOpen')) return;

		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			const inv = this.scene.playerInventory;
			if (!this.isAiming && inv && inv.items.length > 0) {
				this.isAiming = true;
				this.heldItemType = inv.getCurrentItem() ?? 'food';
				console.log('Aiming:', this.heldItemType);
			}
		}

		if (this.isAiming && Phaser.Input.Keyboard.JustDown(this.cKey)) {
			this.cancelThrow();
		}
	}

	getWorldPosition() {
		// Offset Y so the item is held above the player's head
		return { x: this.gameObject.x, y: this.gameObject.y - 60 };
	}

	cancelThrow() {
		this.isAiming = false;
		this.heldItemType = null;
		console.log('Throw cancelled');
	}

	releaseFruit() {
		const inventory = this.scene.playerInventory;
		if (!inventory || inventory.items.length === 0) return;

		// Capture type before removing
		const itemType = this.heldItemType || inventory.getCurrentItem() || 'food';
		inventory.removeItem();

		const pos = this.getWorldPosition();
		let thrownFruit;
		
		if (itemType === 'corpse') {
			thrownFruit = new Corpse(this.scene, pos.x, pos.y);
		} else {
			thrownFruit = new Fruit(this.scene, pos.x, pos.y);
		}

		this.scene.add.existing(thrownFruit);

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(thrownFruit);

		thrownFruit.setData('type', itemType);
		thrownFruit.setData('pickupDisabled', true);
		thrownFruit.body.enable = false;
		
		this.heldItemType = null;

		const dir = this.gameObject.getData('lastDirection') ?? { x: 1, y: 0 };

		const startX = thrownFruit.x;
		const startY = thrownFruit.y;
		const playerX = this.gameObject.x;
		const playerY = this.gameObject.y;
		const throwDistance = this.scene.playerTuning?.throw?.distance ?? 380;
		const duration = this.scene.playerTuning?.throw?.duration ?? 650;

		let landX, landY;
		const indicator = this.gameObject._throwArcIndicator;
		
		if (indicator && indicator._currentLandX !== null) {
			// Use the smooth lagging indicator position for the actual throw
			landX = indicator._currentLandX;
			landY = indicator._currentLandY;
		} else {
			// Fallback if indicator is missing
			landX = playerX + dir.x * throwDistance;
			landY = playerY + dir.y * throwDistance;
		}
		
		// Fixed arc height for satisfying Z-axis pop in all directions
		const arcHeight = this.scene.playerTuning?.throw?.arcHeight ?? 150;

		// Capture original scale so we can safely squish/stretch it
		const baseScaleX = thrownFruit.scaleX;
		const baseScaleY = thrownFruit.scaleY;

		this.scene.tweens.addCounter({
			from: 0,
			to: 1,
			duration: duration,
			// Custom "Hang Time" Ease: Starts fast, slows down at the peak (t=0.5), ends fast
			ease: (t) => t + 0.15 * Math.sin(Math.PI * 2 * t),
			onUpdate: (tween) => {
				const t = tween.getValue();
				thrownFruit.x = startX + (landX - startX) * t;
				thrownFruit.y = startY + (landY - startY) * t - arcHeight * Math.sin(Math.PI * t);
				
				// Dynamic flight stretch: fast at start/end, normal at apex (t=0.5)
				const speedFactor = Math.abs(t - 0.5) * 2; 
				thrownFruit.scaleX = baseScaleX * (1 + 0.3 * speedFactor);
				thrownFruit.scaleY = baseScaleY * (1 - 0.3 * speedFactor);
			},
			onComplete: () => {
				thrownFruit.x = landX;
				thrownFruit.y = landY;
				thrownFruit.body.enable = true;
				thrownFruit.body.reset(landX, landY);
				thrownFruit.body.setAllowGravity(false);
				thrownFruit.body.setVelocity(0, 0);
				thrownFruit.body.immovable = true;
				thrownFruit.setData('isHeld', false);
				thrownFruit.setData('pickupDisabled', false);
				console.log('Object landed');

				// Impact Squash when hitting the ground
				this.scene.tweens.add({
					targets: thrownFruit,
					scaleX: baseScaleX * 1.25,
					scaleY: baseScaleY * 0.75,
					duration: 100,
					yoyo: true,
					ease: 'Quad.easeOut',
					onComplete: () => {
						thrownFruit.setScale(baseScaleX, baseScaleY);
					}
				});

				if (this.scene.globalObstacles && this.scene.globalObstacles.length > 0) {
					this.scene.physics.add.collider(thrownFruit, this.scene.globalObstacles);
				}

				this.scene.time.delayedCall(400, () => {
					const player = this.gameObject;
					this.scene.physics.add.overlap(thrownFruit, player, () => {
						if (!thrownFruit.getData('isHeld') &&
							!thrownFruit.getData('pickupDisabled')) {
							const type = thrownFruit.getData('type') ?? itemType;
							const inv = this.scene.playerInventory;
							if (inv && !inv.isFull()) {
								inv.addItem(type);
								thrownFruit.destroy();
							}
						}
					});
				});
			}
		});

		console.log('Fruit released in direction', dir);

		// Trigger throw animation safely
		if (this.gameObject.anims && this.scene.anims.exists('player_throw')) {
			// Force repeat: 0 to ensure it plays exactly once
			this.gameObject.play({ key: 'player_throw', repeat: 0 });
			this.gameObject.setData('isPickingUp', true); // Reuse our lock flag so movement doesn't interrupt it
			this.gameObject.off('animationcomplete-player_throw');
			this.gameObject.once('animationcomplete-player_throw', () => {
				this.gameObject.setData('isPickingUp', false);
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
