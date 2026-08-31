
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MimicController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject.setData('type', 'mimic');
		this.gameObject.setData('defaultState', 'stalk');
		this._killCount = 0;

		if (!this.scene.globalEntities) this.scene.globalEntities = [];
		this.scene.globalEntities.push(this.gameObject);

		this.scene.events.once('create', () => {
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;
		const tuning = this.scene.creatureTuning?.mimic ?? {};

		const mimicStateDecider = go._mimicStateDecider;
		const stateManager = go._stateManager;
		const combat = go._behaviourCombat;
		const stalk = go._behaviourStalk;
		const charge = go._behaviourCharge;
		const eatCorpse = go._behaviourEatCorpse;
		const opportunity = go._behaviourOpportunity;
		const chase = go._behaviourChase;

		if (!mimicStateDecider || !stateManager) {
			console.warn('MimicController: missing MimicStateDecider or StateManager');
			return;
		}

		if (chase) {
			chase.targetTags = ['player', 't1carn', 't1herb', 't2carn', 't2herb'];
			chase.moveSpeed = tuning.chaseSpeed ?? 180;
		}

		if (stalk) stalk.patienceThreshold = tuning.stalkPatienceThresholds?.[0] ?? 3000;
		if (go._attackResolution) go._attackResolution.powerValue = tuning.basePower ?? 1;
		console.log('Mimic ready | power:', go._attackResolution.powerValue);

		const creatureTypes = ['t1carn', 't1herb', 't2carn', 't2herb'];

		const _preEatPriorities = [
			{ state: 'combat',      condition: () => go._stateManager?.currentState === 'combat' },
			{ state: 'eatCorpse',   condition: (tags) => tags.includes('corpse') },
			{ state: 'opportunity', condition: (tags) => tags.includes('food') },
			{ state: 'charge',      condition: () => false },
			{ state: 'attack',      condition: (tags) => creatureTypes.some(t => tags.includes(t)) },
		];

		const _postEatPriorities = [
			{ state: 'combat',      condition: () => go._stateManager?.currentState === 'combat' },
			{ state: 'attack',      condition: (tags) => creatureTypes.some(t => tags.includes(t)) },
			{ state: 'eatCorpse',   condition: (tags) => tags.includes('corpse') },
			{ state: 'opportunity', condition: (tags) => tags.includes('food') },
			{ state: 'charge',      condition: () => false },
		];

		mimicStateDecider._preEatPriorities = _preEatPriorities;
		mimicStateDecider._postEatPriorities = _postEatPriorities;
		mimicStateDecider.priorities = _preEatPriorities;

		stateManager.registerState('combat', combat);
		stateManager.registerState('stalk', stalk);
		stateManager.registerState('charge', charge);
		stateManager.registerState('eatCorpse', eatCorpse);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('attack', chase);

		go.on('attackWin', () => this.onMimicKill());

		if (this.scene.globalObstacles && this.scene.globalObstacles.length > 0) {
			this.scene.physics.add.collider(go, this.scene.globalObstacles);
		}

		// Register creature-only obstacle collision
		if (this.scene.creatureObstacles && this.scene.creatureObstacles.length > 0) {
			this.scene.physics.add.collider(go, this.scene.creatureObstacles);
		}

		stateManager.switchState('stalk');
		console.log('Mimic state machine ready');
	}

	onMimicKill() {
		const go = this.gameObject;
		const tuning = this.scene.creatureTuning?.mimic ?? {};
		this._killCount++;
		console.log(`Mimic kill #${this._killCount}`);
		const thresholds = tuning.stalkPatienceThresholds ?? [3000, 2000, 1200, 600];
		const idx = Math.min(this._killCount, thresholds.length - 1);
		go._behaviourStalk.patienceThreshold = thresholds[idx];
		console.log(`Patience threshold → ${thresholds[idx]}ms`);
		if (this._killCount === 1) {
			go._attackResolution.powerValue = tuning.empoweredPower ?? 4;
			go._mimicStateDecider.switchPriorityList();
			console.log(`Power → 4 | Priority list switched to post-eat`);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
