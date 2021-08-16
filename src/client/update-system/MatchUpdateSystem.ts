import { SystemUpdateInterface } from "../../engine/system/SystemUpdateInterface";
import { PlayState } from "../play/PlayState";
import { MatchSystem } from "../../ecs/systems/MatchSystem";

export class MatchUpdateSystem implements SystemUpdateInterface {
    private map: any;
    private match: MatchSystem;

    constructor(state: PlayState) {
        this.map = state.map;
        this.match = state.match;
    }

    update(delta): boolean {
        for (const soldier of this.match.soldiers) {
            soldier.update(delta);

            if (soldier.dead) {
                const position = this.map.randomRespawnPosition();

                soldier.respawn(position);
            }
        }

        this.match.update(delta);

        return true;
    }
}
