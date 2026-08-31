
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerMovement extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {

		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.wasd = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});

		this.lastDirection = new Phaser.Math.Vector2(1, 0); // default facing right

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			this.gameObject.play('player_idle');
			
			// Register collisions with all globally registered obstacles
			if (this.scene.globalObstacles && this.scene.globalObstacles.length > 0) {
				this.scene.physics.add.collider(this.gameObject, this.scene.globalObstacles);
			}
		});
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;
		if (this.gameObject.getData('isDead')) return;
		if (this.gameObject.getData('isTransitioning')) return;

		// Lock movement if the main menu is open
		if (this.scene.game.registry.get('isMenuOpen')) {
			this.gameObject.body.setVelocity(0);
			this.gameObject.play('player_idle', true);
			return;
		}

		const body = this.gameObject.body;
		const cursors = this.cursors;
		const wasd = this.wasd;

		const speed = this.scene.playerTuning?.movement?.speed ?? 200;

		body.setVelocity(0);

		if (cursors.left.isDown || wasd.left.isDown) {
			body.setVelocityX(-speed);
			this.lastDirection.set(-1, 0);
			this.gameObject.setData('lastDirection', { x: -1, y: 0 });
			this.gameObject.flipX = true; // Face left
		} else if (cursors.right.isDown || wasd.right.isDown) {
			body.setVelocityX(speed);
			this.lastDirection.set(1, 0);
			this.gameObject.setData('lastDirection', { x: 1, y: 0 });
			this.gameObject.flipX = false; // Face right
		}

		if (cursors.up.isDown || wasd.up.isDown) {
			body.setVelocityY(-speed);
			this.lastDirection.set(0, -1);
			this.gameObject.setData('lastDirection', { x: 0, y: -1 });
		} else if (cursors.down.isDown || wasd.down.isDown) {
			body.setVelocityY(speed);
			this.lastDirection.set(0, 1);
			this.gameObject.setData('lastDirection', { x: 0, y: 1 });
		}

		// Handle Animation switching
		if (this.gameObject.getData('isPickingUp')) {
			// Do not interrupt the pickup animation
		} else if (body.velocity.x !== 0 || body.velocity.y !== 0) {
			this.gameObject.play('player_walk', true);
		} else {
			this.gameObject.play('player_idle', true);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
