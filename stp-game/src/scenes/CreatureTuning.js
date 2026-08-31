import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";

export default class CreatureTuning extends ScriptNode {
	constructor(parent) {
		super(parent);
		
		// Instantly expose to the scene globally
		if (this.scene) {
			this.scene.creatureTuning = this;
		}

		// =============================================
		// CREATURE TUNING DASHBOARD
		// =============================================

		// Universal rules applied across all creatures
		this.globals = {
			bounceTimers: {
				flee: 1200,   // [ms] Duration of panic ricochet when hitting a wall
				charge: 600,  // [ms] Duration of Mimic ricochet when missing target
				loiter: 800   // [ms] Duration of reflection bounce when patrolling
			}
		};

		// Power Scale: T1Carn=5, T1Herb=4, T2Carn=3, T2Herb=2, Mimic Base=1

		// Apex Predator - Chases pretty much everything, eats corpses
		this.tier1Carnivore = {
			detectionRadius: 250,
			neutralSpeed: 60,
			fleeSpeed: 160,
			chaseSpeed: 180,
			eatMoveSpeed: 80,
			loiterRadius: 400,
			directionChangeInterval: 2000,
			loiterPauseDuration: 1200,
			returnPauseDuration: 1000,
			fleeDuration: 2000,
			eatDuration: 2000,
			combatPower: 5
		};

		// Aggressive Herbivore - Chases player/predators out of territory, eats food
		this.tier1Herbivore = {
			detectionRadius: 450,
			neutralSpeed: 60,
			fleeSpeed: 200,
			chaseSpeed: 300,
			eatMoveSpeed: 80,
			loiterRadius: 200,
			directionChangeInterval: 2000,
			loiterPauseDuration: 1200,
			returnPauseDuration: 1000,
			fleeDuration: 2000,
			eatDuration: 3000,
			combatPower: 4
		};

		// Standard Predator - Chases player/herbivores, flees from Apex
		this.tier2Carnivore = {
			detectionRadius: 400,
			neutralSpeed: 50,
			fleeSpeed: 150,
			chaseSpeed: 300,
			eatMoveSpeed: 100,
			loiterRadius: 150,
			directionChangeInterval: 3000,
			loiterPauseDuration: 1500,
			returnPauseDuration: 2000,
			fleeDuration: 2000,
			eatDuration: 10000,
			combatPower: 3
		};

		// Standard Predator (Roaming Variant)
		this.tier2CarnivoreRoaming = {
			...this.tier2Carnivore, // Inherit base values, override below
			detectionRadius: 400,
			neutralSpeed: 30,
			chaseSpeed: 300,
			loiterRadius: 100,
			directionChangeInterval: 3000
		};

		// Prey - Harmless, flees from everything, eats food
		this.tier2Herbivore = {
			detectionRadius: 250,
			neutralSpeed: 60,
			fleeSpeed: 200,
			chaseSpeed: 120,
			eatMoveSpeed: 100,
			loiterRadius: 150,
			directionChangeInterval: 1500,
			loiterPauseDuration: 1000,
			returnPauseDuration: 1000,
			fleeDuration: 3000,
			eatDuration: 3000,
			combatPower: 2
		};

		// Prey (Roaming Variant)
		this.tier2HerbivoreRoaming = {
			...this.tier2Herbivore, // Inherit base values, override below
			detectionRadius: 250,
			neutralSpeed: 50,
			fleeSpeed: 200,
			eatMoveSpeed: 100,
			loiterRadius: 100,
			directionChangeInterval: 3000,
			loiterPauseDuration: 2000,
			returnPauseDuration: 2000,
			fleeDuration: 3000,
			eatDuration: 5000,
		};

		// Mimic - Stalks player, charges, scales in power
		this.mimic = {
			chaseSpeed: 180,
			stalkPatienceThresholds: [3000, 2000, 1200, 600], // Speeds up per kill
			basePower: 1,
			empoweredPower: 4
		};
	}
}