import { Timer } from "./timer";
import { AutonomousRunner } from "./runner";
import { Rect } from "./rect";

const MIN_RUNNER_X_SPAWN = 140;
const MAX_RUNNER_X_SPAWN = 340;

const MIN_RUNNER_SPEED = 10;

const DEFAULT_RUNNER_Y_SPAWN = 40;

const MIN_RUNNER_SPAWN_TIME = 1000;
const MAX_RUNNER_SPWAN_TIME = 5000;

function normalRandom(mu=0.5, sigma=2) {
    let u1 = Math.random();
    let u2 = Math.random();

    while (u1 < Number.EPSILON) u1 = Math.random();
    while (u2 < Number.EPSILON) u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return sigma * z0 + mu;
}

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

        this.minTimeout = MIN_RUNNER_SPAWN_TIME;
        this.maxTimeout = MAX_RUNNER_SPWAN_TIME;

        this.timer.setTimeout(RunnerSpawner.generateSpwanTimeout(this.minTimeout, this.maxTimeout));
    }

    get timeout() {
        return this.maxTimeout;
    }

    set timeout(value) {
        this.maxTimeout = Math.max(this.minTimeout, value);
    }

    static generateRunner(player, clock) {
        // (MAX_RUNNER_X_SPAWN - MIN_RUNNER_X_SPAWN) / 2 + MIN_RUNNER_X_SPAWN
        // (MAX_RUNNER_X_SPAWN - MIN_RUNNER_X_SPAWN) / 2 / 3
        let sigma = DEFAULT_RUNNER_Y_SPAWN / player.y * player.width;
        let runnerX = parseInt(
            normalRandom(player.x + player.width / 2, 
                sigma / 3));
        runnerX = Math.max(MIN_RUNNER_X_SPAWN, Math.min(runnerX, MAX_RUNNER_X_SPAWN));
        let runnerSpeed = Math.random() * (player.speed / 8 - MIN_RUNNER_SPEED) + MIN_RUNNER_SPEED;
        return new AutonomousRunner(player.speed, clock, Rect.from({ x: runnerX, y: DEFAULT_RUNNER_Y_SPAWN }), runnerSpeed);
    }

    static generateSpwanTimeout(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    }

    reset() {
        this.timer.reset();
    }

    spawn() {
        this.timer.update();
        if (this.timer.timeout()) {
            this.timer.reset();
            this.timer.setTimeout(RunnerSpawner.generateSpwanTimeout(this.minTimeout, this.maxTimeout));
            return RunnerSpawner.generateRunner(this.player, this.clock);
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
