
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2HerbivoreController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Tag this creature for detection system
		this.gameObject.setData('type', 't2herb');

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			if (this.gameObject._attackResolution) {
				this.gameObject._attackResolution.powerValue = 2;
			}
		});

		this.scene.events.once('create', () => {
			this.gameObject.play('tier2herb_idle', true);
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;
		const tuning = this.scene.creatureTuning?.tier2Herbivore ?? {};

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = [];        // empty for herbivores, fill for carnivores and T1 herb

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const neutral = go._behaviourNeutral;
		const opportunity = go._behaviourOpportunity;
		const flee = go._behaviourFlee;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier2HerbivoreController: missing StateDecider or StateManager');
			return;
		}

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = tuning.detectionRadius ?? 150;

		// Apply neutral/patrol behaviour values
		if (neutral) {
			neutral.moveSpeed = tuning.neutralSpeed ?? 60;
			neutral.loiterRadius = tuning.loiterRadius ?? 150;
			neutral.directionChangeInterval = tuning.directionChangeInterval ?? 2000;
			neutral.pauseDuration = tuning.loiterPauseDuration ?? 1200;
			neutral.returnPauseDuration = tuning.returnPauseDuration ?? 1000;
		}

		// Apply flee behaviour values
		if (flee) {
			flee.moveSpeed = tuning.fleeSpeed ?? 160;
			flee.fleeDuration = tuning.fleeDuration ?? 2000;
		}

		// Apply opportunity/eat behaviour values
		if (opportunity) {
			opportunity.moveSpeed = tuning.eatMoveSpeed ?? 80;
			opportunity.eatDuration = tuning.eatDuration ?? 2000;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = tuning.combatPower ?? 2;

		// Register behaviour nodes with StateManager
		stateManager.registerState('neutral', neutral);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('flee', flee);
		stateManager.registerState('combat', combat);

		// Priority list — combat must always be first
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'flee',
				condition: (tags) => tags.some(t => ['player', 't2carn', 't1carn', 't1herb', 'mimic'].includes(t))
			},
			{
				state: 'opportunity',
				condition: (tags) => tags.includes('food')
			}
		];

		// Register obstacle collision
		if (this.scene.globalObstacles && this.scene.globalObstacles.length > 0) {
			this.scene.physics.add.collider(go, this.scene.globalObstacles);
		}

		// Register creature-only obstacle collision
		if (this.scene.creatureObstacles && this.scene.creatureObstacles.length > 0) {
			this.scene.physics.add.collider(go, this.scene.creatureObstacles);
		}

		go.setData('defaultState', 'neutral');
		stateManager.switchState('neutral');

		console.log('Tier2Herbivore state machine ready');
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;

		const body = this.gameObject.body;

		// Startled logic
		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const currentDetectedCount = detected.length;
		if (this._lastDetectedCount === undefined) this._lastDetectedCount = 0;

		if (currentDetectedCount > this._lastDetectedCount) {
			this.gameObject.setData('isStartled', true);
			if (this.gameObject.anims && this.scene.anims.exists('tier2herb__startled')) {
				this.gameObject.play({ key: 'tier2herb__startled', repeat: 0 });
				this.gameObject.off('animationcomplete-tier2herb__startled');
				this.gameObject.once('animationcomplete-tier2herb__startled', () => {
					this.gameObject.setData('isStartled', false);
				});
			} else {
				this.gameObject.setData('isStartled', false);
			}
		}
		this._lastDetectedCount = currentDetectedCount;

		// Handle sprite flipping
		if (body.velocity.x < 0) {
			this.gameObject.flipX = true; // Face left
		} else if (body.velocity.x > 0) {
			this.gameObject.flipX = false; // Face right
		}

		// Check if actively eating in the opportunity state
		const isEating = this.gameObject._stateManager?.currentState === 'opportunity' && 
		                 this.gameObject._behaviourOpportunity?.eating;
		const isStartled = this.gameObject.getData('isStartled');
		const isCombat = this.gameObject._stateManager?.currentState === 'combat';

		// Handle animation switching
		if (isCombat) {
			this.gameObject.play('creature_combat', true);
		} else if (isStartled) {
			// Do not interrupt startled animation
		} else if (isEating) {
			this.gameObject.play('tier2herb_eat', true);
		} else if (body.velocity.x !== 0 || body.velocity.y !== 0) {
			this.gameObject.play('tier2herb_walk', true);
		} else {
			this.gameObject.play('tier2herb_idle', true);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
