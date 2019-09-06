import { Sprite } from './sprite';
import { Timer } from './timer';
import { Rect } from './rect';

const DEFAULT_ANIM_TIME    = 200;
const DEFAULT_RUNNER_SPEED = 30;

export class Runner extends Sprite {
    constructor(clock, rect=Rect(right=160, bottom=256), speed=DEFAULT_RUNNER_SPEED) {
        super(Runner.buildRunnerImage(), rect);

        this.speed = speed;

        this.animTimer = new Timer(clock, DEFAULT_ANIM_TIME * DEFAULT_RUNNER_SPEED / speed);
        this.animSpeed = -speed;
    }

    static buildRunnerImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        context.fillStyle = '#00f';
        context.fillRect(0, 0, canvas.width, canvas.height / 2);
        context.fillStyle = '#0f0';
        context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        return canvas;
    }

    collides(other) {
        return this.rect.collides(other.rect);
    }

    update(deltaTime) {
        this.animTimer.update();

        if (this.animTimer.timeout()) {
            this.animTimer.tick();
            this.animSpeed *= -1;
        }

        this.rect.y += deltaTime * this.animSpeed;
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
        this.rect.y += deltaTime * speed;
    }
}
