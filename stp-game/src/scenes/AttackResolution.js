
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import Corpse from "./Corpse.js";
/* END-USER-IMPORTS */

export default class AttackResolution extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.powerValue = 1;
		this.resolving = false;
		this.gameObject._attackResolution = this;

		this.scene.events.once('create', () => {
			this.registerCombat();
		});
	}

	registerCombat() {
		const self = this.gameObject;
		const creatureTypes = ['t2herb', 't1herb', 't2carn', 't1carn', 'mimic'];
		const entities = this.scene.globalEntities || [];

		const others = entities.filter(child => {
			if (!child || !child.active || child === self) return false;
			const tag = child.getData ? child.getData('type') : null;
			return tag && creatureTypes.includes(tag);
		});

		others.forEach(other => {
			this.scene.physics.add.overlap(self, other, () => {
				this.resolveAttack(other);
			});
		});
	}

	resolveAttack(other) {
		const otherResolution = other._attackResolution;
		if (!otherResolution) return;

		if (this.resolving || otherResolution.resolving) return;
		this.resolving = true;
		otherResolution.resolving = true;

		const myPower = this.powerValue;
		const theirPower = otherResolution.powerValue;

		// Reposition side by side
		const myX = other.x - 64;
		const myY = other.y;
		this.gameObject.setPosition(myX, myY);
		if (this.gameObject.body) this.gameObject.body.reset(myX, myY);

		// Face each other
		this.gameObject.flipX = false; // Left combatant faces right
		other.flipX = true; // Right combatant faces left

		// Switch both to combat state
		this.gameObject._stateManager?.switchState('combat');
		other._stateManager?.switchState('combat');

		// Resolve after combat duration
		this.scene.time.delayedCall(3000, () => {
			if (!this.gameObject || !this.gameObject.active) return;
			if (!other || !other.active) return;

			if (myPower === theirPower) {
				this.die();
				otherResolution.die();
			} else if (myPower > theirPower) {
				otherResolution.die();
				this.resolving = false;
				this.gameObject.emit('attackWin');
				const defaultState = this.gameObject.getData('defaultState') ?? 'neutral';
				this.gameObject._stateManager?.switchState(defaultState);
			} else {
				this.die();
				otherResolution.resolving = false;
				const otherDefault = other.getData('defaultState') ?? 'neutral';
				other._stateManager?.switchState(otherDefault);
			}
		});
	}

	die() {
		const type = this.gameObject.getData('type');
		const x = this.gameObject.x;
		const y = this.gameObject.y;

		// Spawn corpse at this position
		const corpseTypes = ['t2herb', 't2carn', 't1herb'];
		if (corpseTypes.includes(type)) {
			const corpse = new Corpse(this.scene, x, y);
			this.scene.add.existing(corpse);
			corpse.setData('type', 'corpse');

			if (!this.scene.globalEntities) this.scene.globalEntities = [];
			this.scene.globalEntities.push(corpse);

			// Register player pickup overlap directly since scene create event has already fired
			const entities = this.scene.globalEntities || [];
			const player = entities.find(c => c && c.active && c.getData && c.getData('type') === 'player');
			if (player) {
				this.scene.time.delayedCall(500, () => {
					if (!corpse || !corpse.active) return;
					this.scene.physics.add.overlap(player, corpse, () => {
						if (corpse.getData('isHeld')) return;
						const inv = this.scene.playerInventory;
						if (inv && !inv.isFull()) {
							inv.addItem('corpse');
							corpse.destroy();
						}
					});
				});
			}
		}

		this.gameObject.destroy();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
