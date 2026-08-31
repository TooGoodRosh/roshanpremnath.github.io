
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class DetectionGlow extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Initialize the graphics object that will hold our drawn glow
		this.glowGraphic = null;
		
		// The base opacity of the glow
		this.baseAlpha = 0.05;
		
		// Track the last known radius so we don't redraw 60 circles every single frame needlessly
		this._lastRadius = -1;
		
		// Link this script instance back to the game object for easy access elsewhere
		this.gameObject._detectionGlow = this;

		// Wait until the scene has finished its 'create' phase before generating the glow
		this.scene.events.once('create', () => {
			this.createGlow();
		});
	}

	createGlow() {
		// Attempt to fetch the detection radius from the creature, default to 150 if undefined
		const radius = this.gameObject._detectionRadius?.radius ?? 150;
		
		// Create a Phaser Graphics object to draw the custom gradient
		this.glowGraphic = this.scene.add.graphics();
		
		// Place the glow just below the creature's depth
		this.glowGraphic.setDepth(this.gameObject.depth - 1);
		
		// Additive blending makes the overlapping colors brighter, like natural light
		this.glowGraphic.setBlendMode(Phaser.BlendModes.ADD);
		
		// Perform the initial draw
		this.drawGlow(radius, this.baseAlpha);
		
		// Override depth for testing/visibility purposes
		this.glowGraphic.setDepth(10);
	}

	drawGlow(radius, alpha) {
		// Abort if the graphics object hasn't been created yet or was destroyed
		if (!this.glowGraphic) return;
		
		// Clear any previous drawings to prepare for the new frame
		this.glowGraphic.clear();

		// The number of concentric circles used to build the smooth gradient
		const steps = 60;
		
		// Calculate the thickness of each concentric ring
		const ringThickness = radius / steps;
		
		// Draw from the outside in (i goes from 60 down to 0)
		for (let i = steps; i >= 0; i--) {
			// t goes from 1.0 (outer edge) down to 0.0 (center)
			const t = i / steps;
			
			// Calculate the current circle's radius
			const r = radius * t;
			
			// Calculate a ring effect shape:
			// Math.pow(t, 8) creates a much steeper falloff from the peak towards the center.
			// Math.pow(1 - t, 1.5) creates a sharper fade towards the outer edge.
			// Together they create a thinner, more defined ring peaking around 84% of the radius.
			const ring = Math.pow(t, 8) * Math.pow(1 - t, 1.5);
			
			// Multiply by 50 to compensate for the fact that higher exponents produce much smaller fractions
			const a = alpha * ring * 50; 
			
			// Draw hollow stroked rings instead of solid filled discs
			this.glowGraphic.lineStyle(ringThickness, 0xC4A8D4, Math.min(a, 1));
			this.glowGraphic.strokeCircle(0, 0, r);
		}
	}

	update() {
		// Stop updating if the graphics object is missing or the creature is inactive
		if (!this.glowGraphic || !this.gameObject.active) return;

		const myX = this.gameObject.body ? this.gameObject.body.center.x : this.gameObject.x;
		const myY = this.gameObject.body ? this.gameObject.body.center.y : this.gameObject.y;

		// --- CPU & GPU OPTIMIZATION: CAMERA CULLING ---
		const view = this.scene.cameras.main.worldView;
		if (
			myX < view.left - 200 || myX > view.right + 200 ||
			myY < view.top - 200 || myY > view.bottom + 200
		) {
			if (this.glowGraphic.visible) this.glowGraphic.setVisible(false);
			return;
		}
		
		if (!this.glowGraphic.visible) this.glowGraphic.setVisible(true);

		// Keep the glow strictly centered on the creature as it moves
		this.glowGraphic.setPosition(myX, myY);

		// Re-check the radius in case it changed, then redraw the glow
		const radius = this.gameObject._detectionRadius?.radius ?? 150;
		if (this._lastRadius !== radius) {
			this.drawGlow(radius, this.baseAlpha);
			this._lastRadius = radius;
		}
	}

	destroy() {
		// Clean up the graphics object when the script or creature is destroyed
		if (this.glowGraphic) {
			this.glowGraphic.destroy();
			this.glowGraphic = null;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
