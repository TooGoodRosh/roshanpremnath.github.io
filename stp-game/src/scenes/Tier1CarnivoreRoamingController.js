
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier1CarnivoreRoamingController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject.setData('type', 't1carn');
		this.gameObject.setData('defaultState', 'patrol');

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;
		const tuning = this.scene.creatureTuning?.tier1Carnivore ?? {};

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = ['player', 't2herb', 't1herb', 't2carn', 'mimic'];        // empty for herbivores, fill for carnivores and T1 herb

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const patrol = go._behaviourPatrol;
		const eatCorpse = go._behaviourEatCorpse;
		const chase = go._behaviourChase;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier1CarnivoreRoamingController: missing StateDecider or StateManager');
			return;
		}

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = tuning.detectionRadius ?? 250;

		// Apply neutral/patrol behaviour values
		if (patrol) {
			patrol.moveSpeed = tuning.neutralSpeed ?? 60;
			patrol.loiterRadius = tuning.loiterRadius ?? 400;
			patrol.directionChangeInterval = tuning.directionChangeInterval ?? 2000;
			patrol.pauseDuration = tuning.loiterPauseDuration ?? 1200;
			patrol.returnPauseDuration = tuning.returnPauseDuration ?? 1000;
		}

		// Apply opportunity/eat behaviour values
		if (eatCorpse) {
			eatCorpse.moveSpeed = tuning.eatMoveSpeed ?? 80;
			eatCorpse.eatDuration = tuning.eatDuration ?? 2000;
		}

		if (chase) {
			chase.targetTags = chaseTargets;
			chase.moveSpeed = tuning.chaseSpeed ?? 180;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = tuning.combatPower ?? 5;

		// Register behaviour nodes
		stateManager.registerState('patrol', patrol);
		stateManager.registerState('eatCorpse', eatCorpse);
		stateManager.registerState('chase', chase);
		stateManager.registerState('combat', combat);

		// Priority list — apex predator eats corpses then chases everything
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'eatCorpse',
				condition: (tags) => tags.includes('corpse')
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => chaseTargets.includes(t))
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

		go.setData('defaultState', 'patrol');
		stateManager.switchState('patrol');

		const defaultBehaviour = go._behaviourNeutral ?? go._behaviourPatrol;
		if (defaultBehaviour) defaultBehaviour.roaming = true;

		console.log('Tier1Carnivore Roaming state machine ready');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
