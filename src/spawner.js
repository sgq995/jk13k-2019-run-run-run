import { Timer } from "./timer";
import { AutonomousRunner } from "./runner";
import { Rect } from "./rect";

const MIN_RUNNER_X_SPAWN = 140;
const MAX_RUNNER_X_SPAWN = 340;

const MIN_RUNNER_SPEED = 5;

const DEFAULT_RUNNER_Y_SPAWN = 40;

const MIN_RUNNER_SPAWN_TIME = 5000;
const MAX_RUNNER_SPWAN_TIME = 10000;

class Spawner {
    constructor(clock, player) {
        this.clock = clock;
        this.player = player;
        this.timer = new Timer(clock);
    }

    spawn() {
        return null;
    }
}

export class RunnerSpawner extends Spawner {
    constructor(...args) {
        super(...args);

        this.timer.setTimeout(RunnerSpawner.generateSpwanTimeout());
    }

    static generateRunner(playerSpeed, clock) {
        let runnerX = parseInt(Math.random() * (MAX_RUNNER_X_SPAWN - MIN_RUNNER_X_SPAWN) + MIN_RUNNER_X_SPAWN);
        let runnerSpeed = Math.random() * (playerSpeed / 8 - MIN_RUNNER_SPEED) + MIN_RUNNER_SPEED;
        return new AutonomousRunner(playerSpeed, clock, Rect.from({ x: runnerX, y: DEFAULT_RUNNER_Y_SPAWN }), runnerSpeed);
    }

    static generateSpwanTimeout() {
        return parseInt(Math.random() * (MAX_RUNNER_SPWAN_TIME - MIN_RUNNER_SPAWN_TIME) + MIN_RUNNER_SPAWN_TIME);
    }

    reset() {
        this.timer.reset();
    }

    spawn() {
        this.timer.update();
        if (this.timer.timeout()) {
            this.timer.reset();
            this.timer.setTimeout(RunnerSpawner.generateSpwanTimeout());
            return RunnerSpawner.generateRunner(this.player.speed, this.clock);
        } else {
            return null;
        }
    }
}

export class PowerSpawner extends Spawner {
    constructor(...args) {
        super(...args);
    }
}
