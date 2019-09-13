import { Input } from './input';
import { Renderer } from './renderer';
import { Runner, AutonomousRunner } from './runner';
import { Clock } from './clock';
import { Timer } from './timer';
import { Rect } from './rect';
import { RunnerSpawner } from './spawner';
import { CPlayer } from './player-small';
import { songRunning } from './song_running';
import { AudioManager } from './audio_manager';

const GAME_INIT_STATE = 0;
const GAME_RUNNING_STATE = 1;
const GAME_FOCUS_LOST_STATE = 2;
const GAME_PAUSED_STATE = 3;
const GAME_LOSE_STATE = 4;

const TIMEOUT_LIST = [500, 500, 250, 250, 500, 500, 500, 1000, 500, 500, 250, 250, 250, 250, 500, 1500];

const MAX_LIFE = 100;

export class App {
    constructor() {
        this.state = GAME_INIT_STATE;
        this.requestAnimationId = -1;

        this.clock = new Clock(1);
        this.timer = new Timer(this.clock);

        this.currentScoreIdx = 0;
        this.currentScoreTimeout = TIMEOUT_LIST[this.currentScoreIdx];
        this.score = 0;

        this.renderer = new Renderer('game-render');
        this.audioManager = new AudioManager();

        this.life = MAX_LIFE;
        this.player = new Runner(this.clock);
        this.runnerList = [];
        this.runnerSpawner = new RunnerSpawner(this.clock, this.player);

        this.input = new Input(this.player);

        document.addEventListener('visibilitychange', e => {
            if (this.state === GAME_RUNNING_STATE || this.state === GAME_FOCUS_LOST_STATE) {
                document['hidden'] ? this.stop() : this.start();
            }
        });
        window.addEventListener('blur', e => {
            if (this.state === GAME_RUNNING_STATE) {
                this.pause();
                this.state = GAME_FOCUS_LOST_STATE;
            }
        });
        window.addEventListener('focus', e => {
            if (this.state === GAME_FOCUS_LOST_STATE) {
                this.resume();
                this.state = GAME_RUNNING_STATE;
            }
        });
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

    resume(force=false) {
        if (force || this.state === GAME_RUNNING_STATE || this.state === GAME_FOCUS_LOST_STATE || this.state === GAME_PAUSED_STATE) {
            this.audioManager.playRunningSong();
        }
    }

    pause() {
        if (this.state === GAME_RUNNING_STATE) {
            this.audioManager.pauseRunningSong();
        }
    }

    reset() {
        if (this.state === GAME_LOSE_STATE) {
            this.runnerList = [];
            this.runnerSpawner.reset();

            this.audioManager.resetRunningSong();

            this.life = MAX_LIFE;
        }
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
        this.runnerList = this.runnerList.filter(runner => {
            if (Math.abs(runner.collisionFactor - 1.0) <= Number.EPSILON) {
                this.life = Math.max(0, this.life - 20);
                this.audioManager.playCrashSong();
                return false;
            }

            return this.renderer.isVisible(runner.sprite);
        });
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

        if (this.life == 0) {
            this.state = GAME_LOSE_STATE;
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

        this.renderer.drawLifeBar(this.life);

        this.renderer.drawScore(this.score);

        if (this.state === GAME_INIT_STATE) {

        } else if (this.state === GAME_FOCUS_LOST_STATE || this.state === GAME_PAUSED_STATE) {
            this.renderer.drawPaused();
        }
    }

    run(timestamp=0) {
        this.requestAnimationId = requestAnimationFrame(timestamp => this.run(timestamp), this.renderer.canvas);

        this.clock.update(timestamp);
        this.timer.tick();

        let deltaTime = this.clock.ticksToSeconds(this.timer.delta());
        
        this.input.handle(deltaTime);

        if (this.state === GAME_INIT_STATE) {
            if (this.input.isStartPressed) {
                this.resume(true);
                this.state = GAME_RUNNING_STATE;
            }
        } else if (this.state === GAME_RUNNING_STATE || this.state === GAME_PAUSED_STATE) {
            if (this.input.isPausePressed) {
                if (this.state === GAME_RUNNING_STATE) {
                    this.pause();
                    this.state = GAME_PAUSED_STATE;
                } else {
                    this.resume();
                    this.state = GAME_RUNNING_STATE;
                }
            }
        } else if (this.state === GAME_LOSE_STATE) {
            if (this.input.isStartPressed) {
                this.reset();
                this.state = GAME_RUNNING_STATE;
            }
        }

        if (this.state === GAME_RUNNING_STATE) {
            this.update(deltaTime);
        }

        this.draw();
    }
}
