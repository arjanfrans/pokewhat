import State from '../State';

/**
 * State of a multiplayer the game.
 *
 * @class
 * @extends State
 */
class MultiplayerState extends State {

    constructor (match, map) {
        super('multiplayer');

        this.collisionSystem = null;
        this.bulletSystem = null;
        this.player = null;
        this.map = map;
        this.match = match;

        // FIXME get this out of here
        this.showScores = false;
    }

    init () {
        super.init();
    }

    get soldiers () {
        return this.match.soldiers;
    }

    /**
     * Update the state. Logic and views are updated.
     *
     * @param {float} delta - delta time.
     *
     * @returns {void}
     */
    update (delta) {
        super.updateInputs(delta);

        super.updateAudio(delta);

        // Relies on previous turn
        if (this.bulletSystem) {
            this.bulletSystem.update(delta);
        }

        // TODO network updates

        for (let soldier of this.soldiers) {
            soldier.update(delta);

            if (soldier.dead) {
                let position = this.map.randomRespawnPosition();

                soldier.respawn(position);
            }
        }

        this.match.update(delta);

        if (this.collisionSystem) {
            this.collisionSystem.update(delta);
        }
    }
}

export default MultiplayerState;
