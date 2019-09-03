import { Input } from './input';
import { Renderer } from './renderer';
import { Runner, AutonomousRunner } from './runner';
import { Clock } from './clock';
import { Timer } from './timer';

export class App {
    constructor() {
        document.addEventListener('visibilitychange', e => document['hidden'] ? this.stop() : this.start());
        window.addEventListener('blur', e => this.pause());
        window.addEventListener('focus', e => this.resume());

        this.running = false;
        this.requestAnimationId = -1;

        this.clock = new Clock(1);
        this.timer = new Timer(this.clock);

        this.renderer = new Renderer('game-render');

        this.player = new Runner(this.clock, { x: 160, y: 384 });
        this.runnerList = [
            new AutonomousRunner(this.player.speed, this.clock, { x: 20, y: 20, width: 80, height: 128 }, 15),
            new AutonomousRunner(this.player.speed, this.clock, { x: 320, y: 20, width: 80, height: 128 }, 5)
        ];

        this.input = new Input(this.player);
    }

    start() {
        this.clock.reset();
        this.requestAnimationId = requestAnimationFrame(timestamp => this.run(timestamp), this.renderer.canvas);
    }

    stop() {
        this.requestAnimationId = cancelAnimationFrame(this.requestAnimationId);
    }

    resume() {
        this.running = true;
    }

    pause() {
        this.running = false;
    }

    update() {
        let deltaTime = this.clock.ticksToSeconds(this.timer.delta());
        
        this.input.handle(deltaTime);
        
        this.runnerList.forEach(runner => {
            runner.update(deltaTime);
        });
        this.player.update(deltaTime);
    }

    draw() {
        this.renderer.clear();

        this.runnerList.forEach(runner => {
            runner.draw(this.renderer.context);
        });
        this.player.draw(this.renderer.context);
    }

    run(timestamp=0) {
        this.requestAnimationId = requestAnimationFrame(timestamp => this.run(timestamp), this.renderer.canvas);

        this.clock.update(timestamp);
        this.timer.tick();

        this.update();
        this.draw();
    }
}
