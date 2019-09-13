import { Input } from './input';
import { Renderer } from './renderer';
import { Runner, AutonomousRunner } from './runner';
import { Clock } from './clock';
import { Timer } from './timer';
import { Rect } from './rect';
import { RunnerSpawner } from './spawner';
import { CPlayer } from './player-small';
import { song_running } from './song_running';

const TIMEOUT_LIST = [500, 500, 250, 250, 500, 500, 500, 1000, 500, 500, 250, 250, 250, 250, 500, 1500];

export class App {
    constructor() {
        this.started = false;
        this.running = false;
        this.requestAnimationId = -1;

        this.clock = new Clock(1);
        this.timer = new Timer(this.clock);

        this.currentScoreIdx = 0;
        this.currentScoreTimeout = TIMEOUT_LIST[this.currentScoreIdx];
        this.score = 0;

        this.renderer = new Renderer('game-render');

        this.songManager = new CPlayer();
        this.songManager.init(song_running);
        this.audio = document.createElement('audio');
        
        const id = setInterval(() => {
            const done = this.songManager.generate() >= 1;
            if (done) {
                clearInterval(id);
                const wave = this.songManager.createWave();
                const src = URL.createObjectURL(new Blob([wave], {type: 'audio/wav'}));
                // console.log(src);
                this.audio.loop = true;
                this.audio.src = src;
                this.audio.play();
            }
        }, 0);

        this.player = new Runner(this.clock);
        this.runnerList = [];
        this.runnerSpawner = new RunnerSpawner(this.clock, this.player);

        this.input = new Input(this.player);

        document.addEventListener('visibilitychange', e => document['hidden'] ? this.stop() : this.start());
        window.addEventListener('blur', e => this.pause());
        window.addEventListener('focus', e => this.resume());
    }

    start() {
        this.clock.reset();
        this.requestAnimationId = requestAnimationFrame(timestamp => this.run(timestamp), this.renderer.canvas);
        this.resume();
    }

    stop() {
        this.pause();
        this.requestAnimationId = cancelAnimationFrame(this.requestAnimationId);
    }

    resume() {
        this.audio.play();
        this.runnerSpawner.reset();
        this.running = true;
    }

    pause() {
        this.running = false;
        this.audio.pause();
    }

    update(deltaTime) {
        let newRunner = this.runnerSpawner.spawn();
        if (newRunner !== null && newRunner instanceof AutonomousRunner) {
            this.runnerList.push(newRunner);
        }
        
        this.player.x += this.input.delta.x;
        this.player.update(deltaTime);
        if (this.player.x < 0) {
            this.player.x = 0;
        } else if ((this.player.x + this.player.width) > this.renderer.rect.width) {
            this.player.x = this.renderer.rect.width - this.player.width;
        }

        this.runnerList.forEach(runner => {
            runner.update(deltaTime);
        });
        this.runnerList = this.runnerList.filter(runner => this.renderer.isVisible(runner.sprite));
        this.runnerList = this.runnerList.sort((runnerA, runnerB) => runnerA.y - runnerB.y);
        this.runnerList.forEach(runner => {
            if (this.player.collides(runner)) {
                runner.isCollided = true;
            } else {
                runner.isCollided = false;
            }
        });

        if (this.timer.deltaStart() >= this.currentScoreTimeout) {
            this.timer.reset();

            const nextScoreIdx = (this.currentScoreIdx + 1) % TIMEOUT_LIST.length;
            const nextScoreTimeout = TIMEOUT_LIST[nextScoreIdx];
            
            this.currentScoreIdx = nextScoreIdx;
            this.currentScoreTimeout = nextScoreTimeout;
            if (this.timer.deltaStart() > this.currentSocreTimeout) {
                this.currentScoreTimeout -= this.timer.deltaStart() - this.currentScoreTimeout;
            }
            
            this.score++;
        }
    }

    draw() {
        this.renderer.clear();

        const frontRunners = this.runnerList.filter(runner => runner.y <= this.player.y);
        const backRunners = this.runnerList.filter(runner => runner.y > this.player.y);

        const drawRunner = runner => this.renderer.drawRunner(runner);

        frontRunners.forEach(drawRunner);
        this.renderer.drawRunner(this.player);
        backRunners.forEach(drawRunner);

        this.renderer.drawScore(this.score);

        if (!this.running) {
            this.renderer.drawPaused();
        }
    }

    run(timestamp=0) {
        this.requestAnimationId = requestAnimationFrame(timestamp => this.run(timestamp), this.renderer.canvas);

        this.clock.update(timestamp);
        this.timer.tick();

        let deltaTime = this.clock.ticksToSeconds(this.timer.delta());
        
        this.input.handle(deltaTime);

        if (this.input.isPausePressed) {
            if (this.running) {
                this.pause();
            } else {
                this.resume();
            }
        }

        if (this.running) {
            this.update(deltaTime);
        }

        this.draw();
    }
}
