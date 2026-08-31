
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CameraController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
	    const tuning = this.scene.playerTuning?.camera ?? {};
	    
	    this.zoomLevel = tuning.zoomLevel ?? 0.8;
	    this.lookAheadDistance = tuning.lookAheadDistance ?? 150;
	    this.lookAheadLerp = tuning.lookAheadLerp ?? 0.05;
	    this.deepPanDelay = tuning.deepPanDelay ?? 2000;
	    this.deepPanDistance = tuning.deepPanDistance ?? 500;
	    this.deepPanLerp = tuning.deepPanLerp ?? 0.015;

	    this.lookAheadOffset = { x: 0, y: 0 };
	    this.lookAheadTarget = { x: 0, y: 0 };
	    this.idleTimer = 0;
	    this.currentLerp = this.lookAheadLerp;
	    this.player = null;

	    this.scene.events.once('create', () => {
	        this.player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
	        if (this.player) {
	            // Check if PlayerSpawn gave us a target landing spot
	            const spawnTarget = this.player.getData('spawnTarget');
	            const startX = spawnTarget ? spawnTarget.x : this.player.x;
	            const startY = spawnTarget ? spawnTarget.y : this.player.y;

	            this.scene.cameras.main.centerOn(startX, startY);
	            if (!spawnTarget) {
	                this.scene.cameras.main.startFollow(this.player, true, 0.08, 0.08);
	            }
	            this.scene.cameras.main.setZoom(this.zoomLevel);
	        }
	    });
	}

	update() {
	    if (this.scene.isPlayerDead) return;
	    if (!this.player || !this.player.body) return;
	    if (this.player.getData('isSpawning')) return;

	    const speed = Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y);
	    const isMoving = speed > 10;
	    const dir = this.player.getData('lastDirection') ?? { x: 0, y: 0 };

	    if (isMoving) {
	        // Player is moving: reset idle timer and target normal look-ahead distance
	        this.idleTimer = 0;
	        this.lookAheadTarget.x = dir.x * this.lookAheadDistance;
	        this.lookAheadTarget.y = dir.y * this.lookAheadDistance;
	        this.currentLerp = this.lookAheadLerp;
	    } else {
	        // Player is stationary: increment idle timer
	        this.idleTimer += this.scene.game.loop.delta;

	        if (this.idleTimer >= this.deepPanDelay) {
	            // Trigger deep pan further in the last moved direction
	            this.lookAheadTarget.x = dir.x * this.deepPanDistance;
	            this.lookAheadTarget.y = dir.y * this.deepPanDistance;
	            this.currentLerp = this.deepPanLerp;
	        } else {
	            // Still waiting for deep pan, maintain normal look-ahead
	            this.lookAheadTarget.x = dir.x * this.lookAheadDistance;
	            this.lookAheadTarget.y = dir.y * this.lookAheadDistance;
	            this.currentLerp = this.lookAheadLerp;
	        }
	    }

	    // Lerp current offset toward target
	    this.lookAheadOffset.x += (this.lookAheadTarget.x - this.lookAheadOffset.x) * this.currentLerp;
	    this.lookAheadOffset.y += (this.lookAheadTarget.y - this.lookAheadOffset.y) * this.currentLerp;

	    this.scene.cameras.main.setFollowOffset(-this.lookAheadOffset.x, -this.lookAheadOffset.y);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
