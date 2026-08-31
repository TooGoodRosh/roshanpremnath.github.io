
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier1HerbivoreController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.gameObject.setData('type', 't1herb');
		this.gameObject.setData('defaultState', 'neutral');

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			if (this.gameObject.play) this.gameObject.play('tier1herb_idle', true);
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;
		const tuning = this.scene.creatureTuning?.tier1Herbivore ?? {};

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = ['player', 't2herb', 't2carn', 't1carn', 'mimic'];        // empty for herbivores, fill for carnivores and T1 herb

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const neutral = go._behaviourNeutral;
		const opportunity = go._behaviourOpportunity;
		const chase = go._behaviourChase;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier1HerbivoreController: missing StateDecider or StateManager');
			return;
		}

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = tuning.detectionRadius ?? 200;

		// Apply neutral/patrol behaviour values
		if (neutral) {
			neutral.moveSpeed = tuning.neutralSpeed ?? 60;
			neutral.loiterRadius = tuning.loiterRadius ?? 150;
			neutral.directionChangeInterval = tuning.directionChangeInterval ?? 2000;
			neutral.pauseDuration = tuning.loiterPauseDuration ?? 1200;
			neutral.returnPauseDuration = tuning.returnPauseDuration ?? 1000;
		}

		// Apply opportunity/eat behaviour values
		if (opportunity) {
			opportunity.moveSpeed = tuning.eatMoveSpeed ?? 80;
			opportunity.eatDuration = tuning.eatDuration ?? 2000;
		}

		if (chase) {
			chase.targetTags = chaseTargets;
			chase.moveSpeed = tuning.chaseSpeed ?? 140;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = tuning.combatPower ?? 4;

		// Register behaviour nodes
		stateManager.registerState('neutral', neutral);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('chase', chase);
		stateManager.registerState('combat', combat);

		// Priority list — combat must always be first
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => chaseTargets.includes(t))
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
		console.log('Tier1Herbivore state machine ready');
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;

		const body = this.gameObject.body;

		// Handle sprite flipping
		if (body.velocity.x < 0) {
			this.gameObject.flipX = true; // Face left
		} else if (body.velocity.x > 0) {
			this.gameObject.flipX = false; // Face right
		}

		// Handle animation switching (safeguard in case it's still an Image instead of a Sprite)
		if (!this.gameObject.play) return;

		const isEating = this.gameObject._stateManager?.currentState === 'opportunity' && 
		                 this.gameObject._behaviourOpportunity?.eating;
		const isCombat = this.gameObject._stateManager?.currentState === 'combat';

		if (isCombat) {
			this.gameObject.play('creature_combat', true);
		} else if (isEating) {
			this.gameObject.play('tier1herb_eat', true);
		} else if (body.velocity.x !== 0 || body.velocity.y !== 0) {
			this.gameObject.play('tier1herb_walk', true);
		} else {
			this.gameObject.play('tier1herb_idle', true);
		}
	}
}

/* END OF COMPILED CODE */

// You can write more code here
