const SPEED = 10;

class Player {
    constructor (x, y, z = 0, width = 32, height = 32) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = width;
        this.height = height;
    }

    moveUp () {
        this.velocity.y += 10;
    }

    stopMoving () {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    update (delta) {

    }
}

module.exports = Player;
