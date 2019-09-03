import { Sprite } from './sprite';
import { Timer } from './timer';

const DEFAULT_ANIM_TIME    = 200;
const DEFAULT_RUNNER_SPEED = 30;

export class Runner extends Sprite {
    constructor(clock, { x=0, y=0, width=160, height=256 }, speed=DEFAULT_RUNNER_SPEED) {
        super(Runner.buildRunnerImage(), { x, y, width, height });

        this.speed = speed;

        this.animTimer = new Timer(clock, DEFAULT_ANIM_TIME * DEFAULT_RUNNER_SPEED / speed);
        this.animSpeed = -speed;
    }

    static buildRunnerImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 32;

        const image = canvas.getContext('2d');
        image.fillStyle = '#00f';
        image.fillRect(0, 0, canvas.width, canvas.height / 2);
        image.fillStyle = '#0f0';
        image.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        return canvas;
    }

    update(deltaTime) {
        this.animTimer.update();

        if (this.animTimer.timeout()) {
            this.animTimer.tick();
            this.animSpeed *= -1;
        }

        this.y += deltaTime * this.animSpeed;
    }
}

export class AutonomousRunner extends Runner {
    constructor(targetSpeed, ...args) {
        super(...args);

        this.targetSpeed = targetSpeed;
    }
    
    update(deltaTime) {
        super.update(deltaTime);

        let speed = this.targetSpeed - this.speed;
        this.y += deltaTime * speed;
    }
}
