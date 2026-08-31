
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2CarnivoreRoamingController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject.setData('type', 't2carn');
		this.gameObject._attackResolution && (this.gameObject._attackResolution.powerValue = 3);

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			this.gameObject.play('tier2carn__idle', true);
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;
		const tuning = this.scene.creatureTuning?.tier2CarnivoreRoaming ?? {};

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = ['t2herb', 't1herb', 'player'];        // empty for herbivores, fill for carnivores and T1 herb

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const patrol = go._behaviourPatrol;
		const eatCorpse = go._behaviourEatCorpse;
		const chase = go._behaviourChase;
		const flee = go._behaviourFlee;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier2CarnivoreRoamingController: missing StateDecider or StateManager');
			return;
		}

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = tuning.detectionRadius ?? 300;

		// Apply neutral/patrol behaviour values
		if (patrol) {
			patrol.moveSpeed = tuning.neutralSpeed ?? 50;
			patrol.loiterRadius = tuning.loiterRadius ?? 200;
			patrol.directionChangeInterval = tuning.directionChangeInterval ?? 3000;
			patrol.pauseDuration = tuning.loiterPauseDuration ?? 2250;
			patrol.returnPauseDuration = tuning.returnPauseDuration ?? 2000;
		}

		// Apply flee behaviour values
		if (flee) {
			flee.moveSpeed = tuning.fleeSpeed ?? 150;
			flee.fleeDuration = tuning.fleeDuration ?? 2000;
		}

		// Apply opportunity/eat behaviour values
		if (eatCorpse) {
			eatCorpse.moveSpeed = tuning.eatMoveSpeed ?? 100;
			eatCorpse.eatDuration = tuning.eatDuration ?? 10000;
		}

		if (chase) {
			chase.targetTags = chaseTargets;
			chase.moveSpeed = tuning.chaseSpeed ?? 300;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = tuning.combatPower ?? 3;

		// Register behaviour nodes
		stateManager.registerState('patrol', patrol);
		stateManager.registerState('eatCorpse', eatCorpse);
		stateManager.registerState('chase', chase);
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
				condition: (tags) => tags.includes('t1carn')
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

		console.log('Tier2Carnivore Roaming state machine ready');
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;

		const body = this.gameObject.body;

		// Handle sprite flipping
		if (body.velocity.x < -1) {
			this.gameObject.flipX = true; // Face left
		} else if (body.velocity.x > 1) {
			this.gameObject.flipX = false; // Face right
		}

		// Check if actively eating a corpse
		const isEating = this.gameObject._stateManager?.currentState === 'eatCorpse' && 
		                 this.gameObject._behaviourEatCorpse?.eating;
		const isCombat = this.gameObject._stateManager?.currentState === 'combat';

		// Handle animation switching
		if (isCombat) {
			this.gameObject.play('creature_combat', true);
		} else if (isEating) {
			this.gameObject.play('tier2carn_eat', true);
		} else if (Math.abs(body.velocity.x) > 1 || Math.abs(body.velocity.y) > 1) {
			const currentAnim = this.gameObject.anims.currentAnim?.key;
			if (currentAnim !== 'tier2carn_walkstart' && currentAnim !== 'tier2carn_walk') {
				this.gameObject.play('tier2carn_walkstart', true).chain('tier2carn_walk');
			}
		} else {
			const currentAnim = this.gameObject.anims.currentAnim?.key;
			if (currentAnim === 'tier2carn_walk' || currentAnim === 'tier2carn_walkstart') {
				this.gameObject.play('tier2carn_walkend', true);
			} else if (currentAnim === 'tier2carn_walkend') {
				if (!this.gameObject.anims.isPlaying) {
					this.gameObject.play('tier2carn__idle', true);
				}
			} else {
				this.gameObject.play('tier2carn__idle', true);
			}
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
