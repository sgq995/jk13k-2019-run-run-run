import { Renderer } from './renderer';
import { Runner } from './runner';

export default class App {
    constructor() {
        this.renderer = new Renderer('game-render');
        this.runnerList = [];
        this.player = new Runner();

        this.currentTick = Date.now();
        this.previousTick = this.currentTick;
    }

    start() {
        this.run();
    }

    update() {
        this.currentTick = Date.now();

        this.player.update(this.currentTick - this.previousTick);

        this.previousTick = this.currentTick;
    }

    draw() {
        this.renderer.clear();

        this.runnerList.forEach(runner => {
            runner.draw(this.renderer.context);
        });

        this.player.draw(this.renderer.context);
    }

    run() {
        requestAnimationFrame(() => this.run());

        this.update();
        this.draw();
    }
}
