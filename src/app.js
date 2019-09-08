import { Input } from './input';
import { Renderer } from './renderer';
import { Runner, AutonomousRunner } from './runner';
import { Clock } from './clock';
import { Timer } from './timer';
import { Rect } from './rect';

export class App {
    constructor() {
        document.addEventListener('visibilitychange', e => document['hidden'] ? this.stop() : this.start());
        window.addEventListener('blur', e => this.pause());
        window.addEventListener('focus', e => this.resume());

        this.running = false;
        this.requestAnimationId = -1;

        this.clock = new Clock(1);
        this.timer = new Timer(this.clock);

        this.score = 0;

        this.renderer = new Renderer('game-render');

        const playerRect = new Rect(160, 360);
        playerRect.width = 160;
        playerRect.height = 256;
        this.player = new Runner(this.clock, playerRect);
        this.runnerList = [
            new AutonomousRunner(this.player.speed, this.clock, Rect.from({ x: 20, y: 20, width: 80, height: 128 }), 15),
            new AutonomousRunner(this.player.speed, this.clock, Rect.from({ x: 320, y: 20, width: 80, height: 128 }), 5)
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

        this.runnerList.forEach(runner => {
            const context = runner.image.getContext('2d');
            if (this.player.collides(runner)) {
                context.fillStyle = '#f00';
                context.fillRect(0, 0, runner.image.width, runner.image.height);
            } else {
                context.fillStyle = '#00f';
                context.fillRect(0, 0, runner.image.width, runner.image.height);
            }
        });

        if (this.timer.deltaStart() > 500) {
            this.timer.reset();
            this.score++;
        }
    }

    draw() {
        this.renderer.clear();

        const frontRunners = this.runnerList.filter(runner => runner.y <= this.player.y);
        const backRunners = this.runnerList.filter(runner => runner.y > this.player.y);

        const drawRunner = runner => {
            if (!this.renderer.drawSprite(runner)) {
                runner.y = 0;
            }
        };

        frontRunners.forEach(drawRunner);
        this.renderer.drawSprite(this.player);
        backRunners.forEach(drawRunner);

        this.renderer.drawScore(this.score);
    }

    run(timestamp=0) {
        this.requestAnimationId = requestAnimationFrame(timestamp => this.run(timestamp), this.renderer.canvas);

        this.clock.update(timestamp);
        this.timer.tick();

        this.update();
        this.draw();
    }
}
