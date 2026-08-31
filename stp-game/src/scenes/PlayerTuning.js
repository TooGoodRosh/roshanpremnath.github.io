import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";

export default class PlayerTuning extends ScriptNode {
	constructor(parent) {
		super(parent);
		
		// Instantly expose to the scene globally
		if (this.scene) {
			this.scene.playerTuning = this;
		}

		// =============================================
		// PLAYER TUNING DASHBOARD
		// =============================================
		
		this.movement = {
			speed: 200 // [px/sec] Walking speed
		};

		this.throw = {
			distance: 500, // [px] Maximum distance a thrown item travels
			duration: 600, // [ms] How long the item hangs in the air
			arcHeight: 200 // [px] The Z-axis pop height of the visual throw
		};

		this.camera = {
			zoomLevel: 0.8, // [1 = default, >1 = zoomed in, <1 = zoomed out]
			
			// Standard Look-Ahead (when moving)
			lookAheadDistance: 150, // [px] How far the camera pans in movement direction
			lookAheadLerp: 0.05,    // [0.01 - 1.0] How fast the camera pans normally
			
			// Deep Pan (when stationary)
			deepPanDelay: 2000,   // [ms] How long to stand still to trigger deep pan
			deepPanDistance: 400, // [px] How far the camera pans deep
			deepPanLerp: 0.015    // [0.01 - 1.0] How fast the camera deep pans
		};

		this.health = {
			deathTimerThreshold: 500 // [ms] Continuous overlap required with a threat to die
		};
	}

	awake() {
		// Awake is intentionally left empty. 
		// Data initialized in constructor to prevent execution order race conditions!
	}
}