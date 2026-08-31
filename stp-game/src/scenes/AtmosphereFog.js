
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class AtmosphereFog extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		const fogColor = 0xD6C7FB; // Matches your game's config.backgroundColor
		
		this.fogGraphic = this.scene.add.graphics();
		
		// Fix it to the camera screen so it never moves when the player walks
		this.fogGraphic.setScrollFactor(0);
		
		// Push it above the tilemap, player, and creatures, but keep it below UI (like checkpoints)
		this.fogGraphic.setDepth(90);

		const screenW = this.scene.scale.width;   // 1920
		const screenH = this.scene.scale.height;  // 1080

		// 1. Draw a massive solid block of fog WAY above the screen to cover any extreme camera bounces
		this.fogGraphic.fillStyle(fogColor, 0.75);
		this.fogGraphic.fillRect(-2000, -2000, screenW + 4000, 2000);

		// 2. Draw the smooth gradient fading downwards exactly from Y=0
		this.fogGraphic.fillGradientStyle(fogColor, fogColor, fogColor, fogColor, 0.75, 0.75, 0, 0);
		this.fogGraphic.fillRect(-2000, 0, screenW + 4000, screenH * 0.45);
	}

	update() {
		if (!this.fogGraphic || !this.scene.cameras.main) return;
		
		const cam = this.scene.cameras.main;
		const zoom = cam.zoom;

		// Counteract Phaser's screen-centering zoom offset to perfectly pin Y=0 to the top-left of the monitor
		this.fogGraphic.x = - (cam.width / 2 * (1 - zoom)) / zoom;
		this.fogGraphic.y = - (cam.height / 2 * (1 - zoom)) / zoom;
		
		// Counteract the zoom scale so the fog stays a consistent physical height on the monitor
		this.fogGraphic.setScale(1 / zoom);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
