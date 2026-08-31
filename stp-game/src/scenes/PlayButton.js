
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayButton extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		const btn = this.gameObject;
		
		// Make sure it handles pointer events
		if (!btn.input) btn.setInteractive({ useHandCursor: true });
		
		// Initialize the global state so Level1 knows to lock controls
		this.scene.game.registry.set('isMenuOpen', true);
		
		// Visual effects for hovering over the button
		btn.on('pointerover', () => {
			btn.setTint(0xffd700); // Gives it a nice golden hover tint
			this.scene.tweens.add({
				targets: btn,
				scaleX: 1.1,
				scaleY: 1.1,
				duration: 100,
				ease: 'Power1'
			});
		});
		
		btn.on('pointerout', () => {
			btn.clearTint();
			this.scene.tweens.add({
				targets: btn,
				scaleX: 1.0,
				scaleY: 1.0,
				duration: 100,
				ease: 'Power1'
			});
		});
		
		// Click action
		btn.on('pointerdown', () => {
			btn.disableInteractive(); // Prevent rapid multi-clicking
			
			// Fade out the UI smoothly
			this.scene.tweens.add({
				targets: this.scene.children.getChildren(),
				alpha: 0,
				duration: 500,
				ease: 'Power2',
				onComplete: () => {
					// Unlock the player in Level 1
					this.scene.game.registry.set('isMenuOpen', false);
					
					// Signal the PlayerSpawn script in Level 1 to drop the player!
					this.scene.game.events.emit('play_button_pressed');

					// Shut down the MainMenu scene entirely, leaving just Level1 active!
					this.scene.scene.stop('MainMenu');
				}
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
